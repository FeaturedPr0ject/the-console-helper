# The Console Helper — API Workbench

A browser-based HTTP/API playground with a square-corner gray interface. No frameworks or third-party libraries are required.

## Features

- HTTP methods: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS
- Server base URL and request path with URL-encoded path variables
- Query parameters and custom request headers
- JSON, plain text and URL-encoded request bodies
- Response status, duration, response size, body and exposed headers
- Import OpenAPI 3.x / Swagger 2.0 JSON by URL, pasted JSON or local file
- Searchable endpoint explorer and request history for the current tab session
- Cancel in-flight requests and export/copy response bodies

## Use

Open `index.html` from a static host or serve the repository with a local HTTP server. Set a server base URL, type a path or load an OpenAPI JSON document, then press **SEND**. Use **Ctrl+Enter** to send the current request.

## Browser limitations

Requests are sent directly from the browser. A cross-origin API must permit the page's origin through CORS. Some APIs require preflight support for custom headers, authorization headers, or non-simple methods. Browser code cannot read response headers that the server does not expose through CORS. These browser restrictions cannot be bypassed by this page.

Use test credentials where possible. This tool sends requests with the headers and credentials configured in the UI; do not paste production secrets into shared or untrusted computers. Request history is held in memory for the current page session and does not store header values.

OpenAPI URLs must also allow browser CORS. If loading the spec URL is blocked, download the JSON file and use **IMPORT FILE**, or paste its JSON into the spec panel. YAML should be converted to JSON first.
