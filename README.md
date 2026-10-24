# Server Trace — Chrome Extension

Current source version: **1.5.0**.

![Server Trace sharp-corner logo](extension/icons/icon128.png)

Server Trace is a Chrome Manifest V3 extension that opens as a persistent Side Panel. It does not require DevTools, F12, or pasting a JavaScript snippet into a website.

## Install in Chrome

1. Open the [repository page](https://github.com/FeaturedPr0ject/the-console-helper).
2. Select **Code → Download ZIP** and extract the ZIP.
3. In Chrome, open `chrome://extensions`.
4. Enable **Developer mode**.
5. Select **Load unpacked** and choose the extracted repository's `extension` folder.
6. Pin **Server Trace — API Inspector** using Chrome's Extensions menu.
7. Open the site you want to inspect, then open Server Trace. Click **ALLOW SITE** to show Chrome's permission prompt for that website only. After granting access, the extension scans it automatically. You can use **SCAN CURRENT TAB** later without another prompt while access remains granted; no F12 is needed.

Open the **UPDATE** tab in Server Trace to automatically check the GitHub version on panel launch or press **CHECK NOW**. If a new version is found, choose **DOWNLOAD UPDATE ZIP**, extract it, point **Load unpacked** to the updated `extension` folder, or replace the existing files and click **Reload**. The UPDATE tab cannot replace the installed files itself because Chrome restricts self-modification of unpacked extensions.

## Run JavaScript in the live page context

1. Open `chrome://extensions` → **Server Trace → Details**.
2. Enable **Allow User Scripts**. Chrome 138+ requires this user opt-in for the User Scripts API.
3. Open the target website, then use **ALLOW SITE** in Server Trace if Chrome asks for site access.
4. Open the extension's **CONSOLE** tab. Enter, for example, `console.log("Hello from Server Trace"); document.title`.
5. Click **RUN ON PAGE · F12**. The code runs in the selected page's main JavaScript world. Its native `console.log()` output is visible in that tab's DevTools Console; the returned value, when serializable, is also shown in Server Trace.

**Important:** Page mode is equivalent to running code on the live website. It can read or modify page state, interact with the DOM, and use page APIs. Run only code you understand and trust. The commands you type are not automatically echoed into DevTools as though you typed them there; the code executes in the page context, so its normal Console output appears there.

## Windows CMD Commands setup

Chrome extensions cannot start `cmd.exe` directly. The **COMMANDS** sub-tab uses Chrome Native Messaging to talk to a companion Windows host, which starts `cmd.exe /c` for each command. This is the supported bridge between a browser extension and a local application ([Chrome Native Messaging documentation](https://developer.chrome.com/docs/extensions/develop/concepts/native-messaging)).

1. Open the [Actions page](https://github.com/FeaturedPr0ject/the-console-helper/actions) and select the latest successful **Build Native CMD Host** run.
2. Download the `ServerTrace-NativeHost-win-x64` artifact and extract `ServerTrace.NativeHost.exe`.
3. Copy the EXE beside `install-native-host.bat` in the `native-host` folder from the source ZIP.
4. Open `chrome://extensions`, copy the ID shown on the Server Trace card, and run `install-native-host.bat`. Paste the extension ID when prompted.
5. Reload the extension, open **CONSOLE → COMMANDS**, tick the confirmation checkbox, and press **CONNECT CMD.EXE**.

Alternatively, install the .NET 8 SDK and run `build-native-host.bat` inside the `native-host` folder to build the host locally. Use `uninstall-native-host.bat` to remove the native host registration.

The Native Messaging Host executes commands under the current Windows account. Commands can alter the computer, so only run commands you understand. It launches `cmd.exe /d /s /c` for each submitted command; `cd` and `cd /d` update the working directory for the lifetime of the native-host connection. It runs each submitted line through `cmd.exe`; `cd` and `cd /d` update a working directory that remains active while the host connection stays open. The extension sends commands only after you type them and click Run. The host limits command length, runtime, and captured output; the current directory persists during one connection, while other `cmd.exe` session state (such as environment variable changes) does not.

## Extension logo

The custom square-corner Server Trace icon is included in PNG sizes 16, 32, 48, and 128 pixels, and the editable SVG source is at `extension/icons/server-trace-logo.svg`. The icon is configured for both the Chrome toolbar and the Extensions page.

## Features

- Inspect resource URLs already recorded by the current page and API-like references in its DOM and inline scripts.
- Filter discovered endpoint candidates and copy sanitized URLs.
- Export a sanitized JSON report.
- A **CONSOLE** area with two sub-tabs: **CONSOLE** for JavaScript (sandbox or live page context) and **COMMANDS** for actual Windows `cmd.exe` commands through an optional Native Messaging Host. The command panel includes a connection button, output terminal, current directory, and an explicit safety confirmation. JavaScript page mode requires Chrome's **Allow User Scripts** switch and website access. The page console registers `float.show({ title, text, width })` so it can create a draggable floating window on the actual webpage.
- Check inline page code for common secret-shaped patterns. The extension reports only the pattern category/source and never displays or exports matched values.
- An **UPDATE** tab checks the current GitHub manifest on panel launch and lets you download the current source ZIP when a newer version is found.
- Dark/light styling follows the browser's system color preference.

## Permissions

- `tabs`: reads the current tab's URL/title so the panel knows which site you selected.
- `scripting`: runs the scanner and explicit in-page float helper after site access has been granted.
- `userScripts`: enables an explicit **RUN ON PAGE** mode for user-entered code in the selected page's JavaScript world. Chrome also requires **Allow User Scripts** to be enabled in the extension's Details settings.
- `host_permissions` for the repository's `raw.githubusercontent.com` manifest: allows the UPDATE tab to check the latest version on GitHub.
- `sidePanel`: opens the extension's dedicated panel.
- Optional host access: Chrome asks for permission to the individual site's origin only when you press Scan; it does not receive all-site access by default.

The extension declares HTTP/HTTPS host patterns as optional permissions, not automatically granted permissions. When you scan, Chrome requests access for the active site's origin only. You can deny that request and still use the sandboxed CONSOLE tab.

## Limits and privacy

The scanner is passive: it does not send requests to discovered API endpoints, extract or display login tokens, read cookies, access authorization headers, inspect stored session values, or fetch external script bodies. Sensitive-looking query parameter values are redacted before endpoint URLs are shown or exported.

Only endpoints and routes visible in the loaded page's resource timing entries, DOM, or inline scripts can be discovered. Dynamically generated or server-only routes may not be found. Potential secret-pattern matches can be false positives.

The sandbox cannot directly manipulate the active website DOM or access its session. The fixed `float.show()` helper asks the extension to place a text-only draggable overlay on the selected page after site access is granted. Use it only on websites and systems you own or have permission to inspect. This repository is not currently a Chrome Web Store listing; install it using **Load unpacked**.
