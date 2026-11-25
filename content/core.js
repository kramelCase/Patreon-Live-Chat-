/**
 * Socle partagé par les content scripts (monde isolé de l'extension).
 * Les autres fichiers s'accrochent à `globalThis.P7`, dans l'ordre du manifest.
 *
 * Patreon régénère le préfixe des classes CSS (`y4cU7a_messageBubble`…).
 * On ne cible que des suffixes stables ou des `data-tag`.
 */
(() => {
  'use strict';

  const P7 = (globalThis.P7 = globalThis.P7 || {});

  P7.PREFIX = '[Patreon Chat+]';
  P7.ROOT_ATTR = 'data-p7tv-enhanced';
  P7.REPLY_ATTR = 'data-p7tv-reply';
  P7.NAMES_KEY = 'p7tv-live-names';

  /**
   * Surlignage d'une bulle qui cite quelqu'un.
   * false (prod) : seulement le pseudo du compte connecté.
   * true (test)  : n'importe quel pseudo cité.
   */
  P7.TEST_HIGHLIGHT_ALL = false;

  /** Pseudos du live, émotes 7TV, et nœuds DOM réutilisés entre les passes. */
  P7.state = {
    settings: {},
    emotes: { channel: {}, global: {} },
    users: new Map(),
    selfUserId: '',
    selfNames: new Set(),
    chatInput: null,
    chatRoot: null,
    autocomplete: null,
  };

  P7.SELECTORS = {
    liveVideo: 'video.str-video__video, video',
    chatRoot: [
      '[data-tag="message-list"]',
      '[data-tag="chats-send-message-form"]',
      '[class*="_chatContainer"]',
      '[class*="_chatRoot"]',
      '[class*="str-chat"]',
    ],
    message: ['[data-tag="chat-message"]'],
    messageText: ['[data-tag="chat-message-text-content"]'],
    input: [
      '#send-message',
      '[data-tag="chats-send-message-form"] textarea',
      'textarea.str-chat__textarea',
      'textarea[placeholder]',
    ],
    authorStrong: '[class*="_messageBubbleTopHeader"] strong',
    authorAvatar: '[data-tag="chat-message"] [class*="_avatar"] img[alt], [data-tag="facepile"] img[alt]',
  };

  P7.log = (...args) => console.log(P7.PREFIX, ...args);

  /** Espaces insécables et suites d'espaces → un seul espace normal. */
  P7.normalizeName = function normalizeName(name) {
    return String(name || '')
      .replace(/\u00a0/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  /** Un pseudo affiché, pas une feuille de style Patreon collée au nom. */
  P7.isPlausibleName = function isPlausibleName(name) {
    if (!name || name.length > 80) return false;
    return !/[{}<>]|@media|display\s*:|cbt_hide|cbt_show/i.test(name);
  };

  P7.qsAny = function qsAny(root, list) {
    for (const sel of list) {
      const el = root.querySelector(sel);
      if (el) return el;
    }
    return null;
  };

  P7.allAny = function allAny(root, list) {
    const seen = new Set();
    const out = [];
    for (const sel of list) {
      for (const el of root.querySelectorAll(sel)) {
        if (seen.has(el)) continue;
        seen.add(el);
        out.push(el);
      }
    }
    return out;
  };

  P7.isLivePage = function isLivePage() {
    return Boolean(
      document.querySelector('[data-tag="chat-message"]') ||
        document.querySelector('#send-message') ||
        document.querySelector('[data-tag="message-list"]') ||
        document.querySelector(P7.SELECTORS.liveVideo),
    );
  };

  P7.findChatRoot = function findChatRoot() {
    const state = P7.state;
    if (state.chatRoot && document.contains(state.chatRoot)) return state.chatRoot;
    for (const sel of P7.SELECTORS.chatRoot) {
      for (const node of document.querySelectorAll(sel)) {
        if (!node.querySelector(P7.SELECTORS.input.join(','))) continue;
        state.chatRoot = node.closest('[class*="str-chat"]') || node;
        return state.chatRoot;
      }
    }
    const input = document.querySelector(P7.SELECTORS.input.join(','));
    if (!input) return null;
    state.chatRoot =
      input.closest('[class*="str-chat"]') ||
      input.closest('[class*="chat"]') ||
      input.parentElement?.parentElement ||
      document.body;
    return state.chatRoot;
  };

  P7.findChatInput = function findChatInput(root) {
    const el = P7.qsAny(root || document, P7.SELECTORS.input);
    const state = P7.state;
    if (el && (!state.chatInput || !document.contains(state.chatInput))) {
      state.chatInput = el;
      P7.wireInput(el);
    }
    return state.chatInput;
  };

  /**
   * Texte visible d'un nœud, sans les `<style>` que Patreon glisse dans l'en-tête.
   * « Alex Martin » reste un seul pseudo, y compris si les mots sont séparés par un nbsp.
   */
  P7.authorText = function authorText(root) {
    if (!root) return '';
    const chunks = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || parent.closest('style, script, noscript, time')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    let node;
    while ((node = walker.nextNode())) chunks.push(node.nodeValue);
    return P7.normalizeName(chunks.join('')).replace(/^@/, '');
  };

  /** `alt` d'avatar : « Alex Martin's profile picture » ou le nom brut du facepile. */
  P7.nameFromAlt = function nameFromAlt(alt) {
    let raw = P7.normalizeName(alt);
    if (!raw) return '';
    raw = raw
      .replace(/['’]s profile picture$/i, '')
      .replace(/^photo de profil d['’e]\s+/i, '')
      .replace(/^image de profil d['’e]\s+/i, '')
      .replace(/,?\s*photo de profil$/i, '')
      .replace(/,?\s*image de profil$/i, '');
    raw = P7.normalizeName(raw);
    if (/profile picture|photo de profil|image de profil/i.test(raw)) return '';
    return raw;
  };
})();
