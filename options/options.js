const STRINGS = {
  fr: {
    tabHome: 'Accueil',
    tabSettings: 'Réglages',
    homeTitle: 'Le chat du live',
    homeLede: 'Ces ajouts au chat des lives Patreon ne sont visibles que pour toi.',
    featReply: 'Répondre',
    featReplyText: 'Clique sur le pseudo d’un message : un bouton Répondre apparaît. Il écrit dans le champ @ suivi du nom complet, même s’il contient des espaces.',
    featAt: 'Autocomplétion',
    featAtText: 'En tapant @ puis quelques lettres, tu vois les personnes présentes dans le chat. La touche Entrée insère le nom choisi, sans envoyer le message.',
    featGlow: 'Mise en avant',
    featGlowText: 'Les messages qui te répondent sont mis en avant. Les autres restent tels quels.',
    featEmotes: 'Émotes 7TV',
    featEmotesText: 'Les noms d’émotes 7TV s’affichent en image. Les spectateurs qui n’ont pas l’extension continuent de voir le texte.',
    guideTitle: 'Utiliser le chat',
    step1: 'Ajouter les émotes 7TV d’un streameur Twitch',
    step1hint: 'Écris le nom de sa chaîne Twitch, pas son pseudo Patreon. Ses émotes s’ajoutent au chat. Tu peux en ajouter plusieurs.',
    step2: 'Recharger la page du live pour les voir',
    step2hint: 'Recharge la page Patreon du live. Les émotes, Répondre et les suggestions apparaissent alors. Personne d’autre ne les voit.',
    step3: 'Choisir la taille et parcourir les émotes',
    step3hint: 'Règle la taille affichée dans le chat, vérifie l’aperçu, puis ouvre la liste de chaque streameur ou les émotes globales.',
    seeEmotes: 'Voir les émotes',
    savedShort: 'Enregistré. Recharge l’onglet du live.',
    tabEmotes: 'Émotes',
    tabAbout: 'À propos',
    streamersLead: 'Ajoute un ou plusieurs streameurs par leur nom de chaîne ou leur ID Twitch.',
    streamerCount: '{n} chaîne(s) Twitch.',
    add: 'Ajouter',
    hintTags: 'Nom de chaîne ou ID numérique. Entrée ajoute le tag. Enregistrer applique la liste.',
    idPlaceholder: 'nom Twitch',
    resolving: 'Recherche de la chaîne…',
    notFound: 'Chaîne Twitch introuvable.',
    globalEmotes: 'Ajouter aussi les émotes 7TV globales',
    caseSensitive: 'Respecter les majuscules dans les noms d’émotes',
    emoteSize: 'Taille dans le chat',
    previewHint: 'C’est la taille affichée dans le chat. Recharge la page du live pour l’appliquer.',
    previewBefore: 'Salut',
    previewAfter: 'tout le monde',
    viewStreamers: 'Par streameur',
    viewGlobal: 'Émotes globales',
    filter: 'Filtrer',
    filterPlaceholder: 'Nom d’émote',
    galleryEmptyStreamers: 'Aucune chaîne pour l’instant. Ajoute un nom Twitch ci-dessus.',
    galleryEmptyGlobal: 'Les émotes globales ne sont pas chargées.',
    save: 'Enregistrer',
    refresh: 'Recharger les émotes',
    saved: 'Enregistré. Recharge l’onglet du live Patreon.',
    savedEmpty: 'Aucun streameur. Seules les émotes globales seront chargées.',
    invalidId: 'L’ID Twitch doit être numérique.',
    duplicate: 'Déjà dans la liste.',
    remove: 'Retirer',
    galleryEmpty: 'Aucune émote pour l’instant. Ajoute des streameurs, enregistre, puis recharge.',
    galleryLoading: 'Chargement des émotes…',
    galleryError: 'Échec du chargement.',
    groupGlobal: 'Émotes globales 7TV',
    emoteCount: '{n} émotes',
    groupError: 'Ce groupe n’a pas pu être chargé.',
    aboutLede: 'Réponses, autocomplétion et émotes 7TV sur les lives Patreon ouverts dans le navigateur.',
    aboutFirefox: 'Firefox / Zen : about:debugging → charger un module temporaire → manifest.json',
    aboutChrome: 'Chrome, Edge et Opera demandent une variante dont l’arrière-plan est un service worker.',
    aboutSafari: 'Safari demande un projet Xcode « Safari Web Extension », sur un Mac.',
    aboutLive: 'Pendant un live, ouvre la page du live dans le navigateur, pas l’application mobile.',
    cacheUpdated: 'Cache mis à jour : {channel} émotes de chaîne, {global} globales.',
  },
  en: {
    tabHome: 'Home',
    tabSettings: 'Settings',
    homeTitle: 'The live chat',
    homeLede: 'These additions to the Patreon live chat are visible only to you.',
    featReply: 'Reply',
    featReplyText: 'Click a name on a message and a Reply button appears. It writes @ and the full name, including spaces, into the message field.',
    featAt: 'Autocomplete',
    featAtText: 'Type @ and a few letters to see the people in the chat. Enter inserts the chosen name and does not send the message.',
    featGlow: 'Brought forward',
    featGlowText: 'Messages that reply to you are brought forward. The others stay as they are.',
    featEmotes: '7TV emotes',
    featEmotesText: '7TV emote names are shown as images. Viewers without the extension still see the text.',
    guideTitle: 'Use the chat',
    step1: 'Add a Twitch streamer’s 7TV emotes',
    step1hint: 'Type their Twitch channel name, not their Patreon name. Their emotes are added to the chat. You can add more than one.',
    step2: 'Reload the live page to see them',
    step2hint: 'Reload the Patreon live page. Emotes, Reply, and suggestions then appear. Nobody else sees them.',
    step3: 'Choose the size and browse the emotes',
    step3hint: 'Set the size shown in the chat, check the preview, then open each streamer’s list or the global emotes.',
    seeEmotes: 'See emotes',
    savedShort: 'Saved. Reload the live tab.',
    tabEmotes: 'Emotes',
    tabAbout: 'About',
    streamersLead: 'Add one or more streamers by channel name or Twitch ID.',
    streamerCount: '{n} Twitch channel(s).',
    add: 'Add',
    hintTags: 'Channel name or numeric ID. Enter adds the tag. Save applies the list.',
    idPlaceholder: 'Twitch name',
    resolving: 'Looking up the channel…',
    notFound: 'Twitch channel not found.',
    globalEmotes: 'Include global 7TV emotes',
    caseSensitive: 'Case-sensitive emote names',
    emoteSize: 'Emote size (px)',
    previewHint: 'This is the size shown in the chat. Reload the live page to apply it.',
    previewBefore: 'Hey',
    previewAfter: 'everyone',
    viewStreamers: 'By streamer',
    viewGlobal: 'Global emotes',
    filter: 'Filter',
    filterPlaceholder: 'Emote name',
    galleryEmptyStreamers: 'No channel yet. Add a Twitch name above.',
    galleryEmptyGlobal: 'Global 7TV emotes are not loaded.',
    save: 'Save',
    refresh: 'Reload emotes',
    saved: 'Saved. Reload the Patreon live tab.',
    savedEmpty: 'No streamer. Only global emotes will load.',
    invalidId: 'The Twitch ID must be numeric.',
    duplicate: 'Already in the list.',
    remove: 'Remove',
    galleryEmpty: 'No emotes yet. Add streamers, save, then reload.',
    galleryLoading: 'Loading emotes…',
    galleryError: 'Could not load emotes.',
    groupGlobal: 'Global 7TV emotes',
    emoteCount: '{n} emotes',
    groupError: 'This group could not be loaded.',
    aboutLede: 'Replies, autocomplete, and 7TV emotes on Patreon lives opened in the browser.',
    aboutFirefox: 'Firefox / Zen: about:debugging → Load Temporary Add-on → manifest.json',
    aboutChrome: 'Chrome, Edge, and Opera need a build whose background is a service worker.',
    aboutSafari: 'Safari needs an Xcode “Safari Web Extension” project, on a Mac.',
    aboutLive: 'During a live, open the live page in the browser, not the mobile app.',
    cacheUpdated: 'Cache updated: {channel} channel emotes, {global} global.',
  },
  es: {
    tabHome: 'Inicio',
    tabSettings: 'Ajustes',
    homeTitle: 'El chat del directo',
    homeLede: 'Estos añadidos al chat de los directos de Patreon solo los ves tú.',
    featReply: 'Responder',
    featReplyText: 'Haz clic en el nombre de un mensaje: aparece un botón Responder. Escribe en el campo @ y el nombre completo, aunque tenga espacios.',
    featAt: 'Autocompletado',
    featAtText: 'Al escribir @ y unas letras, ves a las personas del chat. Enter inserta el nombre elegido y no envía el mensaje.',
    featGlow: 'Destacado',
    featGlowText: 'Los mensajes que te responden se destacan. Los demás se quedan igual.',
    featEmotes: 'Emotes 7TV',
    featEmotesText: 'Los nombres de emotes 7TV se muestran como imágenes. Quien no tiene la extensión sigue viendo el texto.',
    guideTitle: 'Usar el chat',
    step1: 'Añadir los emotes 7TV de un streamer de Twitch',
    step1hint: 'Escribe el nombre de su canal de Twitch, no su nombre de Patreon. Sus emotes se añaden al chat. Puedes añadir varios.',
    step2: 'Recargar la página del directo para verlos',
    step2hint: 'Recarga la página del directo en Patreon. Entonces aparecen los emotes, Responder y las sugerencias. Nadie más los ve.',
    step3: 'Elegir el tamaño y recorrer los emotes',
    step3hint: 'Ajusta el tamaño mostrado en el chat, comprueba la vista previa y abre la lista de cada streamer o los emotes globales.',
    seeEmotes: 'Ver emotes',
    savedShort: 'Guardado. Recarga la pestaña del directo.',
    tabEmotes: 'Emotes',
    tabAbout: 'Acerca de',
    streamersLead: 'Añade uno o varios streamers por nombre de canal o ID de Twitch.',
    streamerCount: '{n} canal(es) de Twitch.',
    add: 'Añadir',
    hintTags: 'Nombre del canal o ID numérico. Enter añade la etiqueta. Guardar aplica la lista.',
    idPlaceholder: 'nombre de Twitch',
    resolving: 'Buscando el canal…',
    notFound: 'Canal de Twitch no encontrado.',
    globalEmotes: 'Incluir emotes globales de 7TV',
    caseSensitive: 'Nombres de emotes distinguen mayúsculas',
    emoteSize: 'Tamaño de los emotes (px)',
    previewHint: 'Este es el tamaño que se muestra en el chat. Recarga la página del directo para aplicarlo.',
    previewBefore: 'Hola',
    previewAfter: 'a todos',
    viewStreamers: 'Por streamer',
    viewGlobal: 'Emotes globales',
    filter: 'Filtrar',
    filterPlaceholder: 'Nombre del emote',
    galleryEmptyStreamers: 'Aún no hay canal. Añade un nombre de Twitch arriba.',
    galleryEmptyGlobal: 'Los emotes globales de 7TV no están cargados.',
    save: 'Guardar',
    refresh: 'Recargar emotes',
    saved: 'Guardado. Recarga la pestaña del directo de Patreon.',
    savedEmpty: 'Ningún streamer. Solo se cargarán los emotes globales.',
    invalidId: 'El ID de Twitch debe ser numérico.',
    duplicate: 'Ya está en la lista.',
    remove: 'Quitar',
    galleryEmpty: 'Aún no hay emotes. Añade streamers, guarda y recarga.',
    galleryLoading: 'Cargando emotes…',
    galleryError: 'No se han podido cargar los emotes.',
    groupGlobal: 'Emotes globales de 7TV',
    emoteCount: '{n} emotes',
    groupError: 'No se ha podido cargar este grupo.',
    aboutLede: 'Respuestas, autocompletado y emotes 7TV en los directos de Patreon abiertos en el navegador.',
    aboutFirefox: 'Firefox / Zen: about:debugging → cargar un complemento temporal → manifest.json',
    aboutChrome: 'Chrome, Edge y Opera necesitan una variante cuyo fondo sea un service worker.',
    aboutSafari: 'Safari necesita un proyecto Xcode « Safari Web Extension », en un Mac.',
    aboutLive: 'Durante un directo, abre la página en el navegador, no en la aplicación móvil.',
    cacheUpdated: 'Caché actualizada: {channel} emotes de canal, {global} globales.',
  },
};

