# The Console Helper

A standalone JavaScript snippet that injects a gray, square-corner API playground into the current page from Chrome DevTools Console. It is not a separate HTML app and does not use React.

## Run from Chrome DevTools

1. Open the raw script: https://raw.githubusercontent.com/FeaturedPr0ject/the-console-helper/main/console.js
2. Copy the complete JavaScript source.
3. Open the page where you want the panel, press `Ctrl+Shift+J`, paste the source into DevTools Console, and press Enter.

On pages with strict Content Security Policy, do not use a `fetch(raw.githubusercontent.com/...)` loader from the page console: the page's `connect-src` can block that request. Copy the source from the raw file and paste it directly.

The snippet creates its UI in Shadow DOM, so the gray API workbench's styles are isolated from the current page. Run it again to close an existing panel, or use its CLOSE button.

## Features

- HTTP methods: GET, POST, PUT, PATCH, DELETE, HEAD and OPTIONS
- Base URL, path variables, query parameters, custom headers, request body and credentials options
- Response status, duration, body, available response headers, copy and export
- OpenAPI / Swagger 2.0 and OpenAPI 3.x JSON import by URL, pasted content or local JSON file
- Searches common OpenAPI JSON locations on a server when you choose **FIND SPEC**
- Filterable endpoint list and request history for the current page session

## Limits

The browser can list endpoints that are documented in an OpenAPI / Swagger schema. **FIND SPEC** checks a short list of conventional schema locations; it does not enumerate every undocumented route on a server.

Requests run in the current page's JavaScript context. The server must allow the page's origin through CORS; a page's Content Security Policy can also block network connections. The snippet cannot bypass these browser protections. Some response headers are only readable if the server exposes them via CORS.

Use this only with servers you are authorized to test. Do not paste production secrets into a shared or untrusted browser session.
