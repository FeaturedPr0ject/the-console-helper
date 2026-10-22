const $ = (selector) => document.querySelector(selector);
const state = { report: null, endpoints: [], currentTabId: null };
const SENSITIVE_NAME = /(token|secret|password|passwd|auth|session|cookie|csrf|xsrf|api.?key|signature|credential|jwt|bearer|access.?key|client.?key)/i;
const API_PATH = /(^|\/)(api|graphql|oauth|auth|v\d+|rest|rpc|accounts|users)(\/|$)/i;

function setStatus(message, kind = "") {
  const el = $("#status");
  el.textContent = message;
  el.className = "status" + (kind ? " " + kind : "");
}

function scanCurrentPage() {
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

async function activeTab() {
  const tabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  const tab = tabs[0];
  if (!tab?.id || !tab.url || !/^https?:/i.test(tab.url)) throw new Error("Open a regular HTTP/HTTPS website tab first.");
  return tab;
}

async function runScan() {
  $("#scanButton").disabled = true;
  $("#exportButton").disabled = true;
  $("#copyAllButton").disabled = true;
  setStatus("Scanning loaded page data…");
  try {
    const tab = await activeTab();
    state.currentTabId = tab.id;
    const result = await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: scanCurrentPage });
    const report = result?.[0]?.result;
    if (!report) throw new Error("The page did not return scan results. Try reloading it and scanning again.");
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
chrome.tabs.query({ active: true, lastFocusedWindow: true }).then((tabs) => {
  const tab = tabs[0];
  if (tab?.url && /^https?:/i.test(tab.url)) {
    $("#pageTitle").textContent = tab.title || "Current tab ready";
    try { $("#pageOrigin").textContent = new URL(tab.url).origin; } catch {}
  }
});