const DEFAULTS = {
  twitchUserId: '74397555',
  twitchLogin: 'dofla',
  includeGlobalEmotes: true,
  emoteSize: 28,
  caseSensitiveEmotes: false,
};

const form = document.getElementById('form');
const statusEl = document.getElementById('status');
const refreshBtn = document.getElementById('refresh');

async function load() {
  const data = await chrome.storage.sync.get(DEFAULTS);
  for (const [key, value] of Object.entries(data)) {
    const field = form.elements.namedItem(key);
    if (!field) continue;
    if (field.type === 'checkbox') field.checked = Boolean(value);
    else field.value = value;
  }
}

function setStatus(text) {
  statusEl.textContent = text;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const payload = {
    twitchUserId: form.twitchUserId.value.trim(),
    twitchLogin: form.twitchLogin.value.trim(),
    includeGlobalEmotes: form.includeGlobalEmotes.checked,
    caseSensitiveEmotes: form.caseSensitiveEmotes.checked,
    emoteSize: Number(form.emoteSize.value) || 28,
  };
  await chrome.storage.sync.set(payload);
  setStatus('Options enregistrées. Rechargez l’onglet du live Patreon.');
});

refreshBtn.addEventListener('click', async () => {
  setStatus('Rechargement des émotes 7TV…');
  try {
    const res = await chrome.runtime.sendMessage({ type: 'GET_EMOTES', force: true });
    if (res?.ok) {
      const ch = Object.keys(res.data.channel || {}).length;
      const gl = Object.keys(res.data.global || {}).length;
      setStatus(`Cache mis à jour : ${ch} émotes chaîne, ${gl} globales.`);
    } else {
      setStatus(`Échec : ${res?.error || 'inconnu'}`);
    }
  } catch (err) {
    setStatus(`Erreur : ${err}`);
  }
});

load();