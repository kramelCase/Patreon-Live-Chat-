/**
 * Tourne dans le monde de la page (manifest `world: "MAIN"`), pas dans celui de l'extension.
 * Le content script isolé ne voit pas les objets React. On remonte la fibre du chat,
 * on en sort les pseudos déjà chargés (messages, membres, spectateurs) et on les
 * renvoie avec `postMessage` (`p7tv-live-names`). L'extension demande un scan via `p7tv-scan-names`.
 */
(() => {
  function personName(user) {
    if (!user || typeof user !== 'object') return '';
    const bags = [user];
    if (user.attributes && typeof user.attributes === 'object') bags.push(user.attributes);
    for (const source of bags) {
      const full = source.full_name || source.fullName || source.display_name || source.displayName;
      if (typeof full === 'string' && full.trim()) return full;
    }
    for (const source of bags) {
      if (typeof source.name === 'string' && source.name.trim()) return source.name;
    }
    return '';
  }

  function eachValue(collection, fn) {
    if (!collection || typeof collection !== 'object') return;
    if (typeof collection.length === 'number') {
      const total = Math.min(collection.length, 4000);
      for (let i = 0; i < total; i++) fn(collection[i]);
      return;
    }
    const keys = Object.keys(collection);
    const total = Math.min(keys.length, 1500);
    for (let i = 0; i < total; i++) fn(collection[keys[i]]);
  }

  function harvestPeople(collection, names) {
    eachValue(collection, (item) => {
      if (!item || typeof item !== 'object') return;
      const user =
        item.user ||
        item.sender ||
        item.author ||
        item.creator ||
        item.member ||
        item.patron ||
        item.message?.user ||
        item.data?.user;
      const fromUser = personName(user);
      if (fromUser) {
        names.add(fromUser);
        return;
      }
      if (item.user || item.sender || item.author) return;
      const direct = personName(item);
      if (direct && (item.image || item.avatar || item.online !== undefined || item.role || item.created_at)) {
        names.add(direct);
      }
    });
  }

  function harvestState(state, names) {
    if (!state || typeof state !== 'object') return;
    harvestPeople(state.messages, names);
    harvestPeople(state.members, names);
    harvestPeople(state.watchers, names);
    harvestPeople(state.read, names);
    harvestPeople(state.pinnedMessages, names);
    harvestPeople(state.latestMessages, names);
  }

  function harvestNode(node, names) {
    if (!node || typeof node !== 'object') return;
    harvestState(node.state, names);
    harvestState(node.channel?.state, names);
    harvestState(node.value?.channel?.state, names);
    harvestPeople(node.messages, names);
    harvestPeople(node.members, names);
    harvestPeople(node.watchers, names);
    harvestPeople(node.value?.messages, names);
    harvestPeople(node.value?.members, names);
    harvestPeople(node.data, names);
  }

  function reactFiber(el) {
    if (!el) return null;
    const key = Object.getOwnPropertyNames(el).find(
      (name) => name.startsWith('__reactFiber$') || name.startsWith('__reactInternalInstance$'),
    );
    return key ? el[key] : null;
  }

  function scan() {
    const names = new Set();
    const roots = [
      document.querySelector('[data-testid="virtuoso-scroller"]'),
      document.querySelector('[data-tag="message-list"]'),
      document.querySelector('[data-tag="chat-message"]'),
      document.querySelector('[data-tag="chats-send-message-form"]'),
    ];
    for (const el of roots) {
      let fiber = reactFiber(el);
      const seen = new Set();
      for (let hop = 0; fiber && hop < 80 && !seen.has(fiber); hop++) {
        seen.add(fiber);
        try {
          harvestNode(fiber.memoizedProps, names);
          let hook = fiber.memoizedState;
          for (let step = 0; hook && step < 40; step++) {
            harvestNode(hook.memoizedState, names);
            hook = hook.next;
          }
        } catch (err) {
          /* nœud illisible */
        }
        fiber = fiber.return;
      }
    }
    window.postMessage({ type: 'p7tv-live-names', names: [...names] }, '*');
  }

  window.addEventListener('message', (event) => {
    if (event.source !== window || event.data?.type !== 'p7tv-scan-names') return;
    scan();
  });
  scan();
})();
