# Patreon Live Chat+

Extension navigateur (WebExtension Manifest V3) qui améliore le **chat des lives Patreon** sur le web :

- **Répondre** : bouton au survol d’un message, comme sur Twitch. Le clic écrit `@pseudo` dans le champ du chat.
- **Autocomplétion** : taper `@` puis le début d’un pseudo propose les personnes déjà vues dans le chat. Les noms d’émotes 7TV se complètent aussi (flèches, Tab, Entrée).
- **Réponses surlignées** : un message qui contient `@pseudo` est surligné, avec la mention mise en évidence. Seuls les viewers qui ont l’extension voient ce surlignage.
- **Émotes 7TV** : affichage des images pour les viewers qui ont l’extension (les autres voient le texte).

Préconfigurée pour **Doflamingoh** (Twitch `dofla`, ID `74397555`). Modifiable dans les options.

## Navigateurs

| Navigateur | Installation |
|------------|----------------|
| Firefox, Zen | `about:debugging` → *Charger un module complémentaire temporaire* → choisir `manifest.json` |
| Chrome, Brave, Edge, Opera | `chrome://extensions` (ou équivalent) → mode développeur → *Charger l’extension non empaquetée* |
| Safari (Mac / iPhone) | Nécessite un empaquetage Xcode « Safari Web Extension » à partir des mêmes sources (hors périmètre automatique de ce dépôt) |

**Hors périmètre** : application mobile Patreon (iOS / Android).

## Utilisation

1. Installez l’extension en mode développeur.
2. Pendant un live, ouvrez la page du live sur **https://www.patreon.com/** dans le navigateur (pas l’app).
3. Chaque viewer qui veut voir les émotes doit installer l’extension.

Page créateur Doflamingoh : https://www.patreon.com/cw/Doflamingoh

Les URLs de live varient (fil d’actualité, notification, lien partagé par le créateur). **Envoyez le lien direct du live** pendant qu’il est en cours pour affiner les sélecteurs DOM si Patreon met à jour l’interface.

## Options

Clic droit sur l’icône → *Gérer l’extension* → *Préférences*, ou ouvrez `options/options.html` depuis le gestionnaire d’extensions.

- ID Twitch du créateur (pour charger le set 7TV).
- Émotes globales 7TV oui/non.
- Taille des émotes en pixels.

## Limites connues

- Les **réponses threadées** visibles par tous ne sont pas possibles sans support natif de Patreon (chat type GetStream).
- Les **émotes** ne s’affichent en image que pour les utilisateurs avec l’extension ; le message envoyé reste du texte (`NomEmote`).
- Les sélecteurs du chat Patreon peuvent changer ; l’extension utilise plusieurs repli (`str-chat`, zones de texte du live).

## Développement

Les content scripts partagent l'objet `globalThis.P7` et sont chargés dans cet ordre :

- `content/core.js` — sélecteurs DOM, normalisation des pseudos
- `content/roster.js` — annuaire du live et compte connecté
- `content/mentions.js` — reconnaissance de `@pseudo`, y compris avec des espaces
- `content/ui.js` — Répondre, surlignage, émotes, autocomplétion
- `content/main.js` — observation du chat
- `content/page-names.js` — lecture des pseudos dans React (monde de la page)

`P7.TEST_HIGHLIGHT_ALL` dans `core.js` : `false` en production (seule une citation de soi allume la bulle), `true` pour allumer chaque pseudo cité.

Le reste :

- `manifest.json` — configuration MV3
- `background/service-worker.js` — cache API 7TV (`7tv.io`, `cdn.7tv.app`)
- `content/content.css` — styles injectés
- `options/` — page de réglages

## Licence

MIT (projet communautaire non affilié à Patreon, Twitch ou 7TV).