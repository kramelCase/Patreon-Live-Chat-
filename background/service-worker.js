const GLOBAL_SET_URL = 'https://7tv.io/v3/emote-sets/global';
const CACHE_TTL_MS = 60 * 60 * 1000;

const DEFAULT_SETTINGS = {
  twitchUserId: '74397555',
  twitchLogin: 'dofla',
  includeGlobalEmotes: true,
  emoteSize: 28,
  caseSensitiveEmotes: false,
};

function normalizeEmote(emote) {
  const host = emote?.data?.host;
  if (!host?.url || !Array.isArray(host.files)) return null;
  const pick =
    host.files.find((f) => f.name === '2x.webp') ||
    host.files.find((f) => f.name === '1x.webp') ||
    host.files[0];
  if (!pick) return null;
  const base = host.url.startsWith('//') ? `https:${host.url}` : host.url;
  const url = `${base}/${pick.name}`;
  const zeroWidth = Boolean((emote.flags & (1 << 0)) || (emote.data?.flags & (1 << 8)));
  return {
    id: emote.id,
    name: emote.name,
    url,
    animated: Boolean(emote.data?.animated),
    zeroWidth,
  };
}

function parseEmoteSet(json) {
  const list = json?.emotes ?? [];
  const map = new Map();
  for (const raw of list) {
    const emote = normalizeEmote(raw);
    if (emote) map.set(emote.name, emote);
  }
  return map;
}

async function fetchJson(url) {
  const res = await fetch(url, { credentials: 'omit' });
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return res.json();
}

async function loadEmoteMaps(settings) {
  const channelUrl = `https://7tv.io/v3/users/twitch/${encodeURIComponent(settings.twitchUserId)}`;
  const user = await fetchJson(channelUrl);
  let channel = new Map();
  if (user?.emote_set?.emotes) {
    channel = parseEmoteSet(user.emote_set);
  } else if (user?.emote_set?.id) {
    const set = await fetchJson(`https://7tv.io/v3/emote-sets/${user.emote_set.id}`);
    channel = parseEmoteSet(set);
  }

  let globalMap = new Map();
  if (settings.includeGlobalEmotes) {
    const globalSet = await fetchJson(GLOBAL_SET_URL);
    globalMap = parseEmoteSet(globalSet);
  }

  return {
    channel: Object.fromEntries(channel),
    global: Object.fromEntries(globalMap),
    fetchedAt: Date.now(),
    twitchLogin: user?.username ?? settings.twitchLogin,
  };
}

async function getSettings() {
  const stored = await chrome.storage.sync.get(DEFAULT_SETTINGS);
  return { ...DEFAULT_SETTINGS, ...stored };
}

async function refreshCache(force = false) {
  const settings = await getSettings();
  const cached = await chrome.storage.local.get('emoteCache');
  const existing = cached.emoteCache;
  if (
    !force &&
    existing?.fetchedAt &&
    Date.now() - existing.fetchedAt < CACHE_TTL_MS &&
    existing.twitchUserId === settings.twitchUserId
  ) {
    return existing;
  }

  try {
    const data = await loadEmoteMaps(settings);
    const payload = { ...data, twitchUserId: settings.twitchUserId };
    await chrome.storage.local.set({ emoteCache: payload });
    return payload;
  } catch (err) {
    console.error('[Patreon Chat+]', err);
    if (existing) return existing;
    throw err;
  }
}

chrome.runtime.onInstalled.addListener(() => {
  refreshCache(true).catch(() => {});
});

chrome.runtime.onStartup.addListener(() => {
  refreshCache(false).catch(() => {});
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === 'GET_EMOTES') {
    refreshCache(Boolean(message.force))
      .then((data) => sendResponse({ ok: true, data }))
      .catch((err) => sendResponse({ ok: false, error: String(err) }));
    return true;
  }
  if (message?.type === 'GET_SETTINGS') {
    getSettings().then((data) => sendResponse({ ok: true, data }));
    return true;
  }
  return false;
});