/**
 * Repère une mention `@pseudo` dans un message.
 * Les noms connus sont essayés du plus long au plus court, pour que
 * « @Alex Martin » ne s'arrête pas à « @Alex ».
 */
(() => {
  'use strict';

  const P7 = globalThis.P7;
  const state = P7.state;

  P7.isSelfMention = function isSelfMention(mentionText) {
    const name = P7.normalizeName(mentionText.replace(/^@/, '')).toLowerCase();
    return Boolean(name) && state.selfNames.has(name);
  };

  P7.mentionShouldHighlight = function mentionShouldHighlight(mentionText) {
    return P7.TEST_HIGHLIGHT_ALL || P7.isSelfMention(mentionText);
  };

  function knownNames() {
    const names = new Map();
    for (const name of state.users.values()) {
      const key = P7.normalizeName(name).toLowerCase();
      if (key) names.set(key, name);
    }
    for (const name of state.selfNames) {
      const key = P7.normalizeName(name).toLowerCase();
      if (key && !names.has(key)) names.set(key, name);
    }
    return [...names.values()].sort((a, b) => P7.normalizeName(b).length - P7.normalizeName(a).length);
  }

  /** Fin de pseudo : fin de texte, ou un caractère qui n'est pas une lettre du nom. */
  function isNameBoundary(ch) {
    if (ch === undefined) return true;
    return !/[\p{L}\p{N}_]/u.test(ch);
  }

  /** Le texte `rest` commence-t-il par `name`, espaces unicode acceptés entre les mots ? */
  function consumeName(rest, name) {
    const parts = P7.normalizeName(name).split(' ').filter(Boolean);
    if (!parts.length) return 0;
    let pos = 0;
    for (let i = 0; i < parts.length; i++) {
      if (i > 0) {
        const space = rest.slice(pos).match(/^\s+/);
        if (!space) return 0;
        pos += space[0].length;
      }
      const part = parts[i];
      if (rest.slice(pos, pos + part.length).toLowerCase() !== part.toLowerCase()) return 0;
      pos += part.length;
    }
    return isNameBoundary(rest[pos]) ? pos : 0;
  }

  /**
   * Si `raw[index]` est un `@`, renvoie la mention entière (`@Alex Martin`)
   * ou null. En mode test, un `@mot` inconnu compte quand même.
   */
  P7.matchMentionAt = function matchMentionAt(raw, index) {
    if (raw[index] !== '@') return null;
    const rest = raw.slice(index + 1);
    for (const name of knownNames()) {
      const size = consumeName(rest, name);
      if (size) return raw.slice(index, index + 1 + size);
    }
    if (!P7.TEST_HIGHLIGHT_ALL) return null;
    const loose = rest.match(/^[\p{L}\p{N}_][\p{L}\p{N}_.'’-]*/u);
    if (!loose || !isNameBoundary(rest[loose[0].length])) return null;
    return raw.slice(index, index + 1 + loose[0].length);
  };

  P7.hasKnownMention = function hasKnownMention(raw) {
    for (let i = 0; i < raw.length; i++) {
      if (raw[i] === '@' && P7.matchMentionAt(raw, i)) return true;
    }
    return false;
  };

  /** Un message déjà peint peut être revu quand on apprend le pseudo qu'il cite. */
  P7.invalidateKnownMentions = function invalidateKnownMentions() {
    for (const el of document.querySelectorAll('[data-tag="chat-message-text-content"]')) {
      if (el.closest('.p7tv-is-reply')) continue;
      const raw = el.getAttribute('data-p7tv-rendered') || '';
      if (!raw.includes('@') || !P7.hasKnownMention(raw)) continue;
      el.removeAttribute('data-p7tv-rendered');
      el.removeAttribute(P7.ROOT_ATTR);
    }
  };

  /** Requête après le dernier `@`, en gardant l'espace de fin (« Alex » + espace cherche « Alex … »). */
  P7.mentionQueryAtEnd = function mentionQueryAtEnd(value) {
    const match = String(value || '').match(/(?:^|\s)@([^@]*)$/);
    if (!match) return null;
    const spaced = String(match[1] || '').replace(/\u00a0/g, ' ');
    const trailing = /\s$/.test(spaced);
    let query = spaced.replace(/\s+/g, ' ').replace(/^\s+/, '');
    if (trailing && query && !query.endsWith(' ')) query += ' ';
    const names = [...state.users.values()].filter(P7.isPlausibleName);
    const q = query.toLowerCase();
    if (!names.length || !names.some((name) => P7.normalizeName(name).toLowerCase().startsWith(q))) return null;
    return query;
  };
})();
