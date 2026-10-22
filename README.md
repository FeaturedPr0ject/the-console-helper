# The Console Helper

A standalone JavaScript snippet that injects a gray, square-corner API workbench into the current page from Chrome DevTools Console. It is not a separate HTML app and does not use React.

## Run

1. Open the raw script: https://raw.githubusercontent.com/FeaturedPr0ject/the-console-helper/main/console.js
2. Copy the full file.
3. Open the page to inspect, press `Ctrl+Shift+J`, paste the complete source into DevTools Console, and press Enter.

On strict-CSP pages, do not load the snippet using `fetch(raw.githubusercontent.com/...)` from the page console; `connect-src` may block that connection. Copy the raw source and paste it directly.

## Find API servers on the current page

The panel runs a quick scan automatically and has a **SCAN CURRENT PAGE** button with a progress bar. It inspects the browser's existing Performance Resource Timing entries, fetch/XHR URLs, inline scripts, and API-like DOM references. Found host origins appear as clickable server chips; selecting one fills SERVER BASE URL. Discovered paths appear in API EXPLORER. Since browser timing APIs do not expose the HTTP method for every request, discovered resource entries default to GET and are labeled as an assumption.

Enable **DEEP SCAN SCRIPTS** to try reading up to 30 same-origin JavaScript bundles and search for API base URLs and route strings. The progress bar reports progress and the Cancel button stops the scan.

If you paste a complete URL such as `https://api.example.com/v1/users` into the request path field, the snippet splits its origin into SERVER BASE URL and retains its path automatically when you send.

## Other features

- HTTP methods: GET, POST, PUT, PATCH, DELETE, HEAD and OPTIONS
- Path variables, query parameters, custom headers and JSON/text/form bodies
- Response status, duration, body, response headers exposed by CORS, copy and export
- OpenAPI / Swagger 2.0 and OpenAPI 3.x JSON import from URL, pasted text, or a local JSON file
- Find common OpenAPI schema paths from the chosen base URL
- Searchable endpoints and request history for the current panel session

## Limits

This is a browser-context scanner, not a network proxy. It can inspect URLs the current page has already requested and source text the browser allows it to read. It cannot reveal endpoints that were never loaded, infer every hidden route, read cross-origin scripts without permission, or bypass CORS/CSP. OpenAPI URLs and API requests may be blocked by the current page's policy. Some response headers are hidden unless the API server exposes them through CORS.

Use it only for websites and APIs you are allowed to inspect. Avoid entering production secrets on shared or untrusted devices.

## Server Trace / Local Audit

A separate, local-only console for auditing the currently open page:

1. Open https://raw.githubusercontent.com/FeaturedPr0ject/the-console-helper/main/server-audit.js
2. Copy the complete JavaScript source.
3. Open Chrome DevTools Console on the page you are authorized to inspect, paste the source, and press Enter.

It lists already-observed fetch/XHR URLs and API-looking references, redacts sensitive query parameters, checks embedded inline scripts for common secret-shaped patterns without showing their values, and lists localStorage/sessionStorage key names only. It does not send network requests, read cookies or authorization headers, fetch external script bodies, or collect storage values. Pattern matches can be false positives and require manual review.

This tool is a local audit helper, not a token extractor. Use it only on pages and systems you are authorized to inspect.
