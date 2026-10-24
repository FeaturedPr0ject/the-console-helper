const $ = (selector) => document.querySelector(selector);
const state = { report: null, endpoints: [], currentTabId: null, targetTabInfo: null };
const SENSITIVE_NAME = /(token|secret|password|passwd|auth|session|cookie|csrf|xsrf|api.?key|signature|credential|jwt|bearer|access.?key|client.?key)/i;
const API_PATH = /(^|\/)(api|graphql|oauth|auth|v\d+|rest|rpc|accounts|users)(\/|$)/i;
const PAGE_FLOAT_CSS = "#server-trace-float-host{position:fixed!important;inset:0!important;z-index:2147483647!important;pointer-events:none!important;isolation:isolate!important}\n#server-trace-float-host .stx-window{position:fixed!important;left:24px;top:24px;width:280px;max-width:calc(100vw - 24px)!important;max-height:calc(100vh - 24px)!important;display:flex!important;flex-direction:column!important;overflow:hidden!important;pointer-events:auto!important;background:#1b1e23!important;color:#e9edf4!important;border:1px solid #647084!important;border-radius:0!important;box-shadow:0 12px 38px rgba(0,0,0,.45)!important;font:12px/1.5 \"Segoe UI\",Arial,sans-serif!important;letter-spacing:normal!important;text-transform:none!important}\n#server-trace-float-host .stx-titlebar{display:flex!important;align-items:center!important;gap:8px!important;min-height:36px!important;padding:7px 8px!important;background:#2d3440!important;color:#f3f5f9!important;border:0!important;border-bottom:1px solid #48515f!important;border-radius:0!important;cursor:move!important;user-select:none!important;touch-action:none!important}\n#server-trace-float-host .stx-title{flex:1!important;min-width:0!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important;font-size:12px!important;font-weight:700!important;margin:0!important;padding:0!important;background:transparent!important;color:inherit!important}\n#server-trace-float-host .stx-close{display:grid!important;place-items:center!important;width:24px!important;height:23px!important;padding:0!important;margin:0!important;border:1px solid #626d7d!important;border-radius:0!important;background:#242a33!important;color:#fff!important;font:16px/1 \"Segoe UI\",Arial,sans-serif!important;cursor:pointer!important;box-shadow:none!important}\n#server-trace-float-host .stx-body{padding:12px!important;margin:0!important;color:#dce2ec!important;background:#1b1e23!important;font:12px/1.6 Consolas,\"Courier New\",monospace!important;white-space:pre-wrap!important;overflow-wrap:anywhere!important;word-break:break-word!important;overflow:auto!important;max-height:calc(100vh - 90px)!important;letter-spacing:normal!important;text-align:left!important;text-transform:none!important}\n@media(prefers-color-scheme:light){#server-trace-float-host .stx-window{background:#fff!important;color:#252a32!important;border-color:#b8c0cc!important;box-shadow:0 12px 32px rgba(0,0,0,.2)!important}#server-trace-float-host .stx-titlebar{background:#e2e7ef!important;color:#252a32!important;border-bottom-color:#cbd1dc!important}#server-trace-float-host .stx-close{background:#f6f7fa!important;color:#252a32!important;border-color:#c4cad4!important}#server-trace-float-host .stx-body{background:#fff!important;color:#252a32!important}}";

function setStatus(message, kind = "") {
  const el = $("#status");
  el.textContent = message;
  el.className = "status" + (kind ? " " + kind : "");
}