const DEFAULTS = {
  includeGlobalEmotes: true,
  emoteSize: 48,
  caseSensitiveEmotes: false,
  uiLocale: 'fr',
};

const form = document.getElementById('form');
const statusEl = document.getElementById('status');
const tagsEl = document.getElementById('streamer-tags');
const promptEl = document.getElementById('streamer-prompt');
const idInput = document.getElementById('streamer-input');
const suggestEl = document.getElementById('streamer-suggest');
const galleryEl = document.getElementById('gallery');
const filterEl = document.getElementById('emote-filter');
const previewImg = document.getElementById('preview-img');
const previewPh = document.getElementById('preview-ph');

const streamerIds = [];
const labels = {};
let locale = 'fr';
let groups = [];
let galleryView = 'channel';
let suggestions = [];
let suggestIndex = -1;
let suggestToken = 0;
let suggestTimer = 0;

function t(key, vars) {
  const text = STRINGS[locale]?.[key] || STRINGS.fr[key] || key;
  if (!vars) return text;
  return text.replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? ''));
}

function applyLocale() {
  document.documentElement.lang = locale;
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  idInput.placeholder = t('idPlaceholder');
  filterEl.placeholder = t('filterPlaceholder');
  document.querySelectorAll('.langs button').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.lang === locale);
  });
  document.querySelectorAll('[data-view]').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.view === galleryView);
  });
  paintPrompt();
  renderTags();
  renderGallery();
}

