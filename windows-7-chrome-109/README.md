# Server Trace — Windows 7 / Chrome 109

This folder is a separate compatibility edition for legacy Windows 7 systems using Chrome 109. It does not modify the main `extension/` package.

## Compatibility strategy

Chrome 109 does not provide the `chrome.sidePanel` or `chrome.userScripts` APIs used by the modern edition. This legacy edition therefore must use a Manifest V3 browser-action popup and a sandbox-only JavaScript console instead of the Side Panel and page-main-world execution.

## Planned package layout

- `manifest.json` — legacy manifest with no `sidePanel` or `userScripts` permission, and `minimum_chrome_version: "109"`.
- `popup.html`, `popup.css`, `popup.js` — compact popup UI compatible with Chrome 109.
- `sandbox.html`, `sandbox.js` — isolated JavaScript runner. The sandbox must not be presented as able to access the current page DOM or session.
- `service-worker.js` — minimal MV3 service worker, using APIs available in Chrome 109 only.

## Feature differences

| Feature | Modern edition | Windows 7 / Chrome 109 edition |
| --- | --- | --- |
| Side Panel | Yes | No; use popup |
| Isolated JavaScript sandbox | Yes | Intended |
| Execute typed code in page MAIN world | Requires `userScripts` | Not included |
| Endpoint scan | Available in modern edition | Needs a Chrome 109-compatible implementation and explicit site permission |
| Update checker | Available | Can be added after legacy package is tested |

## Important

This README documents the compatibility target and package plan; this folder is not yet a complete, tested installable extension. Do not load it as an extension until all files in the planned layout are implemented and checked on Chrome 109. Chrome 109 is the final Chrome release for Windows 7, and older Chrome versions have known security risks.