function scanCurrentPage() {
  const SENSITIVE_NAME = /(token|secret|password|passwd|auth|session|cookie|csrf|xsrf|api.?key|signature|credential|jwt|bearer|access.?key|client.?key)/i;
  const API_PATH = /(^|\/)(api|graphql|oauth|auth|v\d+|rest|rpc|accounts|users)(\/|$)/i;
  const found = new Map();
  const checks = [
    ["Provider/API key pattern", /\b(?:sk_live|sk_test|ghp|github_pat|glpat|xox[baprs]|AKIA|AIza)[-_A-Za-z0-9]{12,}\b/g],
    ["JWT-like token pattern", /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g],
    ["Credential assignment pattern", /(?:access[_-]?token|refresh[_-]?token|api[_-]?key|client[_-]?secret|private[_-]?key|session[_-]?token|authorization|bearer)\s*["'\s:=]+\s*["']?[A-Za-z0-9._~+/=-]{12,}/ig],
    ["Private-key marker", /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g]
  ];

  function sanitize(raw) {
    try {
      const url = new URL(raw, location.href);
      if (!["http:", "https:"].includes(url.protocol)) return "";
      url.username = "";
      url.password = "";
      url.hash = "";
      for (const key of [...url.searchParams.keys()]) {
        if (SENSITIVE_NAME.test(key)) url.searchParams.set(key, "[REDACTED]");
      }
      const parts = url.pathname.split("/");
      for (let i = 0; i < parts.length - 1; i++) {
        if (/(^|[-_])(token|secret|session|auth|key|credential|jwt|bearer)([-_]|$)/i.test(parts[i]) && parts[i + 1].length > 6) parts[i + 1] = "[REDACTED]";
      }
      url.pathname = parts.join("/");
      return url.href;
    } catch { return ""; }
  }

  function isApiUrl(raw) {
    try {
      const url = new URL(raw, location.href);
      return API_PATH.test(url.pathname) ||
        /(^|\.)(api|graphql)\./i.test(url.hostname) ||
        [...url.searchParams.keys()].some((key) => /(api.?key|token|auth|session)/i.test(key));
    } catch { return false; }
  }

  function add(raw, source, observed = false) {
    const safeUrl = sanitize(raw);
    if (!safeUrl || (!observed && !isApiUrl(raw))) return;
    const key = safeUrl + "|" + source;
    if (found.has(key)) return;
    let host = "";
    try { host = new URL(safeUrl).host; } catch {}
    found.set(key, { url: safeUrl, source, host });
  }

  const entries = performance.getEntriesByType("resource");
  for (const entry of entries) {
    const type = String(entry.initiatorType || "").toLowerCase();
    if (type === "fetch" || type === "xmlhttprequest") add(entry.name, type, true);
    else add(entry.name, type || "resource", false);
  }

  for (const el of document.querySelectorAll("script[src], iframe[src], form[action], link[href], a[href]")) {
    const raw = el.src || el.action || el.href;
    if (raw) add(raw, el.tagName.toLowerCase(), false);
  }

  const absolute = /\bhttps?:\/\/[a-z0-9.-]+(?::[0-9]+)?(?:\/[^\s"'<>)]*)?/gi;
  const paths = /\/(?:api|graphql|oauth|auth|v[0-9]+|rest|rpc|accounts|users)(?:\/[A-Za-z0-9._~!$&'()*+,;=:@%/-]*)?/gi;
  let inlineScriptCount = 0;
  const scanSources = [];
  for (const script of document.scripts) {
    if (!script.textContent || script.src) continue;
    inlineScriptCount++;
    const text = script.textContent.slice(0, 500000);
    scanSources.push({ name: "inline script #" + inlineScriptCount, text });
    for (const match of text.matchAll(absolute)) add(match[0].replace(/[.,;)}\]]+$/, ""), "inline script", false);
    for (const match of text.matchAll(paths)) add(match[0].replace(/[.,;)}\]]+$/, ""), "inline script", false);
  }

  for (const meta of document.querySelectorAll("meta[name], meta[property]")) {
    if (meta.content) scanSources.push({ name: "meta " + (meta.name || meta.getAttribute("property")), text: meta.content.slice(0, 10000) });
  }

  const exposureChecks = checks.map(([label, pattern]) => {
    const sources = [];
    for (const source of scanSources) {
      pattern.lastIndex = 0;
      if (pattern.test(source.text)) sources.push(source.name);
    }
    return {
      label, matched: sources.length > 0, sourceCount: sources.length, sources,
      note: sources.length ? "Possible match only; its value was not collected or displayed." : "No match found in scanned inline scripts or meta fields."
    };
  });

  return {
    pageTitle: document.title || "(untitled page)",
    pageUrl: sanitize(location.href),
    pageOrigin: location.origin,
    scannedAt: new Date().toISOString(),
    resourceCount: entries.length,
    inlineScriptCount,
    endpoints: [...found.values()].sort((a, b) => a.host.localeCompare(b.host) || a.url.localeCompare(b.url)),
    exposureChecks,
    privacy: "Local-only passive scan. No API requests were sent. Token values, cookies, authorization headers, storage values, and matched secret values are not collected."
  };
}

