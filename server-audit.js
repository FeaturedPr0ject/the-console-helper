(() => {
  "use strict";
  const ID = "the-console-helper-server-audit";
  const OLD = document.getElementById(ID);
  if (OLD) OLD.remove();

  const host = document.createElement("div");
  host.id = ID;
  host.style.cssText = "position:fixed;z-index:2147483647;top:18px;right:18px;width:min(860px,calc(100vw - 24px));height:min(720px,calc(100vh - 36px));";
  const shadow = host.attachShadow({ mode: "open" });
  const style = document.createElement("style");
  style.textContent = ':host{all:initial;color-scheme:light dark;font:12px/1.45 ui-monospace,SFMono-Regular,Consolas,monospace}*{box-sizing:border-box}#app{height:100%;display:flex;flex-direction:column;background:#17191d;color:#e7e9ee;border:1px solid #41444b;box-shadow:0 20px 60px #0008;overflow:hidden}button,input{font:inherit}button{background:#24272d;color:#f2f3f5;border:1px solid #4b4f58;border-radius:0;padding:7px 10px;cursor:pointer}button:hover{background:#343841}button:disabled{opacity:.45;cursor:not-allowed}.top{display:flex;align-items:center;gap:10px;min-height:48px;padding:9px 11px;background:#202329;border-bottom:1px solid #3b3e46;cursor:move;user-select:none}.brand{font-weight:700;letter-spacing:.08em}.badge{margin-left:auto;border:1px solid #4d6858;color:#a6e5bb;padding:3px 6px;font-size:10px}.close{margin-left:0;padding:5px 8px}.bar{display:flex;gap:6px;flex-wrap:wrap;padding:9px 10px;border-bottom:1px solid #353840}.tabs{display:flex;gap:0;border-bottom:1px solid #3a3d45;background:#1d2025}.tab{flex:1;border:0;border-right:1px solid #353840;padding:10px 6px;background:transparent;color:#aeb3bd}.tab.active{background:#30343c;color:white;box-shadow:inset 0 -2px #d5d9e0}.status{padding:8px 11px;border-bottom:1px solid #353840;color:#aeb5c0;white-space:normal}.content{flex:1;min-height:0;overflow:auto;padding:10px}.sectionTitle{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#a7adb8;margin:5px 0 9px}.note{padding:9px 10px;background:#202329;border:1px solid #393d45;color:#c4c8d0;margin-bottom:10px}.note strong{color:#fff}.row{display:flex;align-items:flex-start;gap:10px;padding:9px 8px;border-bottom:1px solid #30333a;overflow-wrap:anywhere}.row:nth-child(even){background:#1b1e23}.main{min-width:0;flex:1;overflow-wrap:anywhere;word-break:break-word}.sub{color:#9fa6b2;margin-top:3px;font-size:10px}.tag{flex-shrink:0;padding:2px 5px;border:1px solid #515660;color:#cbd0d9;font-size:10px}.tag.warn{border-color:#81643a;color:#f3c47e}.empty{padding:24px 12px;text-align:center;color:#969da8}.foot{padding:8px 11px;border-top:1px solid #353840;color:#9299a5;display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap}.hidden{display:none!important}.error{color:#f1a4a4}.ok{color:#a6e5bb}.muted{color:#969da8}';
  shadow.appendChild(style);
  const shell = document.createElement("div");
  shell.id = "app";
  shell.innerHTML = '<div class="top" id="drag"><div class="brand">SERVER TRACE / LOCAL AUDIT</div><div class="badge">LOCAL ONLY</div><button class="close" id="close">×</button></div><div class="bar"><button id="scan">SCAN CURRENT PAGE</button><button id="copy">COPY SAFE REPORT</button><button id="export">EXPORT JSON</button></div><div class="tabs"><button class="tab active" data-tab="endpoints">API ENDPOINTS</button><button class="tab" data-tab="exposure">EXPOSURE CHECKS</button><button class="tab" data-tab="storage">STORAGE KEYS</button></div><div id="status" class="status">Ready. The scan does not send requests to any server.</div><div id="endpoints" class="content"></div><div id="exposure" class="content hidden"></div><div id="storage" class="content hidden"></div><div class="foot"><span>Never displays token values, cookies, or authorization headers.</span><span id="counts">0 endpoints · 0 findings</span></div>';
  shadow.appendChild(shell);

  const $ = (q) => shadow.querySelector(q);
  const statusEl = $("#status");
  const tabs = Array.from(shadow.querySelectorAll("[data-tab]"));
  let report = { pageOrigin: location.origin, scannedAt: null, endpoints: [], exposureChecks: [], storageKeys: [], privacy: "Local-only scan; no requests sent; token values, cookies, and authorization headers are not collected." };

  function setStatus(text, isError) {
    statusEl.textContent = text;
    statusEl.className = "status" + (isError ? " error" : "");
  }

  function safeURL(raw) {
    try {
      const u = new URL(raw, location.href);
      if (u.protocol !== "http:" && u.protocol !== "https:") return "";
      const keys = Array.from(u.searchParams.keys());
      for (const key of keys) {
        if (/(token|secret|password|passwd|auth|session|cookie|csrf|xsrf|api.?key|signature|credential|jwt|bearer)/i.test(key)) u.searchParams.set(key, "[REDACTED]");
      }
      const parts = u.pathname.split("/");
      for (let i = 0; i < parts.length - 1; i++) {
        if (/(^|[-_])(token|secret|session|auth|key|credential|jwt)([-_]|$)/i.test(parts[i]) && parts[i + 1] && parts[i + 1].length > 6) parts[i + 1] = "[REDACTED]";
      }
      u.pathname = parts.join("/");
      u.hash = "";
      return u.href;
    } catch {
      return "";
    }
  }

  function endpointish(raw) {
    try {
      const u = new URL(raw, location.href);
      return /(^|\/)(api|graphql|oauth|auth|v[0-9]+|rest|rpc|token)(\/|$)/i.test(u.pathname) ||
        Array.from(u.searchParams.keys()).some((k) => /(token|auth|key|session|api.?key)/i.test(k));
    } catch {
      return /\/(api|graphql|oauth|auth|v[0-9]+|rest|rpc|token)(\/|$)/i.test(String(raw));
    }
  }

  function pushEndpoint(store, raw, source) {
    const url = safeURL(raw);
    if (!url) return;
    const key = source + "|" + url;
    if (!store.has(key)) {
      let origin = "external";
      try { origin = new URL(url).origin === location.origin ? "same-origin" : "third-party"; } catch {}
      store.set(key, { url, source, origin });
    }
  }

  function scanEndpointSources() {
    const found = new Map();
    for (const entry of performance.getEntriesByType("resource")) {
      if (!entry.name) continue;
      const initiator = String(entry.initiatorType || "resource").toLowerCase();
      if (initiator === "fetch" || initiator === "xmlhttprequest" || endpointish(entry.name)) {
        pushEndpoint(found, entry.name, initiator);
      }
    }
    for (const el of document.querySelectorAll("script[src],iframe[src],form[action],link[href],a[href]")) {
      const raw = el.src || el.action || el.href;
      if (raw && endpointish(raw)) pushEndpoint(found, raw, el.tagName.toLowerCase());
    }
    const urlPattern = /\bhttps?:\/\/[a-z0-9.-]+(?::[0-9]+)?(?:\/[^\s"'<>)]*)?/gi;
    const pathPattern = /\/(?:api|graphql|oauth|auth|v[0-9]+|rest|rpc|token)(?:\/[A-Za-z0-9._~!$&'()*+,;=:@%/-]*)?/gi;
    for (const script of document.scripts) {
      if (script.src || !script.textContent) continue;
      const text = script.textContent.slice(0, 500000);
      for (const match of text.matchAll(urlPattern)) if (endpointish(match[0])) pushEndpoint(found, match[0], "inline-script");
      for (const match of text.matchAll(pathPattern)) pushEndpoint(found, match[0], "inline-script");
    }
    return Array.from(found.values()).sort((a, b) => a.url.localeCompare(b.url));
  }

  function scanExposures() {
    const checks = [
      { id: "provider-key", label: "Recognizable provider/API key pattern", re: /\b(?:sk_live|sk_test|ghp|github_pat|glpat|xox[baprs]|AKIA|AIza)[-_A-Za-z0-9]{12,}\b/g },
      { id: "jwt-like", label: "JWT-like token pattern", re: /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g },
      { id: "credential-assignment", label: "Credential-like assignment in embedded code", re: /(?:access[_-]?token|refresh[_-]?token|api[_-]?key|client[_-]?secret|private[_-]?key|session[_-]?token|authorization|bearer)\s*["'\s:=]+\s*["']?[A-Za-z0-9._~+/=-]{12,}/ig },
      { id: "private-key-marker", label: "Private-key marker", re: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g }
    ];
    const sources = [];
    let index = 0;
    for (const script of document.scripts) {
      if (script.src || !script.textContent) continue;
      index++;
      sources.push({ name: "inline script #" + index, text: script.textContent.slice(0, 500000) });
    }
    for (const meta of document.querySelectorAll("meta[name],meta[property]")) {
      if (meta.content) sources.push({ name: "meta " + (meta.name || meta.getAttribute("property")), text: meta.content.slice(0, 10000) });
    }
    const results = [];
    for (const check of checks) {
      let sourceCount = 0;
      const locations = [];
      for (const source of sources) {
        check.re.lastIndex = 0;
        if (check.re.test(source.text)) {
          sourceCount++;
          locations.push(source.name);
        }
      }
      results.push({ id: check.id, label: check.label, sourceCount, locations, note: sourceCount ? "Potential match only. The matched value is deliberately not collected or displayed." : "No match in the scanned inline scripts/meta fields." });
    }
    return results;
  }

  function scanStorageKeys() {
    const results = [];
    for (const [storeName, store] of [["localStorage", window.localStorage], ["sessionStorage", window.sessionStorage]]) {
      try {
        for (let i = 0; i < store.length; i++) {
          const key = store.key(i);
          if (key == null) continue;
          const sensitive = /(token|secret|password|passwd|auth|session|cookie|csrf|xsrf|credential|jwt|bearer|api.?key)/i.test(key);
          results.push({ store: storeName, key: sensitive ? key : key, sensitiveLookingName: sensitive });
        }
      } catch (e) {
        results.push({ store: storeName, key: "(unavailable)", sensitiveLookingName: false, error: true });
      }
    }
    return results;
  }

  function row(title, detail, tag, warn) {
    const el = document.createElement("div");
    el.className = "row";
    const main = document.createElement("div");
    main.className = "main";
    const titleEl = document.createElement("div");
    titleEl.textContent = title;
    main.appendChild(titleEl);
    if (detail) {
      const sub = document.createElement("div");
      sub.className = "sub";
      sub.textContent = detail;
      main.appendChild(sub);
    }
    el.appendChild(main);
    if (tag) {
      const badge = document.createElement("span");
      badge.className = "tag" + (warn ? " warn" : "");
      badge.textContent = tag;
      el.appendChild(badge);
    }
    return el;
  }

  function renderEndpoints() {
    const pane = $("#endpoints");
    pane.replaceChildren();
    const note = document.createElement("div");
    note.className = "note";
    note.textContent = "Observed network URLs and API-looking references in the current document. Query values with sensitive parameter names are redacted. This scan does not issue requests.";
    pane.appendChild(note);
    const heading = document.createElement("div");
    heading.className = "sectionTitle";
    heading.textContent = "Endpoint candidates (" + report.endpoints.length + ")";
    pane.appendChild(heading);
    if (!report.endpoints.length) {
      const empty = document.createElement("div");
      empty.className = "empty";
      empty.textContent = "No API-like endpoints detected. Try using the page normally, then scan again.";
      pane.appendChild(empty);
      return;
    }
    for (const item of report.endpoints) {
      pane.appendChild(row(item.url, "Observed as: " + item.source, item.origin, false));
    }
  }

  function renderExposure() {
    const pane = $("#exposure");
    pane.replaceChildren();
    const note = document.createElement("div");
    note.className = "note";
    note.innerHTML = "<strong>Safe exposure check.</strong> Searches embedded inline scripts and meta fields for common secret-shaped patterns. It never displays or exports matched values and does not fetch external scripts.";
    pane.appendChild(note);
    for (const item of report.exposureChecks) {
      pane.appendChild(row(item.label, item.note + (item.locations.length ? " Sources: " + item.locations.join(", ") : ""), item.sourceCount ? item.sourceCount + " source(s)" : "no match", item.sourceCount > 0));
    }
  }

  function renderStorage() {
    const pane = $("#storage");
    pane.replaceChildren();
    const note = document.createElement("div");
    note.className = "note";
    note.textContent = "Only storage key names are listed. The scanner does not read storage values, cookies, IndexedDB, or authorization headers.";
    pane.appendChild(note);
    if (!report.storageKeys.length) {
      const empty = document.createElement("div");
      empty.className = "empty";
      empty.textContent = "No localStorage/sessionStorage keys found, or storage is blocked.";
      pane.appendChild(empty);
      return;
    }
    for (const item of report.storageKeys) {
      pane.appendChild(row(item.key, item.store, item.error ? "unavailable" : item.sensitiveLookingName ? "review key name" : "key only", item.sensitiveLookingName));
    }
  }

  function render() {
    renderEndpoints();
    renderExposure();
    renderStorage();
    const findings = report.exposureChecks.filter((x) => x.sourceCount > 0).length;
    $("#counts").textContent = report.endpoints.length + " endpoints · " + findings + " possible exposure categories";
  }

  function runScan() {
    try {
      setStatus("Scanning already-loaded page data locally…", false);
      report = {
        pageOrigin: location.origin,
        scannedAt: new Date().toISOString(),
        endpoints: scanEndpointSources(),
        exposureChecks: scanExposures(),
        storageKeys: scanStorageKeys(),
        privacy: "Local-only scan; no requests sent; matched secret values, storage values, cookies, and authorization headers are not collected."
      };
      render();
      setStatus("Scan complete for " + location.origin + ". Review potential matches manually; pattern matches can be false positives.", false);
    } catch (error) {
      setStatus("Scan stopped: " + String(error && error.message || error), true);
    }
  }

  for (const tab of tabs) tab.addEventListener("click", () => {
    for (const button of tabs) button.classList.toggle("active", button === tab);
    for (const name of ["endpoints", "exposure", "storage"]) $("#" + name).classList.toggle("hidden", name !== tab.dataset.tab);
  });
  $("#scan").addEventListener("click", runScan);
  $("#close").addEventListener("click", () => host.remove());
  $("#copy").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(report, null, 2));
      setStatus("Sanitized report copied to clipboard.", false);
    } catch {
      setStatus("Clipboard access was blocked. Use EXPORT JSON instead.", true);
    }
  });
  $("#export").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "server-trace-safe-report.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus("Sanitized JSON report exported.", false);
  });

  let drag = null;
  $("#drag").addEventListener("pointerdown", (event) => {
    if (event.target.closest("button")) return;
    const rect = host.getBoundingClientRect();
    drag = { x: event.clientX, y: event.clientY, left: rect.left, top: rect.top };
    $("#drag").setPointerCapture(event.pointerId);
  });
  $("#drag").addEventListener("pointermove", (event) => {
    if (!drag) return;
    host.style.left = Math.max(0, Math.min(innerWidth - 140, drag.left + event.clientX - drag.x)) + "px";
    host.style.top = Math.max(0, Math.min(innerHeight - 48, drag.top + event.clientY - drag.y)) + "px";
    host.style.right = "auto";
  });
  $("#drag").addEventListener("pointerup", () => { drag = null; });
  $("#drag").addEventListener("pointercancel", () => { drag = null; });

  document.documentElement.appendChild(host);
  runScan();
  console.info("Server Trace / Local Audit injected. No network requests were sent.");
})();