function paintPrompt() {
  if (!promptEl) return;
  promptEl.textContent = streamerIds.length ? t('streamerCount', { n: streamerIds.length }) : '';
}

function setStatus(text) {
  statusEl.textContent = text;
}

function applyEmoteSize() {
  const input = form.emoteSize;
  const size = Number(input.value) || 48;
  const min = Number(input.min) || 32;
  const max = Number(input.max) || 96;
  const fill = ((size - min) / (max - min)) * 100;
  input.style.setProperty('--fill', `${fill}%`);
  document.documentElement.style.setProperty('--emote-size', `${size}px`);
  const output = document.getElementById('emote-size-value');
  if (output) output.textContent = `${size} px`;
}

function renderTags() {
  tagsEl.replaceChildren();
  for (const id of streamerIds) {
    const tag = document.createElement('span');
    tag.className = 'tag';
    const label = document.createElement('span');
    label.textContent = labels[id] && labels[id] !== id ? labels[id] : id;
    tag.append(label);
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.textContent = '×';
    remove.setAttribute('aria-label', `${t('remove')} ${label.textContent}`);
    remove.addEventListener('click', () => {
      const index = streamerIds.indexOf(id);
      if (index >= 0) streamerIds.splice(index, 1);
      delete labels[id];
      renderTags();
      persist({ reloadEmotes: true });
    });
    tag.append(remove);
    tagsEl.append(tag);
  }
  paintPrompt();
}

