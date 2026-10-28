const $ = (selector) => document.querySelector(selector);
const sandboxFrame = $("#sandbox");
const runButton = $("#runButton");
const output = $("#output");
let sandboxReady = false;
let activeRunId = null;
let runCounter = 0;
let scanItems = [];

document.querySelectorAll("[data-view]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-view]").forEach((item) => item.classList.toggle("active", item === button));
    $("#scanView").classList.toggle("hidden", button.dataset.view !== "scan");
    $("#consoleView").classList.toggle("hidden", button.dataset.view !== "console");
    $("#aboutView").classList.toggle("hidden", button.dataset.view !== "about");
  });
});

function appendOutput(text, level) {
  const line = document.createElement("div");
  line.className = "output-line " + (level || "log");
  line.textContent = text;
  output.appendChild(line);
  output.scrollTop = output.scrollHeight;
}

sandboxFrame.addEventListener("load", () => {
  sandboxReady = true;
  runButton.disabled = false;
  $("#runStatus").textContent = "Sandbox ready";
  output.textContent = "Sandbox ready. Run code you understand and trust.";
});

$("#runButton").addEventListener("click", () => {
  const code = $("#code").value;
  if (!code.trim()) {
    appendOutput("Enter JavaScript first.", "warn");
    return;
  }
  if (!sandboxReady) {
    appendOutput("The sandbox is not ready yet. Try again in a moment.", "error");
    return;
  }
  activeRunId = ++runCounter;
  output.textContent = "";
  $("#runStatus").textContent = "Running…";
  runButton.disabled = true;
  sandboxFrame.contentWindow.postMessage({
    serverTraceLegacyRequest: true,
    runId: activeRunId,
    code
  }, "*");
});

$("#clearButton").addEventListener("click", () => {
  output.textContent = "";
  $("#runStatus").textContent = "Cleared";
});

window.addEventListener("message", (event) => {
  if (event.source !== sandboxFrame.contentWindow || !event.data || event.data.serverTraceLegacySandbox !== true) return;
  const message = event.data;
  if (message.type === "READY") {
    sandboxReady = true;
    runButton.disabled = false;
    $("#runStatus").textContent = "Sandbox ready";
    return;
  }
  if (message.runId !== activeRunId) return;
  if (message.type === "CLEAR") output.textContent = "";
  if (message.type === "LOG") appendOutput(message.text, message.level);
  if (message.type === "RESULT") appendOutput("Result: " + message.text, "result");
  if (message.type === "ERROR") appendOutput(message.message || "Execution failed.", "error");
  if (message.type === "DONE") {
    $("#runStatus").textContent = "Complete";
    runButton.disabled = false;
    activeRunId = null;
  }
});

function scanCurrentPage() {
  const sensitiveName = /(token|secret|password|passwd|auth|session|cookie|csrf|xsrf|api.?key|signature|credential|jwt|bearer|access.?key|client.?key)/i;
  const apiPath = /(^|\/)(api|graphql|oauth|auth|v\d+|rest|rpc|accounts|users)(\/|$)/i;
  const found = new Map();

  function normalize(raw, kind) {
    if (typeof raw !== "string" || !raw.trim()) return;
    let url;
    try { url = new URL(raw, location.href); } catch { return; }
    if (url.protocol !== "http:" && url.protocol !== "https:") return;
    const originalPath = url.pathname;
    let shouldInclude = apiPath.test(originalPath) || kind === "fetch" || kind === "xmlhttprequest" || kind === "inline";
    if (!shouldInclude) return;
    Array.from(url.searchParams.entries()).forEach(([key, value]) => {
      if (sensitiveName.test(key)) url.searchParams.set(key, "[REDACTED]");
    });
    const safe = url.href.slice(0, 2000);
    if (!found.has(safe)) found.set(safe, apiPath.test(originalPath) ? "API-LIKE URL" : kind.toUpperCase());
  }

  performance.getEntriesByType("resource").forEach((entry) => {
    const kind = String(entry.initiatorType || "resource").toLowerCase();
    if (kind === "fetch" || kind === "xmlhttprequest" || apiPath.test((() => { try { return new URL(entry.name, location.href).pathname; } catch { return ""; } })())) {
      normalize(entry.name, kind);
    }
  });

  document.querySelectorAll("script[src],link[href],form[action],[data-api-url]").forEach((element) => {
    normalize(element.src || element.href || element.action || element.getAttribute("data-api-url"), element.tagName.toLowerCase());
  });

  const routePattern = /(?:https?:\/\/[^\s"'\x60<>]+|\/(?:[A-Za-z0-9_.~-]+\/){1,7}[A-Za-z0-9_.~?&=%-]*)/g;
  document.querySelectorAll("script:not([src])").forEach((script) => {
    const text = script.textContent || "";
    const matches = text.match(routePattern) || [];
    matches.slice(0, 500).forEach((candidate) => {
      if (apiPath.test(candidate) || /graphql|oauth|\/api\b/i.test(candidate)) normalize(candidate.replace(/[),;]+$/, ""), "inline");
    });
  });

  return {
    title: String(document.title || "").slice(0, 250),
    origin: location.origin,
    count: found.size,
    items: Array.from(found.entries()).slice(0, 300).map(([url, type]) => ({ url, type }))
  };
}

function renderEndpoints() {
  const query = $("#filterInput").value.trim().toLowerCase();
  const container = $("#endpointList");
  container.textContent = "";
  const items = scanItems.filter((item) => !query || item.url.toLowerCase().includes(query) || item.type.toLowerCase().includes(query));
  $("#endpointCount").textContent = items.length + " item" + (items.length === 1 ? "" : "s");
  if (!items.length) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = scanItems.length ? "No results match this filter." : "No endpoint-like URLs found. The page may not expose any in the scanned resources or scripts.";
    container.appendChild(empty);
    return;
  }
  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "endpoint";
    const type = document.createElement("span");
    type.className = "endpoint-type";
    type.textContent = item.type;
    const url = document.createElement("div");
    url.className = "endpoint-url";
    url.textContent = item.url;
    card.append(type, url);
    container.appendChild(card);
  });
}

$("#filterInput").addEventListener("input", renderEndpoints);

$("#scanButton").addEventListener("click", async () => {
  const button = $("#scanButton");
  button.disabled = true;
  $("#scanStatus").className = "status";
  $("#scanStatus").textContent = "Scanning the active tab…";
  try {
    const tabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    const tab = tabs && tabs[0];
    if (!tab || typeof tab.id !== "number") throw new Error("No active browser tab was found.");
    const result = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: scanCurrentPage
    });
    const report = result && result[0] && result[0].result;
    if (!report) throw new Error("The page did not return scan results. Internal Chrome pages and the Chrome Web Store cannot be scanned.");
    scanItems = report.items || [];
    renderEndpoints();
    $("#scanStatus").className = "status good";
    $("#scanStatus").textContent = "Scanned: " + (report.title || report.origin) + " · " + scanItems.length + " candidate(s).";
  } catch (error) {
    scanItems = [];
    renderEndpoints();
    $("#scanStatus").className = "status error";
    $("#scanStatus").textContent = "Scan failed: " + String(error && error.message ? error.message : error) + " Open a normal website tab, then try again.";
  } finally {
    button.disabled = false;
  }
});