async function executeScan(tab) {
  $("#scanButton").disabled = true;
  $("#exportButton").disabled = true;
  $("#copyAllButton").disabled = true;
  state.currentTabId = tab.id;
  setStatus("Scanning loaded page data…");
  try {
    const result = await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: scanCurrentPage });
    const report = result?.[0]?.result;
    if (!report) throw new Error("The page did not return scan results. Reload the website and try again.");
    state.report = report;
    state.endpoints = report.endpoints;
    renderReport();
    setStatus("Scan complete. Potential exposure matches require manual review.", "good");
  } catch (error) {
    setStatus(error?.message || "Unable to scan this page.", "error");
  } finally {
    $("#scanButton").disabled = false;
  }
}

function runScan() {
  const target = state.targetTabInfo;
  if (!target) {
    setStatus("Select a normal HTTP/HTTPS website tab, then reopen Server Trace.", "error");
    return;
  }
  chrome.permissions.contains({ origins: [target.originPattern] }).then((hasPermission) => {
    if (!hasPermission) {
      setStatus("Chrome permission is required. Press ALLOW SITE first.", "warn");
      return;
    }
    return executeScan(target.tab);
  }).catch((error) => setStatus(error?.message || "Unable to check site access.", "error"));
}

function allowSiteAccess() {
  const target = state.targetTabInfo;
  if (!target) {
    setStatus("Select a normal HTTP/HTTPS website tab first.", "error");
    return;
  }
  $("#grantSiteButton").disabled = true;
  setStatus("Requesting access to " + target.origin + "…");
  const request = chrome.permissions.request({ origins: [target.originPattern] });
  request.then((granted) => {
    if (!granted) {
      setStatus("Access was denied. Endpoint scanning is unavailable until you allow this site.", "warn");
      return;
    }
    setStatus("Site access granted for " + target.origin + ".", "good");
    return executeScan(target.tab);
  }).catch((error) => {
    setStatus(error?.message || "Chrome could not request site access.", "error");
  }).finally(() => {
    $("#grantSiteButton").disabled = false;
  });
}

function renderReport() {
  const report = state.report;
  if (!report) return;
  $("#pageTitle").textContent = report.pageTitle;
  $("#pageOrigin").textContent = report.pageOrigin;
  $("#endpointCount").textContent = String(report.endpoints.length);
  $("#findingCount").textContent = String(report.exposureChecks.filter((x) => x.matched).length);
  $("#scriptCount").textContent = String(report.inlineScriptCount);
  $("#scanTime").textContent = new Date(report.scannedAt).toLocaleTimeString();
  $("#exportButton").disabled = false;
  $("#copyAllButton").disabled = report.endpoints.length === 0;
  renderEndpoints();
  renderExposures();
}

function renderEndpoints() {
  const list = $("#endpointList");
  list.replaceChildren();
  const query = $("#filterInput").value.trim().toLowerCase();
  const endpoints = state.endpoints.filter((item) => item.url.toLowerCase().includes(query) || item.host.toLowerCase().includes(query) || item.source.toLowerCase().includes(query));
  if (!state.report) { list.append(makeEmpty("Scan the current tab to discover endpoint references.")); return; }
  if (!endpoints.length) { list.append(makeEmpty(query ? "No endpoints match this filter." : "No API-like endpoint references detected.")); return; }

  for (const item of endpoints) {
    const card = document.createElement("article"); card.className = "endpoint";
    const head = document.createElement("div"); head.className = "endpoint-head";
    const method = document.createElement("span"); method.className = "method";
    method.textContent = item.source === "fetch" || item.source === "xmlhttprequest" ? item.source.toUpperCase() : "REF";
    const source = document.createElement("span"); source.className = "source"; source.textContent = item.source;
    head.append(method, source);
    const url = document.createElement("div"); url.className = "url"; url.textContent = item.url;
    const foot = document.createElement("div"); foot.className = "endpoint-actions";
    const copy = document.createElement("button"); copy.className = "button small"; copy.textContent = "COPY URL";
    copy.addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(item.url); setStatus("Sanitized endpoint URL copied.", "good"); }
      catch { setStatus("Clipboard access was blocked by Chrome.", "error"); }
    });
    const host = document.createElement("span"); host.className = "host"; host.textContent = item.host;
    foot.append(copy, host); card.append(head, url, foot); list.append(card);
  }
}

