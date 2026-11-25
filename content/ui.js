/**
 * Interface injectée dans le chat : bouton Répondre, bulles surlignées,
 * émotes 7TV et autocomplétion.
 * Le champ Patreon est contrôlé par React : on passe par le setter natif.
 */
(() => {
  'use strict';

  const P7 = globalThis.P7;
  const state = P7.state;
  let openReplyMenu = null;
  let acController = null;

  function emoteLookup(name) {
    const channel = state.emotes.channel || {};
    const globalEmotes = state.emotes.global || {};
    if (state.settings.caseSensitiveEmotes) return channel[name] || globalEmotes[name] || null;
    const key = name.toLowerCase();
    for (const [code, emote] of Object.entries(channel)) {
      if (code.toLowerCase() === key) return emote;
    }
    for (const [code, emote] of Object.entries(globalEmotes)) {
      if (code.toLowerCase() === key) return emote;
    }
    return null;
  }

  function buildEmoteList() {
    const merged = new Map();
    for (const [name, emote] of Object.entries(state.emotes.global || {})) merged.set(name, emote);
    for (const [name, emote] of Object.entries(state.emotes.channel || {})) merged.set(name, emote);
    return [...merged.entries()].map(([name, emote]) => ({ name, ...emote }));
  }

  P7.setNativeValue = function setNativeValue(input, value) {
    const proto = input instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    const desc = Object.getOwnPropertyDescriptor(proto, 'value');
    if (desc?.set) desc.set.call(input, value);
    else input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  };

  P7.insertAtCursor = function insertAtCursor(text) {
    const input = P7.findChatInput(P7.findChatRoot() || document);
    if (!input) return;
    if (input instanceof HTMLTextAreaElement || input instanceof HTMLInputElement) {
      const start = input.selectionStart ?? input.value.length;
      const end = input.selectionEnd ?? input.value.length;
      const next = `${input.value.slice(0, start)}${text}${input.value.slice(end)}`;
      P7.setNativeValue(input, next);
      const pos = start + text.length;
      input.setSelectionRange(pos, pos);
      input.focus();
      return;
    }
    if (input.isContentEditable) {
      input.focus();
      document.execCommand('insertText', false, text);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  };

  P7.closeReplyMenu = function closeReplyMenu() {
    if (!openReplyMenu) return;
    openReplyMenu.remove();
    openReplyMenu = null;
  };

  function openReplyFor(author, anchor) {
    P7.closeReplyMenu();
    const menu = document.createElement('div');
    menu.className = 'p7tv-reply-menu';
    menu.dataset.author = author;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'p7tv-reply-btn';
    btn.textContent = 'Répondre';
    btn.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      P7.insertAtCursor(`@${author} `);
      P7.closeReplyMenu();
    });
    menu.append(btn);
    document.body.append(menu);
    const rect = anchor.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();
    menu.style.left = `${Math.max(8, Math.min(rect.left, window.innerWidth - menuRect.width - 8))}px`;
    menu.style.top = `${rect.bottom + 6}px`;
    openReplyMenu = menu;
  }

  /** Clic sur le pseudo : menu « Répondre », qui écrit `@pseudo ` dans le champ. */
  P7.ensureReplyButton = function ensureReplyButton(messageEl) {
    if (messageEl.getAttribute(P7.REPLY_ATTR) === '1') return;
    const author = P7.getAuthor(messageEl);
    const nameEl = messageEl.querySelector(`${P7.SELECTORS.authorStrong}, strong`);
    if (!author || !nameEl) return;

    messageEl.setAttribute(P7.REPLY_ATTR, '1');
    messageEl.classList.add('p7tv-message-row');
    nameEl.classList.add('p7tv-author');
    nameEl.title = 'Répondre';
    nameEl.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (openReplyMenu?.dataset.author === author) {
        P7.closeReplyMenu();
        return;
      }
      openReplyFor(author, nameEl);
    });
  };

  function paintMention(container, frag, text) {
    const mention = document.createElement('span');
    mention.className = 'p7tv-mention';
    mention.textContent = text;
    frag.append(mention);
    container.classList.add('p7tv-is-reply');
    container.querySelectorAll('[class*="_messageBubbleDefault"]').forEach((bubble) => {
      bubble.classList.add('p7tv-reply-bubble');
    });
  }

  function appendEmote(frag, emote, pendingZero) {
    const img = document.createElement('img');
    img.className = 'p7tv-emote';
    img.src = emote.url;
    img.alt = emote.name;
    img.title = emote.name;
    img.width = state.settings.emoteSize || 28;
    img.height = state.settings.emoteSize || 28;
    img.loading = 'lazy';
    img.decoding = 'async';
    if (!emote.zeroWidth) {
      const wrap = document.createElement('span');
      wrap.className = 'p7tv-emote-wrap';
      wrap.append(img);
      frag.append(wrap);
      return wrap;
    }
    img.classList.add('p7tv-emote-zw');
    if (pendingZero?.classList.contains('p7tv-emote-wrap')) {
      pendingZero.append(img);
      return pendingZero;
    }
    const wrap = document.createElement('span');
    wrap.className = 'p7tv-emote-wrap';
    wrap.append(img);
    frag.append(wrap);
    return wrap;
  }

  /** Découpe le texte en mentions connues et en morceaux à passer aux émotes. */
  function splitPieces(raw) {
    const pieces = [];
    for (let i = 0; i < raw.length; ) {
      const mention = P7.matchMentionAt(raw, i);
      if (mention) {
        pieces.push({ kind: 'mention', text: mention });
        i += mention.length;
        continue;
      }
      const nextAt = raw.indexOf('@', i + (raw[i] === '@' ? 1 : 0));
      const end = nextAt === -1 ? raw.length : nextAt;
      pieces.push({ kind: 'text', text: raw.slice(i, Math.max(end, i + 1)) });
      i = Math.max(end, i + 1);
    }
    return pieces;
  }

  /**
   * Remplace le texte d'une bulle : mentions surlignées (selon le mode) et émotes 7TV.
   * Patreon duplique le texte mobile / desktop : chaque copie est traitée.
   */
  P7.renderMessage = function renderMessage(container) {
    if (container.getAttribute(P7.ROOT_ATTR) === '1') return;
    const targets = P7.allAny(container, P7.SELECTORS.messageText);
    if (!targets.length && container.matches(P7.SELECTORS.messageText.join(','))) targets.push(container);

    for (const el of targets) {
      if (el.childElementCount > 20) continue;
      const raw = el.textContent;
      if (!raw?.trim() || el.getAttribute('data-p7tv-rendered') === raw) continue;

      const frag = document.createDocumentFragment();
      let pendingZero = null;
      for (const piece of splitPieces(raw)) {
        if (piece.kind === 'mention') {
          if (P7.mentionShouldHighlight(piece.text)) paintMention(container, frag, piece.text);
          else frag.append(document.createTextNode(piece.text));
          pendingZero = null;
          continue;
        }
        for (const part of piece.text.split(/(\s+)/)) {
          if (/^\s+$/.test(part)) {
            frag.append(document.createTextNode(part));
            continue;
          }
          const emote = emoteLookup(part.replace(/^:+|:+$/g, ''));
          if (!emote) {
            frag.append(document.createTextNode(part));
            pendingZero = null;
            continue;
          }
          pendingZero = appendEmote(frag, emote, pendingZero);
        }
      }
      el.textContent = '';
      el.append(frag);
      el.setAttribute('data-p7tv-rendered', raw);
      el.setAttribute(P7.ROOT_ATTR, '1');
    }
  };

  function destroyAutocomplete() {
    state.autocomplete?.remove();
    state.autocomplete = null;
  }

  function showAutocomplete(items, anchorEl, onPick) {
    destroyAutocomplete();
    if (!items.length) return;

    const box = document.createElement('div');
    box.className = 'p7tv-autocomplete';
    box.setAttribute('role', 'listbox');
    let active = 0;

    const render = () => {
      box.innerHTML = '';
      items.slice(0, 200).forEach((item, i) => {
        const row = document.createElement('button');
        row.type = 'button';
        row.className = 'p7tv-ac-item' + (i === active ? ' is-active' : '');
        if (item.kind === 'emote') {
          const img = document.createElement('img');
          img.src = item.url;
          img.alt = '';
          img.width = 22;
          img.height = 22;
          row.append(img);
          const label = document.createElement('span');
          label.textContent = item.name;
          row.append(label);
        } else {
          row.textContent = `@${item.name}`;
        }
        row.addEventListener('mousedown', (event) => {
          event.preventDefault();
          onPick(item);
          destroyAutocomplete();
        });
        box.append(row);
      });
    };
    render();

    const rect = anchorEl.getBoundingClientRect();
    box.style.left = `${Math.max(8, rect.left)}px`;
    box.style.top = `${Math.max(8, rect.top - 8)}px`;
    box.style.transform = 'translateY(-100%)';
    document.body.append(box);
    state.autocomplete = box;

    return {
      move(delta) {
        if (!items.length) return;
        active = (active + delta + items.length) % items.length;
        render();
      },
      pickActive() {
        onPick(items[active]);
        destroyAutocomplete();
      },
      close: destroyAutocomplete,
    };
  }

  function tokenAtEnd(value) {
    const mention = P7.mentionQueryAtEnd(value);
    if (mention !== null) return { prefix: '@', query: mention };
    const emote = value.match(/(?:^|\s)(:)(\S*)$/);
    if (emote) return { prefix: ':', query: emote[2] };
    const word = value.match(/(?:^|\s)(\S+)$/);
    if (!word) return null;
    return { prefix: '', query: word[1] };
  }

  /** Remplace le jeton en cours (`@Jee` ou `dof`) par le choix, en gardant l'espace d'avant. */
  function replaceToken(value, replacement) {
    const pattern = P7.mentionQueryAtEnd(value) !== null ? /(?:^|\s)@[^@]*$/ : /(?:^|\s)([@:]?\S*)$/;
    return value.replace(pattern, (chunk) => `${/^\s/.test(chunk) ? chunk[0] : ''}${replacement}`);
  }

  function mentionItems(query) {
    const q = query.toLowerCase();
    return [...state.users.values()]
      .reverse()
      .filter((name) => P7.isPlausibleName(name) && (!q || P7.normalizeName(name).toLowerCase().startsWith(q)))
      .slice(0, 200)
      .map((name) => ({ kind: 'user', name }));
  }

  function emoteItems(query) {
    const q = query.toLowerCase();
    return buildEmoteList()
      .filter((emote) => emote.name.toLowerCase().includes(q))
      .sort((a, b) => {
        const al = a.name.toLowerCase();
        const bl = b.name.toLowerCase();
        if (al === q) return -1;
        if (bl === q) return 1;
        if (al.startsWith(q) && !bl.startsWith(q)) return -1;
        if (bl.startsWith(q) && !al.startsWith(q)) return 1;
        return al.localeCompare(bl);
      })
      .slice(0, 12)
      .map((emote) => ({ kind: 'emote', name: emote.name, url: emote.url }));
  }

  function applySuggestion(input, item) {
    const insert = item.kind === 'user' ? `@${item.name} ` : `${item.name} `;
    if (input instanceof HTMLTextAreaElement || input instanceof HTMLInputElement) {
      const next = replaceToken(input.value, insert);
      P7.setNativeValue(input, next);
      input.setSelectionRange(next.length, next.length);
      input.focus();
      return;
    }
    const next = replaceToken(input.textContent || '', insert);
    input.textContent = next;
    input.focus();
    const range = document.createRange();
    range.selectNodeContents(input);
    range.collapse(false);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }

  /**
   * Entrée choisit la suggestion au lieu d'envoyer le message.
   * Le listener est en capture sur window : il passe avant le onKeyDown React de Patreon.
   */
  function keepEnterForSuggestion(input) {
    let blockKeyUp = false;
    window.addEventListener(
      'keydown',
      (event) => {
        if (event.key !== 'Enter' || event.shiftKey || event.isComposing) return;
        if (event.target !== input || !acController) return;
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        blockKeyUp = true;
        if (!event.repeat) acController.pickActive();
      },
      true,
    );
    window.addEventListener(
      'keyup',
      (event) => {
        if (event.key !== 'Enter' || !blockKeyUp || event.target !== input) return;
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        blockKeyUp = false;
      },
      true,
    );
  }

  P7.wireInput = function wireInput(input) {
    if (input.getAttribute('data-p7tv-input') === '1') return;
    input.setAttribute('data-p7tv-input', '1');

    input.addEventListener('input', () => {
      try {
        const value = input instanceof HTMLTextAreaElement || input instanceof HTMLInputElement
          ? input.value
          : input.textContent || '';
        const token = tokenAtEnd(value);
        const isMention = token?.prefix === '@';
        if (!token || (!isMention && !token.query)) {
          destroyAutocomplete();
          acController = null;
          return;
        }
        if (isMention) {
          P7.readReactNames(true);
          P7.collectPresentNames();
        }
        const items = isMention ? mentionItems(token.query) : emoteItems(token.query);
        acController = showAutocomplete(items, input, (item) => applySuggestion(input, item));
      } catch (err) {
        console.warn(P7.PREFIX, 'Autocomplétion:', err);
      }
    });

    keepEnterForSuggestion(input);
    input.addEventListener('keydown', (event) => {
      if (!acController) return;
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        acController.move(event.key === 'ArrowDown' ? 1 : -1);
      } else if (event.key === 'Tab') {
        event.preventDefault();
        event.stopPropagation();
        acController.pickActive();
      } else if (event.key === 'Escape') {
        acController.close();
        acController = null;
      }
    });
    input.addEventListener('blur', () => setTimeout(destroyAutocomplete, 150));
  };
})();
