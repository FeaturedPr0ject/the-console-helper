# Server Trace — Chrome Extension

![Server Trace sharp-corner logo](extension/icons/icon128.png)

Server Trace is a Chrome Manifest V3 extension that opens as a persistent Side Panel. It does not require DevTools, F12, or pasting a JavaScript snippet into a website.

## Install in Chrome

1. Open the [repository page](https://github.com/FeaturedPr0ject/the-console-helper).
2. Select **Code → Download ZIP** and extract the ZIP.
3. In Chrome, open `chrome://extensions`.
4. Enable **Developer mode**.
5. Select **Load unpacked** and choose the extracted repository's `extension` folder.
6. Pin **Server Trace — API Inspector** using Chrome's Extensions menu.
7. Select the website tab, then click the Server Trace toolbar icon to open the Side Panel and record that tab. Click **SCAN CURRENT TAB** inside the panel. The action-icon click is required to grant Chrome's temporary `activeTab` access; no F12 is needed.

To update later, download/extract the latest repository ZIP and select **Reload** on the extension card, or load the updated `extension` folder.

## Extension logo

The custom square-corner Server Trace icon is included in PNG sizes 16, 32, 48, and 128 pixels, and the editable SVG source is at `extension/icons/server-trace-logo.svg`. The icon is configured for both the Chrome toolbar and the Extensions page.

## Features

- Inspect resource URLs already recorded by the current page and API-like references in its DOM and inline scripts.
- Filter discovered endpoint candidates and copy sanitized URLs.
- Export a sanitized JSON report.
- A **CONSOLE** tab for JavaScript commands and running local `.js` files in an isolated sandbox. Use `Ctrl+Enter` to run the current command. The console exposes sanitized `pageInfo`, `endpoints`, `findEndpoints(query)`, and persistent `state` helpers.
- Check inline page code for common secret-shaped patterns. The extension reports only the pattern category/source and never displays or exports matched values.
- Dark/light styling follows the browser's system color preference.

## Permissions

- `activeTab`: temporary access to the tab that the user selects by clicking the extension toolbar icon.
- `scripting`: runs the scanner in that selected tab.
- `sidePanel`: opens the extension's dedicated panel.
- `storage`: keeps only the selected tab ID/URL in session memory so the panel can target the correct tab.

The extension does not request blanket access to all websites in its manifest.

## Limits and privacy

The scanner is passive: it does not send requests to discovered API endpoints, extract or display login tokens, read cookies, access authorization headers, inspect stored session values, or fetch external script bodies. Sensitive-looking query parameter values are redacted before endpoint URLs are shown or exported.

Only endpoints and routes visible in the loaded page's resource timing entries, DOM, or inline scripts can be discovered. Dynamically generated or server-only routes may not be found. Potential secret-pattern matches can be false positives.

The sandbox is not a DevTools replacement and cannot manipulate the active website DOM or access its session. Use it only on websites and systems you own or have permission to inspect. This repository is not currently a Chrome Web Store listing; install it using **Load unpacked**.