function renderExposures() {
  const list = $("#exposureList"); list.replaceChildren();
  if (!state.report) { list.append(makeEmpty("No scan results yet.")); return; }
  for (const item of state.report.exposureChecks) {
    const card = document.createElement("article"); card.className = "finding";
    const label = document.createElement("div"); label.className = "finding-name"; label.textContent = item.label;
    const detail = document.createElement("div"); detail.className = "finding-detail";
    detail.textContent = item.matched ? "Possible match in " + item.sourceCount + " source(s): " + item.sources.join(", ") + ". Matched value hidden." : item.note;
    const tag = document.createElement("span"); tag.className = "tag"; tag.textContent = item.matched ? "REVIEW MANUALLY" : "NO MATCH";
    if (!item.matched) { tag.style.borderColor = "var(--border)"; tag.style.color = "var(--muted)"; }
    card.append(label, detail, tag); list.append(card);
  }
}

function makeEmpty(text) {
  const el = document.createElement("div"); el.className = "empty"; el.textContent = text; return el;
}

function exportReport() {
  if (!state.report) return;
  const blob = new Blob([JSON.stringify(state.report, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = "server-trace-safe-report.json"; a.click();
  URL.revokeObjectURL(url); setStatus("Sanitized report exported.", "good");
}

async function copyAll() {
  const text = state.endpoints.map((item) => item.url).join("\n");
  if (!text) return;
  try { await navigator.clipboard.writeText(text); setStatus("Copied " + state.endpoints.length + " sanitized endpoint URLs.", "good"); }
  catch { setStatus("Clipboard access was blocked by Chrome.", "error"); }
}

$("#scanButton").addEventListener("click", runScan);
$("#grantSiteButton").addEventListener("click", allowSiteAccess);
$("#exportButton").addEventListener("click", exportReport);
$("#copyAllButton").addEventListener("click", copyAll);
$("#filterInput").addEventListener("input", renderEndpoints);
document.querySelectorAll("[data-view]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-view]").forEach((other) => other.classList.toggle("active", other === button));
    document.querySelectorAll(".view").forEach((view) => view.classList.add("hidden"));
    $("#" + button.dataset.view + "View").classList.remove("hidden");
  });
});
function refreshActiveTabLabel() {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }).then((tabs) => {
    const tab = tabs[0];
    if (tab?.id && tab.url && /^https?:/i.test(tab.url)) {
      const pageUrl = new URL(tab.url);
      const target = {
        tab: { id: tab.id, url: tab.url, title: tab.title || "" },
        origin: pageUrl.origin,
        originPattern: pageUrl.protocol + "//" + pageUrl.hostname + "/*"
      };
      state.targetTabInfo = target;
      state.currentTabId = tab.id;
      $("#pageTitle").textContent = tab.title || "Current tab ready";
      $("#pageOrigin").textContent = target.origin;
      $("#scanButton").disabled = false;
      $("#grantSiteButton").disabled = false;
      setStatus("Press SCAN CURRENT TAB if site access is already granted, or ALLOW SITE to request access.");
    } else {
      state.targetTabInfo = null;
      $("#pageTitle").textContent = "Select a website tab";
      $("#pageOrigin").textContent = "Chrome internal pages cannot be scanned.";
      $("#scanButton").disabled = true;
      $("#grantSiteButton").disabled = true;
      setStatus("Open a normal HTTP/HTTPS site, such as https://example.com/.", "warn");
    }
  }).catch(() => {
    state.targetTabInfo = null;
    setStatus("Could not read the current tab. Reload this extension.", "error");
  });
}
refreshActiveTabLabel();
chrome.tabs.onActivated.addListener(() => refreshActiveTabLabel());
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.active) refreshActiveTabLabel();
});

const consoleRuntime = {
  frameReady: false,
  nextRunId: 1,
  activeRunId: null,
  queuedRun: null,
  outputCount: 0,
  fileExecutionMode: "sandbox",
  pageRunInProgress: false
};

function consoleOutput(text, level = "log") {
  const output = $("#consoleOutput");
  const line = document.createElement("div");
  line.className = "console-line" + (level === "error" ? " error-line" : level === "warn" ? " warn-line" : level === "result" ? " result-line" : "");
  line.textContent = String(text);
  output.append(line);
  consoleRuntime.outputCount++;
  while (output.children.length > 600) output.firstElementChild.remove();
  output.scrollTop = output.scrollHeight;
}

function clearConsoleOutput() {
  $("#consoleOutput").replaceChildren();
  consoleRuntime.outputCount = 0;
}

