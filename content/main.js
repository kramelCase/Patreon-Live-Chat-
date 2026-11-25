/**
 * Point d'entrée. Observe le chat Patreon et relance le traitement
 * quand la liste virtuelle ajoute ou recycle des messages.
 *
 * Ordre de chargement (manifest) : core → roster → mentions → ui → main.
 */
(() => {
  'use strict';

  const P7 = globalThis.P7;
  const state = P7.state;

  function messageRows(root) {
    return P7.allAny(root, P7.SELECTORS.message).filter((el) => {
      const text = P7.qsAny(el, P7.SELECTORS.messageText);
      if (!text || text === el || !el.contains(text)) return false;
      if (el.parentElement?.closest(`[${P7.REPLY_ATTR}="1"]`)) return false;
      return true;
    });
  }

  function enhanceMessages(root) {
    const messages = messageRows(root);
    for (const message of messages) {
      P7.ensureReplyButton(message);
      P7.learnSelfFromMessage(message);
    }
    for (const message of messages) P7.renderMessage(message);
  }

  let scheduled = false;
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      if (!P7.isLivePage()) return;
      const root = P7.findChatRoot();
      if (!root) return;
      P7.findChatInput(root);
      P7.collectPresentNames();
      P7.invalidateKnownMentions();
      enhanceMessages(root);
    });
  }

  async function loadEmotes() {
    const [emoteRes, settingsRes] = await Promise.all([
      chrome.runtime.sendMessage({ type: 'GET_EMOTES' }),
      chrome.runtime.sendMessage({ type: 'GET_SETTINGS' }),
    ]);
    if (settingsRes?.ok) state.settings = settingsRes.data;
    if (!emoteRes?.ok) return;
    state.emotes = {
      channel: emoteRes.data.channel || {},
      global: emoteRes.data.global || {},
    };
    P7.log(
      'Émotes chargées:',
      Object.keys(state.emotes.channel).length,
      'chaîne,',
      Object.keys(state.emotes.global).length,
      'globales',
    );
  }

  function watchChat() {
    document.addEventListener('click', P7.closeReplyMenu);
    document.addEventListener(
      'scroll',
      () => {
        P7.closeReplyMenu();
        schedule();
      },
      true,
    );
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach(P7.harvestTree);
        mutation.removedNodes.forEach(P7.harvestTree);
      }
      schedule();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    setInterval(() => {
      if (P7.isLivePage()) P7.collectPresentNames();
    }, 800);
    schedule();
  }

  async function bootstrap() {
    try {
      await loadEmotes();
    } catch (err) {
      console.warn(P7.PREFIX, 'Bootstrap:', err);
    }
    P7.loadSelfIdentity();
    await P7.loadStoredNames();
    P7.log('Compte:', state.selfUserId || 'inconnu', [...state.selfNames].join(', ') || 'pseudo inconnu');
    watchChat();
    P7.log('Actif sur Patreon Live.');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bootstrap);
  else bootstrap();
})();