function idsFromStored(data) {
  const list = Array.isArray(data.twitchUserIds) ? data.twitchUserIds : [];
  const ids = list.map((id) => String(id).trim()).filter((id) => /^\d+$/.test(id));
  const legacy = String(data.twitchUserId || '').trim();
  if (!ids.length && /^\d+$/.test(legacy)) ids.push(legacy);
  return [...new Set(ids)];
}

async function persist({ reloadEmotes = false } = {}) {
  if (!globalThis.chrome?.storage?.sync) return;
  const kept = {};
  for (const id of streamerIds) if (labels[id]) kept[id] = labels[id];
  await chrome.storage.sync.set({
    twitchUserIds: [...streamerIds],
    twitchUserId: '',
    twitchLogin: '',
    twitchLabels: kept,
    uiLocale: locale,
    includeGlobalEmotes: form.includeGlobalEmotes.checked,
    caseSensitiveEmotes: form.caseSensitiveEmotes.checked,
    emoteSize: Number(form.emoteSize.value) || 48,
  });
  setStatus(t('savedShort'));
  if (reloadEmotes) await loadGallery(true);
}

async function addFromInput() {
  const raw = idInput.value.trim().replace(/^@/, '');
  if (!raw) return true;
  if (!globalThis.chrome?.runtime?.sendMessage) {
    setStatus(t('notFound'));
    return false;
  }
  setStatus(t('resolving'));
  let resolved;
  try {
    resolved = await chrome.runtime.sendMessage({ type: 'RESOLVE_TWITCH', query: raw });
  } catch (err) {
    setStatus(t('notFound'));
    return false;
  }
  if (!resolved?.ok || !resolved.data?.id) {
    setStatus(t('notFound'));
    return false;
  }
  const { id, label } = resolved.data;
  if (streamerIds.includes(id)) {
    setStatus(t('duplicate'));
    idInput.value = '';
    return true;
  }
  streamerIds.push(id);
  if (label) labels[id] = label;
  idInput.value = '';
  hideSuggest();
  renderTags();
  await persist({ reloadEmotes: true });
  return true;
}