function requestSandboxReady() {
  const frame = $("#consoleSandbox");
  try {
    frame.contentWindow.postMessage({ serverTracePing: true }, "*");
  } catch (error) {
    $("#consoleRunStatus").textContent = "Sandbox connection failed";
  }
}

function prepareConsoleSandbox() {
  const frame = $("#consoleSandbox");
  frame.addEventListener("load", () => {
    consoleRuntime.frameReady = false;
    $("#consoleRunStatus").textContent = "Connecting to sandbox…";
    requestSandboxReady();
  });
}

function sendConsoleCode(code, source = "command", alreadyLogged = false) {
  const frame = $("#consoleSandbox");
  if (!code.trim()) {
    consoleOutput("No JavaScript code to run.", "warn");
    resetConsoleRun();
    return;
  }

  if (!alreadyLogged) consoleOutput("> " + source, "muted");
  $("#runCommandButton").disabled = true;
  $("#runFileButton").disabled = true;

  if (!consoleRuntime.frameReady) {
    consoleRuntime.queuedRun = { code, source, alreadyLogged: true };
    $("#consoleRunStatus").textContent = "Connecting to sandbox…";
    requestSandboxReady();
    return;
  }

  const runId = consoleRuntime.nextRunId++;
  consoleRuntime.activeRunId = runId;
  $("#consoleRunStatus").textContent = "Running…";
  frame.contentWindow.postMessage({
    serverTraceRequest: true,
    runId,
    code,
    report: state.report || null
  }, "*");
}

async function hideRuntimeFloat() {
  const target = state.targetTabInfo;
  const tabId = target?.tab?.id || state.currentTabId;
  if (typeof tabId !== "number") {
    consoleOutput("No target website tab. Open the website and reopen Server Trace.", "error");
    return;
  }
  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      func: () => document.getElementById("server-trace-float-host")?.remove()
    });
    consoleOutput("Float window closed on the website.", "muted");
  } catch (error) {
    consoleOutput("Could not close page float: " + String(error?.message || error), "error");
  }
}

async function showRuntimeFloat(options) {
  const target = state.targetTabInfo;
  const tabId = target?.tab?.id || state.currentTabId;
  if (typeof tabId !== "number" || !target?.originPattern) {
    consoleOutput("No target website tab. Select the website, then reopen Server Trace.", "error");
    setStatus("Open a regular website and allow access to that site before showing a page float.", "error");
    return;
  }

  try {
    const granted = await chrome.permissions.contains({ origins: [target.originPattern] });
    if (!granted) {
      consoleOutput("Website permission is missing. Click ALLOW SITE, then run float.show(...) again.", "error");
      setStatus("Click ALLOW SITE before showing a float on this website.", "warn");
      return;
    }

    await chrome.scripting.insertCSS({ target: { tabId }, css: PAGE_FLOAT_CSS });
    await chrome.scripting.executeScript({
      target: { tabId },
      func: (options) => {
        const oldHost = document.getElementById("server-trace-float-host");
        oldHost?.remove();

        const safeTitle = typeof options?.title === "string" && options.title.trim()
          ? options.title.slice(0, 100)
          : "Floating window";
        const safeText = typeof options?.text === "string" ? options.text.slice(0, 5000) : "";
        const requestedWidth = Number(options?.width);
        const width = Number.isFinite(requestedWidth) ? Math.max(180, Math.min(520, requestedWidth)) : 280;
        const host = document.createElement("div");
        host.id = "server-trace-float-host";
        host.setAttribute("data-server-trace", "page-float");

        const panel = document.createElement("section");
        panel.className = "stx-window";
        panel.style.setProperty("width", width + "px", "important");
        panel.setAttribute("role", "dialog");
        panel.setAttribute("aria-label", safeTitle);

        const bar = document.createElement("div");
        bar.className = "stx-titlebar";
        const title = document.createElement("div");
        title.className = "stx-title";
        title.textContent = safeTitle;
        const close = document.createElement("button");
        close.className = "stx-close";
        close.type = "button";
        close.textContent = "×";
        close.title = "Close floating window";
        close.setAttribute("aria-label", "Close floating window");
        close.addEventListener("click", () => host.remove());
        bar.append(title, close);

        const content = document.createElement("div");
        content.className = "stx-body";
        content.textContent = safeText;
        panel.append(bar, content);
        host.append(panel);
        (document.documentElement || document.body).append(host);

        let drag = null;
        bar.addEventListener("pointerdown", (event) => {
          if (event.target.closest("button")) return;
          const rect = panel.getBoundingClientRect();
          drag = { x: event.clientX, y: event.clientY, left: rect.left, top: rect.top };
          try { bar.setPointerCapture(event.pointerId); } catch {}
        });
        bar.addEventListener("pointermove", (event) => {
          if (!drag) return;
          const rect = panel.getBoundingClientRect();
          const left = Math.max(0, Math.min(window.innerWidth - Math.min(rect.width, 100), drag.left + event.clientX - drag.x));
          const top = Math.max(0, Math.min(window.innerHeight - Math.min(rect.height, 50), drag.top + event.clientY - drag.y));
          panel.style.setProperty("left", left + "px", "important");
          panel.style.setProperty("top", top + "px", "important");
        });
        const release = () => { drag = null; };
        bar.addEventListener("pointerup", release);
        bar.addEventListener("pointercancel", release);
      },
      args: [options || {}]
    });
    consoleOutput("Float window displayed on the website.", "result");
    setStatus("Page float shown on " + target.origin + ".", "good");
  } catch (error) {
    consoleOutput("Could not show page float: " + String(error?.message || error), "error");
    setStatus("Page float failed. Check site permission and reload the extension.", "error");
  }
}

