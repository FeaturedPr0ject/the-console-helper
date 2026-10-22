# Server Trace

A standalone Windows desktop app for discovering API endpoint references and auditing public page code. This repository no longer uses DevTools JavaScript snippets.

## Get the Windows EXE

The GitHub Actions workflow builds a self-contained Windows x64 executable.

1. Open the [Actions page](https://github.com/FeaturedPr0ject/the-console-helper/actions).
2. Select **Build Windows EXE** and open the latest successful run.
3. Download the **ServerTrace-win-x64** artifact and extract `ServerTrace.exe`.

The first workflow run starts after the project/workflow commits are pushed. If no artifact is available yet, open **Build Windows EXE** and choose **Run workflow**.

## Build on Windows

Install the .NET 8 SDK, clone this repository, then run:

```bat
build-windows.bat
```

The standalone app will be written to `publish\ServerTrace.exe`.

## Use

1. Run `ServerTrace.exe`.
2. Enter an `https://` or `http://` page URL you are authorized to inspect.
3. Select **SCAN SITE**.
4. Review **API ENDPOINTS**, **EXPOSURE AUDIT**, and **ACTIVITY**.
5. Select **EXPORT REPORT** to save a sanitized JSON report.

## What it checks

- API-looking URLs referenced in page HTML and same-origin JavaScript bundles.
- Up to 30 same-origin script resources, with size limits.
- Common patterns that might indicate exposed credentials in embedded page code. The tool reports only the pattern category and source, never the matched value.
- Sensitive URL query parameters are redacted in the displayed/exported endpoint list.

## Limits and privacy

This app is a local audit helper, not a browser debugger or network proxy. It does not access browser cookies, session storage, login sessions, or authorization headers; does not retrieve or reveal tokens; and does not send requests to discovered API endpoints. It only fetches the user-entered page and up to 30 same-origin script resources. Cross-origin script contents are not fetched. Endpoint discovery is best-effort and can miss dynamically generated routes. Pattern matches can be false positives.

Use it only on systems you own or are explicitly authorized to inspect. Do not use discovered URLs to access accounts or services without permission.