function hideSuggest() {
  suggestions = [];
  suggestIndex = -1;
  if (!suggestEl) return;
  suggestEl.hidden = true;
  suggestEl.replaceChildren();
  idInput.setAttribute('aria-expanded', 'false');
}

function renderSuggest() {
  if (!suggestEl) return;
  suggestEl.replaceChildren();
  if (!suggestions.length) {
    suggestEl.hidden = true;
    idInput.setAttribute('aria-expanded', 'false');
    return;
  }
  suggestEl.hidden = false;
  idInput.setAttribute('aria-expanded', 'true');
  suggestions.forEach((item, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.classList.toggle('is-active', index === suggestIndex);
    if (item.avatar) {
      const img = document.createElement('img');
      img.alt = '';
      img.src = item.avatar;
      button.append(img);
    }
    const login = document.createElement('strong');
    login.textContent = item.login;
    button.append(login);
    if (item.displayName && item.displayName.toLowerCase() !== item.login.toLowerCase()) {
      const extra = document.createElement('span');
      extra.textContent = item.displayName;
      button.append(extra);
    }
    button.addEventListener('mousedown', (event) => {
      event.preventDefault();
      pickSuggestion(item);
    });
    suggestEl.append(button);
  });
}

async function pickSuggestion(item) {
  hideSuggest();
  idInput.value = '';
  const id = String(item.id);
  if (streamerIds.includes(id)) {
    setStatus(t('duplicate'));
    return;
  }
  streamerIds.push(id);
  labels[id] = item.login;
  renderTags();
  await persist({ reloadEmotes: true });
  idInput.focus();
}

function scheduleSuggest() {
  clearTimeout(suggestTimer);
  const raw = idInput.value.trim().replace(/^@/, '');
  if (raw.length < 2 || !globalThis.chrome?.runtime?.sendMessage) {
    hideSuggest();
    return;
  }
  suggestTimer = setTimeout(() => loadSuggest(raw), 180);
}

async function loadSuggest(raw) {
  const token = ++suggestToken;
  let response;
  try {
    response = await chrome.runtime.sendMessage({ type: 'SEARCH_TWITCH', query: raw });
  } catch {
    return;
  }
  if (token !== suggestToken) return;
  if (idInput.value.trim().replace(/^@/, '') !== raw) return;
  const list = Array.isArray(response?.data) ? response.data : [];
  suggestions = list.filter((item) => item?.id && !streamerIds.includes(String(item.id)));
  suggestIndex = suggestions.length ? 0 : -1;
  renderSuggest();
}

function commitInput() {
  if (suggestIndex >= 0 && suggestions[suggestIndex]) return pickSuggestion(suggestions[suggestIndex]);
  hideSuggest();
  return addFromInput();
}

function showPanel(name) {
  document.querySelectorAll('.tab').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.tab === name);
  });
  document.querySelectorAll('[data-panel]').forEach((panel) => {
    panel.hidden = panel.dataset.panel !== name;
  });
  if (name === 'settings' && !groups.length) loadGallery(false);
}

function rememberLabels(nextGroups) {
  for (const group of nextGroups) {
    if (group.kind === 'channel' && group.label && group.id) labels[group.id] = group.label;
  }
}

function visibleGroups() {
  return groups.filter((group) => group.kind === galleryView);
}

function renderGallery() {
  const query = filterEl.value.trim().toLowerCase();
  galleryEl.replaceChildren();
  const source = visibleGroups();
  if (!source.length) {
    const empty = document.createElement('p');
    empty.className = 'hint';
    empty.textContent = galleryView === 'global' ? t('galleryEmptyGlobal') : t('galleryEmptyStreamers');
    galleryEl.append(empty);
    return;
  }
  for (const group of source) {
    const entries = Object.values(group.emotes || {}).filter((emote) => {
      return !query || String(emote.name || '').toLowerCase().includes(query);
    });
    if (query && !entries.length) continue;
    const section = document.createElement('details');
    section.className = 'gallery-group';
    if (query) section.open = true;
    const title = document.createElement('summary');
    const name = document.createElement('span');
    name.textContent = group.kind === 'global' ? t('groupGlobal') : group.label || group.id;
    const meta = document.createElement('small');
    meta.textContent = group.error ? t('groupError') : t('emoteCount', { n: entries.length });
    title.append(name, meta);
    section.append(title);
    const grid = document.createElement('div');
    grid.className = 'gallery-grid';
    for (const emote of entries) {
      const cell = document.createElement('figure');
      cell.className = 'emote-cell';
      const img = document.createElement('img');
      img.src = emote.url;
      img.alt = emote.name;
      img.title = emote.name;
      img.loading = 'lazy';
      img.decoding = 'async';
      const caption = document.createElement('span');
      caption.textContent = emote.name;
      cell.append(img, caption);
      grid.append(cell);
    }
    section.append(grid);
    galleryEl.append(section);
  }
  const first = source.flatMap((group) => Object.values(group.emotes || {})).find((emote) => emote?.url);
  if (first) {
    previewImg.src = first.url;
    previewImg.alt = first.name;
    previewImg.hidden = false;
    previewPh.hidden = true;
  }
}