function resetConsoleRun() {
  consoleRuntime.activeRunId = null;
  $("#runCommandButton").disabled = false;
  $("#runFileButton").disabled = false;
  $("#runPageButton").disabled = false;
  $("#runFilePageButton").disabled = false;
  $("#consoleRunStatus").textContent = "Sandbox ready";
}

function runConsoleCommand() {
  sendConsoleCode($("#consoleInput").value, "console command");
}

function resetSandbox() {
  const oldFrame = $("#consoleSandbox");
  const freshFrame = oldFrame.cloneNode(false);
  oldFrame.replaceWith(freshFrame);
  consoleRuntime.frameReady = false;
  consoleRuntime.activeRunId = null;
  consoleRuntime.queuedRun = null;
  freshFrame.addEventListener("load", () => {
    consoleRuntime.frameReady = false;
    $("#consoleRunStatus").textContent = "Connecting to sandbox…";
    requestSandboxReady();
  });
  freshFrame.src = "sandbox.html";
  $("#runCommandButton").disabled = false;
  $("#runFileButton").disabled = false;
}

$("#runCommandButton").addEventListener("click", runConsoleCommand);
$("#runPageButton").addEventListener("click", () => runPageContext($("#consoleInput").value, "console command"));
$("#runFileButton").addEventListener("click", () => {
  consoleRuntime.fileExecutionMode = "sandbox";
  $("#consoleFileInput").click();
});
$("#runFilePageButton").addEventListener("click", () => {
  consoleRuntime.fileExecutionMode = "page";
  $("#consoleFileInput").click();
});
$("#clearConsoleButton").addEventListener("click", () => {
  clearConsoleOutput();
  resetSandbox();
  consoleOutput("Console output cleared. Sandbox reset.", "muted");
});
$("#consoleInput").addEventListener("keydown", (event) => {
  if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
    event.preventDefault();
    runConsoleCommand();
  }
});
$("#consoleFileInput").addEventListener("change", async (event) => {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  if (file.size > 500 * 1024) {
    consoleOutput("File is larger than the 500 KB safety limit.", "error");
    event.target.value = "";
    return;
  }
  try {
    const source = await file.text();
    $("#consoleInput").value = source;
    if (consoleRuntime.fileExecutionMode === "page") {
      runPageContext(source, "file: " + file.name);
    } else {
      sendConsoleCode(source, "file: " + file.name);
    }
  } catch (error) {
    consoleOutput("Could not read file: " + (error?.message || error), "error");
  } finally {
    event.target.value = "";
  }
});

