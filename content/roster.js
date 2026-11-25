/**
 * Annuaire des pseudos du live, et identité du compte connecté.
 * Un pseudo avec des espaces (« Alex Martin ») est une seule entrée.
 * La liste survit au défilement virtuel et au rechargement de la page, pour ce live.
 */
(() => {
  'use strict';

  const P7 = globalThis.P7;
  const state = P7.state;
  let persistTimer = 0;
  let namesReady = false;
  let lastReactScan = 0;

  function eventId() {
    return location.pathname.match(/\/events\/(\d+)/)?.[1] || location.pathname;
  }

  /** Mémorise un pseudo. `touch` déclenche la sauvegarde, désactivé pendant le chargement. */
  P7.rememberUser = function rememberUser(name, touch = true) {
    const handle = P7.normalizeName(String(name || '').replace(/^@/, ''));
    if (!P7.isPlausibleName(handle)) return null;
    const key = handle.toLowerCase();
    if (state.users.get(key) === handle) return handle;
    if (state.users.has(key)) state.users.delete(key);
    state.users.set(key, handle);
    if (touch) schedulePersist();
    return handle;
  };

  function schedulePersist() {
    if (!namesReady || persistTimer) return;
    persistTimer = setTimeout(() => {
      persistTimer = 0;
      persistNames();
    }, 400);
  }

  /** Union avec le stockage : on n'écrase jamais la liste avec seulement les lignes visibles. */
  async function persistNames() {
    try {
      const id = eventId();
      const bag = await chrome.storage?.local?.get(P7.NAMES_KEY);
      const entry = bag?.[P7.NAMES_KEY];
      const merged = new Map();
      if (entry?.eventId === id && Array.isArray(entry.names)) {
        for (const name of entry.names) {
          const handle = P7.normalizeName(String(name || '').replace(/^@/, ''));
          if (P7.isPlausibleName(handle)) merged.set(handle.toLowerCase(), handle);
        }
      }
      for (const [key, handle] of state.users) {
        if (P7.isPlausibleName(handle)) merged.set(key, handle);
      }
      for (const [key, handle] of merged) {
        if (!state.users.has(key)) state.users.set(key, handle);
      }
      const names = [...merged.values()].slice(-500);
      await chrome.storage?.local?.set({ [P7.NAMES_KEY]: { eventId: id, names } });
    } catch (err) {
      console.warn(P7.PREFIX, 'Pseudos:', err);
    }
  }

  P7.loadStoredNames = async function loadStoredNames() {
    try {
      const bag = await chrome.storage?.local?.get(P7.NAMES_KEY);
      const entry = bag?.[P7.NAMES_KEY];
      if (entry?.eventId !== eventId() || !Array.isArray(entry.names)) return;
      for (const name of entry.names) P7.rememberUser(name, false);
      if (state.users.size) P7.log('Pseudos repris:', state.users.size);
    } catch (err) {
      console.warn(P7.PREFIX, 'Pseudos:', err);
    } finally {
      namesReady = true;
    }
  };

  function rememberAuthors(root) {
    const strongs = [];
    if (root.matches?.('strong') && root.closest('[class*="_messageBubbleTopHeader"]')) strongs.push(root);
    root.querySelectorAll?.(P7.SELECTORS.authorStrong).forEach((el) => strongs.push(el));
    for (const el of strongs) P7.rememberUser(P7.authorText(el));

    const imgs = [];
    if (root.matches?.('[data-tag="facepile"] img[alt], [class*="_avatar"] img[alt]')) imgs.push(root);
    root.querySelectorAll?.(P7.SELECTORS.authorAvatar).forEach((img) => imgs.push(img));
    for (const img of imgs) P7.rememberUser(P7.nameFromAlt(img.getAttribute('alt')));
  }

  /** Un nœud ajouté ou retiré par la liste virtuelle : on lit le pseudo avant qu'il disparaisse. */
  P7.harvestTree = function harvestTree(node) {
    if (node instanceof Element) rememberAuthors(node);
  };

  P7.collectPresentNames = function collectPresentNames() {
    const before = state.users.size;
    document.querySelectorAll(P7.SELECTORS.authorStrong).forEach((el) => {
      P7.rememberUser(P7.authorText(el));
    });
    document.querySelectorAll(P7.SELECTORS.authorAvatar).forEach((img) => {
      P7.rememberUser(P7.nameFromAlt(img.getAttribute('alt')));
    });
    if (state.users.size !== before) P7.log('Pseudos du live:', state.users.size);
    P7.readReactNames();
  };

  /**
   * Le chat ne peint qu'une fenêtre de messages. `page-names.js` (monde de la page)
   * lit l'historique déjà chargé dans React et nous le renvoie par postMessage.
   */
  P7.readReactNames = function readReactNames(force) {
    const now = Date.now();
    if (now - lastReactScan < (force ? 250 : 1500)) return;
    lastReactScan = now;
    window.postMessage({ type: 'p7tv-scan-names' }, '*');
  };

  window.addEventListener('message', (event) => {
    if (event.source !== window || event.data?.type !== 'p7tv-live-names' || !Array.isArray(event.data.names)) return;
    const before = state.users.size;
    for (const name of event.data.names) P7.rememberUser(name);
    if (state.users.size !== before) P7.log('Pseudos du live:', state.users.size);
  });

  /**
   * Pseudo affiché sur une ligne. L'avatar gagne si son nom complet est plus long
   * que le `<strong>` (le nom peut être coupé dans le titre et entier dans l'alt).
   */
  P7.getAuthor = function getAuthor(messageEl) {
    const header = messageEl.querySelector('[class*="_messageBubbleTopHeader"]');
    const fromStrong = P7.authorText(header?.querySelector('strong'));
    const fromAlt = P7.nameFromAlt(messageEl.querySelector('[class*="_avatar"] img[alt]')?.getAttribute('alt'));
    let handle = fromStrong;
    if (fromAlt && (!handle || (fromAlt.toLowerCase().startsWith(handle.toLowerCase()) && fromAlt.length > handle.length))) {
      handle = fromAlt;
    }
    if (!handle) handle = P7.normalizeName(messageEl.getAttribute('data-author') || '').replace(/^@/, '');
    return P7.rememberUser(handle);
  };

  function rememberSelfName(name) {
    const normalized = P7.normalizeName(name);
    if (normalized) state.selfNames.add(normalized.toLowerCase());
  }

  /** Nom du compte : JSON Next.js, puis le libellé du menu compte. */
  P7.loadSelfIdentity = function loadSelfIdentity() {
    try {
      const raw = document.getElementById('__NEXT_DATA__')?.textContent;
      if (raw) {
        const data = JSON.parse(raw);
        const env = data?.props?.pageProps?.bootstrapEnvelope;
        const user = env?.core_current_user?.data;
        const id = user?.id || env?.session?.user_id;
        if (id) state.selfUserId = String(id);
        rememberSelfName(user?.attributes?.full_name);
      }
    } catch (err) {
      console.warn(P7.PREFIX, 'Identité:', err);
    }
    rememberSelfName(
      document.querySelector('[data-tag="account-menu-toggle-combined"] [class*="_textOverflowEllipsis"]')?.textContent,
    );
  };

  /** Le pseudo affiché dans le chat peut différer du nom complet du compte. */
  P7.learnSelfFromMessage = function learnSelfFromMessage(messageEl) {
    if (!state.selfUserId) return;
    const before = state.selfNames.size;
    for (const img of messageEl.querySelectorAll('img')) {
      const src = img.getAttribute('src') || '';
      if (!src.includes(`/user/${state.selfUserId}/`)) continue;
      rememberSelfName(P7.getAuthor(messageEl));
      break;
    }
    if (state.selfNames.size !== before) P7.invalidateKnownMentions();
  };
})();
