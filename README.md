# Patreon Live Chat+

Browser extension (WebExtension, Manifest V3) for the chat on Patreon lives in the browser.

- **Reply**: a control on a message, like Twitch. Clicking it writes `@name` into the chat field. Display names can contain spaces and count as one mention.
- **Autocomplete**: typing `@` suggests people already seen in that live. 7TV emote names complete the same way (arrows, Tab, Enter). Enter inserts the suggestion and does not send the message.
- **Highlighted replies**: a message that mentions the installed user’s name is highlighted. Only people who have the extension see that highlight.
- **7TV emotes**: viewers with the extension see the images. Everyone else sees the emote name as text.

Ships with **Doflamingoh** as the default channel (Twitch `dofla`, id `74397555`). Change it in the options.

## Browsers

| Browser | Install |
| --- | --- |
| Firefox, Zen | `about:debugging` → *Load Temporary Add-on* → select `manifest.json` |
| Chrome, Brave, Edge, Opera | Needs a build whose background is a `service_worker`. This repository’s manifest targets Firefox (`background.scripts`). |
| Safari (Mac / iPhone) | Needs an Xcode “Safari Web Extension” project built from these sources. |

The Patreon mobile apps (iOS / Android) are out of scope.

## Use

1. Install the extension.
2. During a live, open the live page on **https://www.patreon.com/** in the browser.
3. Each viewer who wants emotes and highlights needs the extension.

Creator page: https://www.patreon.com/cw/Doflamingoh

## Options

Right-click the icon → *Manage extension* → *Preferences*, or open `options/options.html` from the extension manager.

- Creator Twitch id (7TV emote set).
- Global 7TV emotes on or off.
- Emote size in pixels.

## Limits

- Threaded replies visible to everyone need native Patreon support (the chat is backed by GetStream).
- Sent messages stay plain text. Emote images are rendered locally by the extension.
- Patreon’s chat markup changes. The extension matches stable `data-tag` attributes and a few class suffixes.

## Development

Content scripts share `globalThis.P7` and load in this order:

- `content/core.js` — DOM selectors, display-name normalization
- `content/roster.js` — people in the live, and the signed-in account
- `content/mentions.js` — `@name` matching, including names with spaces
- `content/ui.js` — reply, highlight, emotes, autocomplete
- `content/main.js` — chat observer
- `content/page-names.js` — display names read from React, in the page world

`P7.TEST_HIGHLIGHT_ALL` in `core.js`: `false` in production (only a mention of the signed-in user highlights the bubble), `true` to highlight every cited name.

Also:

- `manifest.json` — MV3 configuration
- `background/service-worker.js` — 7TV API cache (`7tv.io`, `cdn.7tv.app`)
- `content/content.css` — injected styles
- `options/` — settings page

## License

MIT. Community project, not affiliated with Patreon, Twitch, or 7TV.
