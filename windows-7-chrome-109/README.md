# Server Trace — Windows 7 / Chrome 109

This is a separate compatibility edition for Windows 7 systems running Chrome 109. It does not modify the modern `extension/` package.

## Install

1. Download the repository ZIP and extract it.
2. Open `chrome://extensions` in Chrome 109.
3. Enable **Developer mode**.
4. Click **Load unpacked** and select the `windows-7-chrome-109` folder.
5. Click the Server Trace Legacy toolbar icon to open its popup.

## Features in this edition

- **API Scan**: click **SCAN CURRENT TAB** to inspect resource timing entries and endpoint-like references in the active webpage's DOM and inline scripts. The extension uses the `activeTab` permission and does not request permanent access to all websites.
- **JavaScript Console**: runs code in the extension's isolated sandbox and displays `console.log`, `console.warn`, `console.error`, and other captured console output. Use the provided `state` object to retain values between runs.
- **Privacy boundary**: the sandbox cannot access the active page's DOM, cookies, session, or authorization state. Network APIs are blocked in the sandbox. Page-context execution from the modern edition is not included.
- **Filter**: filter discovered candidates by URL or type.

## Feature differences

| Feature | Modern edition | Windows 7 / Chrome 109 edition |
| --- | --- | --- |
| Side Panel | Yes | Popup |
| API endpoint inspection | Yes | Basic active-tab scanner |
| Isolated JavaScript sandbox | Yes | Yes |
| Execute typed code in the website's main JavaScript world | Requires newer user-script support | Not included |
| Update checker | Yes | Not included yet |

## Limitations

- Internal browser pages such as `chrome://extensions` and Chrome Web Store pages cannot be scanned.
- Results depend on URLs visible in resource timing, page DOM, or inline scripts. Server-only or dynamically generated endpoints may not be found.
- The sandbox is intentionally isolated from the live page. It is not a replacement for DevTools Console when interacting with the website.
- The package targets Chrome 109 APIs, but it has not been tested on every Windows 7 configuration. Chrome 109 is the final Chrome release that supports Windows 7; Google documents this in its [Chrome support timeline](https://support.google.com/chrome/a/answer/7100626?hl=en).

Use only on websites and systems you own or have permission to inspect.