window.addEventListener("message", (event) => {
  const frame = $("#consoleSandbox");
  if (event.source !== frame.contentWindow || !event.data || event.data.serverTraceSandbox !== true) return;
  const message = event.data;
  if (message.type === "READY") {
    consoleRuntime.frameReady = true;
    $("#consoleRunStatus").textContent = "Sandbox ready";
    if (consoleRuntime.queuedRun) {
      const queued = consoleRuntime.queuedRun;
      consoleRuntime.queuedRun = null;
      sendConsoleCode(queued.code, queued.source, queued.alreadyLogged === true);
    }
    return;
  }
  if (message.type === "FLOAT_SHOW") {
    showRuntimeFloat(message.options || {});
    return;
  }
  if (message.type === "FLOAT_HIDE") {
    hideRuntimeFloat();
    return;
  }
  if (message.runId !== consoleRuntime.activeRunId) return;
  if (message.type === "START") $("#consoleRunStatus").textContent = "Running…";
  if (message.type === "LOG") consoleOutput((message.values || []).join(" "), message.level);
  if (message.type === "RESULT") consoleOutput(message.value, "result");
  if (message.type === "CLEAR") clearConsoleOutput();
  if (message.type === "ERROR") {
    consoleOutput(message.message || "Execution failed.", "error");
    resetConsoleRun();
  }
  if (message.type === "DONE") resetConsoleRun();
});

prepareConsoleSandbox();


const UPDATE_SOURCE = "https://raw.githubusercontent.com/FeaturedPr0ject/the-console-helper/main/extension/manifest.json";
const UPDATE_ZIP = "https://github.com/FeaturedPr0ject/the-console-helper/archive/refs/heads/main.zip";
let installedVersion = "0.0.0";
let latestVersion = null;
let updateAvailable = false;
let updateCheckInProgress = false;

function parseVersion(version) {
  return String(version || "").split(".").map((part) => {
    const digits = part.match(/^\d+/);
    return digits ? Number(digits[0]) : 0;
  });
}

function compareVersions(a, b) {
  const left = parseVersion(a);
  const right = parseVersion(b);
  const length = Math.max(left.length, right.length);
  for (let i = 0; i < length; i++) {
    const x = left[i] || 0;
    const y = right[i] || 0;
    if (x > y) return 1;
    if (x < y) return -1;
  }
  return 0;
}

async function checkForUpdates(silent = false) {
  if (updateCheckInProgress) return;
  updateCheckInProgress = true;
  const checkButton = $("#checkUpdateButton");
  const downloadButton = $("#downloadUpdateButton");
  checkButton.disabled = true;
  downloadButton.disabled = true;
  $("#updateStatus").className = "update-status";
  $("#updateStatus").textContent = "Checking the GitHub version…";

  try {
    const localResponse = await fetch(chrome.runtime.getURL("manifest.json"), { cache: "no-store" });
    if (!localResponse.ok) throw new Error("Could not read the installed extension version.");
    const localManifest = await localResponse.json();
    installedVersion = String(localManifest.version || "0.0.0");
    $("#installedVersion").textContent = installedVersion;

    const remoteUrl = UPDATE_SOURCE + "?check=" + Date.now();
    const response = await fetch(remoteUrl, {
      method: "GET",
      cache: "no-store",
      headers: { "Accept": "application/json" }
    });
    if (!response.ok) throw new Error("GitHub returned HTTP " + response.status + ".");
    const remoteManifest = await response.json();
    latestVersion = String(remoteManifest.version || "");
    if (!/^\d+\.\d+\.\d+/.test(latestVersion)) throw new Error("GitHub returned an invalid version number.");

    $("#latestVersion").textContent = latestVersion;
    $("#updateCheckedAt").textContent = new Date().toLocaleTimeString();

    const comparison = compareVersions(latestVersion, installedVersion);
    if (comparison > 0) {
      updateAvailable = true;
      $("#updateStatus").classList.add("available");
      $("#updateStatus").textContent = "A newer version is available: " + latestVersion + ". Download the ZIP, replace the local extension files, and reload it.";
      downloadButton.disabled = false;
      if (!silent) setStatus("Server Trace update available: " + latestVersion + ".", "good");
    } else if (comparison === 0) {
      updateAvailable = false;
      $("#updateStatus").textContent = "You're up to date. Version " + installedVersion + " matches GitHub.";
      if (!silent) setStatus("Server Trace is up to date.", "good");
    } else {
      updateAvailable = false;
      $("#updateStatus").textContent = "The installed version is newer than the version currently on GitHub.";
      if (!silent) setStatus("Installed version is newer than GitHub main.", "warn");
    }
  } catch (error) {
    $("#latestVersion").textContent = "Unavailable";
    $("#updateCheckedAt").textContent = new Date().toLocaleTimeString();
    $("#updateStatus").classList.add("error");
    $("#updateStatus").textContent = "Could not check GitHub: " + String(error?.message || error) + ". Check your internet connection and try again.";
    if (!silent) setStatus("Update check failed. See the UPDATE tab.", "error");
  } finally {
    checkButton.disabled = false;
    updateCheckInProgress = false;
  }
}

