# Privacy policy

Patreon Live Chat+ runs entirely in your browser. The project has no server and no account of its own.

Last updated: 26 November 2026.

## Stored on your device

Firefox sync storage keeps the settings you choose:

- Twitch channel ids and the channel names you add
- options language
- emote size
- whether global 7TV emotes are included
- whether emote names are case-sensitive

Local storage keeps:

- a cache of 7TV emote names and image addresses for those channels, refreshed about once an hour
- display names seen in the Patreon live you have open, so `@` autocomplete still works after messages scroll away

Those names stay on the device. They are kept for that live only and are not sent to the authors of this extension.

## Read from the page you already have open

On a Patreon live page, the extension reads the chat that Patreon has already loaded:

- the display name of the signed-in account, so a message that mentions you can be highlighted
- the names and text of messages visible in that chat, so Reply and `@` autocomplete can work

The signed-in name and account id are used in memory for that page. They are not uploaded.

## Sites the extension contacts

Requests go straight from your browser to these sites. They do not pass through a server run by this project.

- `7tv.io` and `cdn.7tv.app` — emote lists and images for the channels you added, and the global 7TV set when you leave that option on
- `api.ivr.fi` — turn a Twitch channel name you type into its numeric id. Only the id and the login are kept. Any other text in that response is discarded
- `gql.twitch.tv` — search public channels while you type a name in the options, and show that channel’s public profile image in the list

The extension does not add its own calls to Patreon. It only changes the Patreon page already open in the tab.

The Firefox listing states that the extension does not collect or transmit personal data. A channel lookup sends only the Twitch name you type to Twitch and 7TV. Chat text, display names, and the signed-in account stay in the browser.

## What this project does not do

- no analytics and no advertising
- no sale or transfer of data
- no collection of message contents on a server

Uninstalling the extension removes its local data. Data stored in Firefox sync follows your Firefox account until you remove the extension or clear that storage.

## Contact

Questions about this policy: open an issue on https://github.com/kramelCase/Patreon-Live-Chat-

This project is not affiliated with Patreon, Twitch, or 7TV.