async function loadGallery(force) {
  if (!globalThis.chrome?.runtime?.sendMessage) return;
  setStatus(t('galleryLoading'));
  try {
    const res = await chrome.runtime.sendMessage({ type: 'GET_EMOTES', force });
    if (!res?.ok) {
      setStatus(t('galleryError'));
      return;
    }
    groups = Array.isArray(res.data.groups) ? res.data.groups : [];
    rememberLabels(groups);
    renderTags();
    renderGallery();
    const channel = Object.keys(res.data.channel || {}).length;
    const globalCount = Object.keys(res.data.global || {}).length;
    setStatus(t('cacheUpdated', { channel, global: globalCount }));
  } catch (err) {
    setStatus(`${t('galleryError')} ${err}`);
  }
}

async function load() {
  locale = (navigator.language || 'fr').slice(0, 2);
  if (!STRINGS[locale]) locale = 'fr';
  if (!globalThis.chrome?.storage?.sync) {
    applyLocale();
    applyEmoteSize();
    return;
  }
  const data = await chrome.storage.sync.get({
    ...DEFAULTS,
    twitchUserIds: [],
    twitchUserId: '',
    twitchLabels: {},
  });
  if (STRINGS[data.uiLocale]) locale = data.uiLocale;
  for (const [key, value] of Object.entries(DEFAULTS)) {
    const field = form.elements.namedItem(key);
    if (!field || key === 'uiLocale') continue;
    if (field.type === 'checkbox') field.checked = Boolean(data[key]);
    else field.value = data[key] ?? value;
  }
  streamerIds.splice(0, streamerIds.length, ...idsFromStored(data));
  Object.assign(labels, data.twitchLabels || {});
  applyLocale();
  applyEmoteSize();
}

document.querySelectorAll('.tab').forEach((button) => {
  button.addEventListener('click', () => showPanel(button.dataset.tab));
});

document.querySelectorAll('[data-view]').forEach((button) => {
  button.addEventListener('click', () => {
    galleryView = button.dataset.view;
    applyLocale();
  });
});

document.querySelectorAll('.langs button').forEach((button) => {
  button.addEventListener('click', async () => {
    locale = button.dataset.lang;
    applyLocale();
    if (globalThis.chrome?.storage?.sync) await chrome.storage.sync.set({ uiLocale: locale });
  });
});

idInput.addEventListener('input', scheduleSuggest);
idInput.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowDown' && suggestions.length) {
    event.preventDefault();
    suggestIndex = (suggestIndex + 1) % suggestions.length;
    renderSuggest();
    return;
  }
  if (event.key === 'ArrowUp' && suggestions.length) {
    event.preventDefault();
    suggestIndex = (suggestIndex - 1 + suggestions.length) % suggestions.length;
    renderSuggest();
    return;
  }
  if (event.key === 'Escape') {
    hideSuggest();
    return;
  }
  if (event.key !== 'Enter') return;
  event.preventDefault();
  commitInput();
});
idInput.addEventListener('blur', () => {
  setTimeout(hideSuggest, 150);
});

document.getElementById('streamer-add').addEventListener('click', () => {
  commitInput();
  idInput.focus();
});

form.emoteSize.addEventListener('input', applyEmoteSize);
form.emoteSize.addEventListener('change', () => persist());
form.includeGlobalEmotes.addEventListener('change', () => persist({ reloadEmotes: true }));
form.caseSensitiveEmotes.addEventListener('change', () => persist());
filterEl.addEventListener('input', renderGallery);
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  await commitInput();
});

load();