$("#checkUpdateButton").addEventListener("click", () => checkForUpdates(false));
$("#downloadUpdateButton").addEventListener("click", () => {
  if (!updateAvailable) return;
  chrome.tabs.create({ url: UPDATE_ZIP });
});
checkForUpdates(true);


function getUserScriptsApi() {
  try {
    const api = chrome.userScripts;
    return api && typeof api.execute === "function" ? api : null;
  } catch {
    return null;
  }
}

function pageResultText(value) {
  if (value === undefined) return "undefined";
  if (typeof value === "string") return value;
  try {
    const text = JSON.stringify(value, null, 2);
    return text === undefined ? String(value) : text;
  } catch {
    try { return String(value); } catch { return "[Result could not be serialized]"; }
  }
}

function runPageContext(code, source = "console command") {
  const target = state.targetTabInfo;
  if (!target?.tab?.id || !target.originPattern) {
    setStatus("Select a normal HTTP/HTTPS website tab first.", "error");
    consoleOutput("No active website is selected. Open a site and reopen Server Trace.", "error");
    return;
  }
  if (typeof code !== "string" || !code.trim()) {
    consoleOutput("No JavaScript code to run.", "warn");
    return;
  }
  if (code.length > 500000) {
    consoleOutput("Code is larger than the 500 KB safety limit.", "error");
    return;
  }

  const userScripts = getUserScriptsApi();
  if (!userScripts) {
    const message = "Chrome has not enabled User Scripts for this extension. Open chrome://extensions → Server Trace → Details → enable Allow User Scripts, then reload the extension.";
    consoleOutput(message, "error");
    setStatus("Enable Allow User Scripts on the extension Details page, then reload.", "error");
    return;
  }

  let permissionRequest;
  try {
    permissionRequest = chrome.permissions.request({ origins: [target.originPattern] });
  } catch (error) {
    consoleOutput("Could not request site permission: " + String(error?.message || error), "error");
    setStatus("Site permission request failed.", "error");
    return;
  }

  consoleRuntime.pageRunInProgress = true;
  $("#runPageButton").disabled = true;
  $("#runFilePageButton").disabled = true;
  $("#consoleRunStatus").textContent = "Running in page context…";
  consoleOutput("> " + source + " [PAGE CONTEXT]", "muted");
  setStatus("Executing JavaScript on " + target.origin + "…");

  Promise.resolve(permissionRequest).then(async (granted) => {
    if (!granted) throw new Error("Site access was denied. Allow this site and retry.");
    const sourceCode = 'console.log("%c[Server Trace · Page Console]", "color:#79c7a0;font-weight:bold");\n' +
      code + "\n//# sourceURL=server-trace-page-console.js";
    const results = await userScripts.execute({
      target: { tabId: target.tab.id },
      js: [{ code: sourceCode }],
      world: "MAIN",
      injectImmediately: true
    });
    let resultShown = false;
    for (const result of results || []) {
      if (result.error) {
        consoleOutput("Frame " + result.frameId + ": " + String(result.error), "error");
        resultShown = true;
      } else if (result.result !== undefined) {
        consoleOutput("Result: " + pageResultText(result.result), "result");
        resultShown = true;
      }
    }
    if (!resultShown) {
      consoleOutput("Executed on the webpage. Native console output is visible in this tab's F12 Console.", "result");
    }
    $("#consoleRunStatus").textContent = "Page command complete";
    setStatus("Executed in the website's MAIN world. Check F12 Console for native console output.", "good");
  }).catch((error) => {
    const message = String(error?.message || error);
    consoleOutput("Page execution failed: " + message, "error");
    if (/user.?script|permission|not allowed|enable/i.test(message)) {
      consoleOutput("Check chrome://extensions → Server Trace → Details → Allow User Scripts, and grant access to " + target.origin + ".", "warn");
    }
    $("#consoleRunStatus").textContent = "Page command failed";
    setStatus("Page-context execution failed. See Output for details.", "error");
  }).finally(() => {
    consoleRuntime.pageRunInProgress = false;
    $("#runPageButton").disabled = false;
    $("#runFilePageButton").disabled = false;
  });
}
