const GLOBAL_SET_URL = 'https://7tv.io/v3/emote-sets/global';
const CACHE_TTL_MS = 60 * 60 * 1000;

/** Aucune chaîne n'est préremplie : les ID Twitch se choisissent dans les options. */
const DEFAULT_SETTINGS = {
  twitchUserIds: [],
  twitchUserId: '',
  twitchLogin: '',
  includeGlobalEmotes: true,
  emoteSize: 48,
  caseSensitiveEmotes: false,
};

/** Liste d'IDs numériques. Un ancien champ unique `twitchUserId` compte encore. */
function streamerIds(settings) {
  const list = Array.isArray(settings?.twitchUserIds) ? settings.twitchUserIds : [];
  const ids = list.map((id) => String(id).trim()).filter((id) => /^\d+$/.test(id));
  const legacy = String(settings?.twitchUserId || '').trim();
  if (!ids.length && /^\d+$/.test(legacy)) ids.push(legacy);
  return [...new Set(ids)];
}

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

/** Nom de chaîne Twitch ou ID numérique → { id, label }. */
async function resolveTwitch(query) {
  const token = String(query || '').trim().replace(/^@/, '');
  if (/^\d+$/.test(token)) {
    try {
      const user = await fetchJson(`https://7tv.io/v3/users/twitch/${encodeURIComponent(token)}`);
      return { id: token, label: user?.username || token };
    } catch {
      return { id: token, label: token };
    }
  }
  if (!/^[a-zA-Z0-9_]{2,25}$/.test(token)) throw new Error('invalid');
  const res = await fetch(`https://api.ivr.fi/v2/twitch/user?login=${encodeURIComponent(token)}`, {
    credentials: 'omit',
  });
  if (!res.ok) throw new Error(String(res.status));
  const list = await res.json();
  const user = Array.isArray(list) ? list[0] : null;
  if (!user?.id) throw new Error('not-found');
  return { id: String(user.id), label: user.login || token };
}

const TWITCH_GQL = 'https://gql.twitch.tv/gql';
const TWITCH_CLIENT_ID = 'kimne78kx3ncx6brgo4mv6wki5h1ko';
const TWITCH_SEARCH_QUERY =
  'query($q:String!){searchFor(userQuery:$q,platform:"web"){channels{edges{item{... on User{id login displayName profileImageURL(width:70)}}}}}}';

function twitchAvatar(url) {
  if (typeof url !== 'string' || !url.startsWith('https://static-cdn.jtvnw.net/')) return '';
  return url;
}

/** Quelques lettres → chaînes Twitch { id, login, displayName, avatar }. Pas de bio. */
async function searchTwitch(query) {
  const token = String(query || '').trim().replace(/^@/, '');
  if (token.length < 2) return [];
  const res = await fetch(TWITCH_GQL, {
    method: 'POST',
    credentials: 'omit',
    headers: {
      'Client-ID': TWITCH_CLIENT_ID,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: TWITCH_SEARCH_QUERY,
      variables: { q: token },
    }),
  });
  if (!res.ok) throw new Error(String(res.status));
  const json = await res.json();
  const edges = json?.data?.searchFor?.channels?.edges || [];
  const seen = new Set();
  const matches = [];
  for (const edge of edges) {
    const user = edge?.item;
    if (!user?.id || !user.login) continue;
    const id = String(user.id);
    if (seen.has(id)) continue;
    seen.add(id);
    matches.push({
      id,
      login: String(user.login),
      displayName: String(user.displayName || user.login),
      avatar: twitchAvatar(user.profileImageURL),
    });
    if (matches.length >= 8) break;
  }
  return matches;
}

async function fetchJson(url) {
  const res = await fetch(url, { credentials: 'omit' });
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return res.json();
}

async function loadChannelSet(twitchUserId) {
  const user = await fetchJson(`https://7tv.io/v3/users/twitch/${encodeURIComponent(twitchUserId)}`);
  let emotes = new Map();
  if (user?.emote_set?.emotes) emotes = parseEmoteSet(user.emote_set);
  else if (user?.emote_set?.id) {
    const set = await fetchJson(`https://7tv.io/v3/emote-sets/${user.emote_set.id}`);
    emotes = parseEmoteSet(set);
  }
  return { login: user?.username || '', emotes };
}

async function loadEmoteMaps(settings) {
  const channel = new Map();
  const ids = streamerIds(settings);
  const groups = [];
  const errors = [];
  for (const id of ids) {
    try {
      const part = await loadChannelSet(id);
      groups.push({
        kind: 'channel',
        id,
        label: part.login || id,
        emotes: Object.fromEntries(part.emotes),
      });
      for (const [name, emote] of part.emotes) channel.set(name, emote);
    } catch (err) {
      errors.push(err);
      groups.push({ kind: 'channel', id, label: id, emotes: {}, error: String(err) });
    }
  }

  let globalMap = new Map();
  if (settings.includeGlobalEmotes) {
    try {
      globalMap = parseEmoteSet(await fetchJson(GLOBAL_SET_URL));
      groups.push({
        kind: 'global',
        id: 'global',
        label: '7TV',
        emotes: Object.fromEntries(globalMap),
      });
    } catch (err) {
      errors.push(err);
      groups.push({ kind: 'global', id: 'global', label: '7TV', emotes: {}, error: String(err) });
    }
  }
  if (!channel.size && !globalMap.size && errors.length) throw errors[0];

  return {
    channel: Object.fromEntries(channel),
    global: Object.fromEntries(globalMap),
    groups,
    fetchedAt: Date.now(),
    twitchUserIds: ids,
  };
}

/** Ouvre les options une fois, tant qu'aucun ID Twitch n'est enregistré. */
async function offerStreamerOnce() {
  const stored = await chrome.storage.sync.get(['twitchUserId', 'twitchUserIds']);
  if (streamerIds(stored).length) return;
  const seen = await chrome.storage.local.get('p7tv-streamer-prompt');
  if (seen['p7tv-streamer-prompt']) return;
  await chrome.storage.local.set({ 'p7tv-streamer-prompt': true });
  chrome.runtime.openOptionsPage();
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
    existing.channelKey === streamerIds(settings).join(',')
  ) {
    return existing;
  }

  try {
    const data = await loadEmoteMaps(settings);
    const payload = { ...data, channelKey: streamerIds(settings).join(',') };
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

chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
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
  if (message?.type === 'RESOLVE_TWITCH') {
    resolveTwitch(message.query)
      .then((data) => sendResponse({ ok: true, data }))
      .catch((err) => sendResponse({ ok: false, error: String(err) }));
    return true;
  }
  if (message?.type === 'SEARCH_TWITCH') {
    searchTwitch(message.query)
      .then((data) => sendResponse({ ok: true, data }))
      .catch((err) => sendResponse({ ok: false, error: String(err) }));
    return true;
  }
  return false;
});