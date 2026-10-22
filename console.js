(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const state = {
    endpoints: [],
    schema: null,
    history: [],
    activeController: null,
    responseText: "",
    responseHeaderText: "",
    responseBlobType: "text/plain"
  };
  const METHODS = new Set(["GET","POST","PUT","PATCH","DELETE","HEAD","OPTIONS"]);
  const METHOD_ORDER = ["get","post","put","patch","delete","head","options"];
  const METHOD_CLASS = method => "method-" + String(method).toLowerCase();

  function createKvRow(container, key = "", value = "") {
    const row = document.createElement("div");
    row.className = "kv-row";
    const keyInput = document.createElement("input");
    keyInput.type = "text";
    keyInput.placeholder = "Key";
    keyInput.value = key;
    keyInput.spellcheck = false;
    const valueInput = document.createElement("input");
    valueInput.type = "text";
    valueInput.placeholder = "Value";
    valueInput.value = value;
    valueInput.spellcheck = false;
    const remove = document.createElement("button");
    remove.className = "remove-row";
    remove.type = "button";
    remove.textContent = "×";
    remove.setAttribute("aria-label", "Remove row");
    remove.addEventListener("click", () => {
      row.remove();
      updateBadges();
    });
    keyInput.addEventListener("input", updateBadges);
    valueInput.addEventListener("input", updateBadges);
    row.append(keyInput, valueInput, remove);
    container.appendChild(row);
    updateBadges();
    return row;
  }

  function readRows(container) {
    return [...container.querySelectorAll(".kv-row")].map(row => {
      const inputs = row.querySelectorAll("input");
      return [inputs[0].value.trim(), inputs[1].value];
    }).filter(([key]) => key);
  }

  function rowsFromObject(container, object) {
    container.replaceChildren();
    for (const [key, value] of Object.entries(object || {})) {
      createKvRow(container, key, typeof value === "string" ? value : JSON.stringify(value));
    }
    if (!container.children.length) createKvRow(container);
    updateBadges();
  }

  function updateBadges() {
    $("paramBadge").textContent = readRows($("queryRows")).length;
    $("headerBadge").textContent = readRows($("headerRows")).length;
    $("pathvarBadge").textContent = [...$("path").value.matchAll(/\{([^}]+)\}/g)].length;
  }

  function requestTab(name) {
    document.querySelectorAll("[data-request-tab]").forEach(button => button.classList.toggle("active", button.dataset.requestTab === name));
    ["params","pathvars","headers","body"].forEach(tab => $("tab-" + tab).hidden = tab !== name);
  }

  function responseTab(name) {
    document.querySelectorAll("[data-response-tab]").forEach(button => button.classList.toggle("active", button.dataset.responseTab === name));
    $("responseBodyView").hidden = name !== "body";
    $("responseHeadersView").hidden = name !== "headers";
  }

  function setConnection(message, error = false) {
    $("connectionStatus").replaceChildren();
    const dot = document.createElement("span");
    dot.className = "status-dot" + (error ? " muted-dot" : "");
    const text = document.createElement("span");
    text.textContent = message;
    $("connectionStatus").append(dot, text);
  }

  function prettyText(text, contentType = "") {
    if (!text) return "";
    if (/json/i.test(contentType) || /^[\s]*[\[{]/.test(text)) {
      try { return JSON.stringify(JSON.parse(text), null, 2); } catch {}
    }
    return text;
  }

  function setResponseBody(text, contentType = "") {
    state.responseText = text;
    state.responseBlobType = contentType || "text/plain";
    $("responseBody").textContent = prettyText(text, contentType) || "(empty response)";
    $("copyResponse").disabled = !text;
    $("downloadResponse").disabled = !text;
    $("responseSize").textContent = formatBytes(new TextEncoder().encode(text).length);
  }

  function formatBytes(value) {
    if (value < 1024) return value + " B";
    if (value < 1024 * 1024) return (value / 1024).toFixed(1) + " KB";
    return (value / 1024 / 1024).toFixed(2) + " MB";
  }

  function setResponseStatus(label, kind = "") {
    const el = $("responseStatus");
    el.textContent = label;
    el.className = "response-status" + (kind ? " " + kind : "");
  }

  function buildUrl() {
    const base = $("baseUrl").value.trim();
    let path = $("path").value.trim();
    if (!base) throw new Error("Enter a Server Base URL first.");
    if (!path) path = "/";
    const pathVars = {};
    for (const row of $("pathRows").querySelectorAll(".kv-row")) {
      const inputs = row.querySelectorAll("input");
      if (inputs[0].value.trim()) pathVars[inputs[0].value.trim()] = inputs[1].value;
    }
    path = path.replace(/\{([^}]+)\}/g, (match, key) => {
      if (!(key in pathVars)) throw new Error("Missing path variable: " + key);
      return encodeURIComponent(pathVars[key]);
    });
    const baseUrl = new URL(base);
    if (!["http:", "https:"].includes(baseUrl.protocol)) throw new Error("Only HTTP and HTTPS URLs are supported.");
    while (path.startsWith("/")) path = path.slice(1);
    const result = new URL(path, baseUrl.href.endsWith("/") ? baseUrl.href : baseUrl.href + "/");
    for (const [key,value] of readRows($("queryRows"))) result.searchParams.append(key, value);
    if (result.username || result.password) throw new Error("Credentials in the URL are not supported. Use an Authorization header.");
    return result;
  }

  function currentRequestSummary(urlText = "") {
    return { method: $("method").value, path: $("path").value.trim() || "/", url: urlText };
  }

  function buildHeaders(method) {
    const headers = new Headers();
    for (const [key,value] of readRows($("headerRows"))) {
      if (["GET","HEAD"].includes(method) && key.toLowerCase() === "content-type") continue;
      try { headers.append(key, value); }
      catch { throw new Error("Invalid header name or value: " + key); }
    }
    const type = $("bodyType").value;
    if (!["GET","HEAD"].includes(method) && !headers.has("Content-Type")) {
      if (type === "json") headers.set("Content-Type", "application/json");
      if (type === "form") headers.set("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
      if (type === "text") headers.set("Content-Type", "text/plain;charset=UTF-8");
    }
    return headers;
  }

  function buildBody(headers, method) {
    if (["GET","HEAD"].includes(method)) return undefined;
    const raw = $("requestBody").value;
    if (!raw.trim()) return undefined;
    if ($("bodyType").value === "json") {
      try { JSON.parse(raw); }
      catch { throw new Error("Request body is not valid JSON."); }
      if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
      return raw;
    }
    if ($("bodyType").value === "form") {
      if (!headers.has("Content-Type")) headers.set("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
      return raw;
    }
    return raw;
  }

  function renderResponseHeaders(headers) {
    const lines = [];
    headers.forEach((value, key) => lines.push(key + ": " + value));
    lines.sort((a,b) => a.localeCompare(b));
    state.responseHeaderText = lines.join("\n");
    $("responseHeaders").textContent = state.responseHeaderText || "(no exposed response headers)";
  }

  function addHistory(item) {
    state.history.unshift(item);
    if (state.history.length > 30) state.history.pop();
    renderHistory();
  }

  function renderHistory() {
    const list = $("historyList");
    list.replaceChildren();
    if (!state.history.length) {
      const empty = document.createElement("div");
      empty.className = "muted small history-empty";
      empty.textContent = "Requests made this session appear here.";
      list.appendChild(empty);
      return;
    }
    for (const item of state.history) {
      const button = document.createElement("button");
      button.className = "history-item";
      button.type = "button";
      const badge = document.createElement("span");
      badge.className = "method-badge " + METHOD_CLASS(item.method);
      badge.textContent = item.method;
      const label = document.createElement("span");
      label.className = "history-label";
      label.textContent = item.path;
      button.append(badge, label);
      button.title = item.url;
      button.addEventListener("click", () => {
        $("method").value = item.method;
        $("path").value = item.path;
        syncPathRows();
        requestTab("params");
      });
      list.appendChild(button);
    }
  }

  async function sendRequest() {
    if (state.activeController) return;
    let url;
    try {
      url = buildUrl();
    } catch (error) {
      setConnection(error.message, true);
      setResponseStatus("REQUEST INVALID", "error");
      $("responseSummary").textContent = error.message;
      $("responseBody").textContent = error.message;
      responseTab("body");
      return;
    }

    const method = $("method").value;
    let headers, body;
    try {
      headers = buildHeaders(method);
      body = buildBody(headers, method);
    } catch (error) {
      setConnection(error.message, true);
      setResponseStatus("REQUEST INVALID", "error");
      $("responseSummary").textContent = error.message;
      $("responseBody").textContent = error.message;
      responseTab("body");
      return;
    }

    const controller = new AbortController();
    state.activeController = controller;
    const timeout = setTimeout(() => controller.abort(new DOMException("Request timed out after 45 seconds.", "TimeoutError")), 45000);
    $("sendRequest").disabled = true;
    $("cancelRequest").disabled = false;
    $("requestNote").textContent = "Sending request…";
    $("responseSummary").textContent = method + " " + url.href;
    setConnection("Request in progress");
    setResponseStatus("PENDING");
    $("responseDuration").textContent = "—";
    setResponseBody("", "");
    $("responseHeaders").textContent = "(waiting for headers)";
    responseTab("body");

    const started = performance.now();
    try {
      const response = await fetch(url.href, {
        method,
        headers,
        body,
        credentials: $("credentials").value,
        cache: "no-store",
        redirect: "follow",
        signal: controller.signal
      });
      const text = method === "HEAD" ? "" : await response.text();
      const elapsed = performance.now() - started;
      setResponseStatus(response.status + " " + response.statusText, response.ok ? "ok" : response.status < 400 ? "redirect" : "error");
      $("responseDuration").textContent = elapsed.toFixed(0) + " ms";
      $("responseSummary").textContent = method + " " + url.href;
      setResponseBody(text, response.headers.get("content-type") || "");
      renderResponseHeaders(response.headers);
      $("requestNote").textContent = "Completed in " + elapsed.toFixed(0) + " ms.";
      setConnection("Response received");
      addHistory({method, path: $("path").value.trim() || "/", url: url.href, status: response.status, elapsed});
    } catch (error) {
      const elapsed = performance.now() - started;
      const message = error.name === "AbortError" || error.name === "TimeoutError"
        ? "Request was cancelled or timed out."
        : "Network request failed. Check the URL, server availability and CORS policy. Details: " + error.message;
      setResponseStatus(error.name === "AbortError" ? "CANCELLED" : "NETWORK ERROR", "error");
      $("responseDuration").textContent = elapsed.toFixed(0) + " ms";
      $("responseSummary").textContent = method + " " + url.href;
      setResponseBody(message, "text/plain");
      $("responseHeaders").textContent = "(response headers unavailable)";
      $("requestNote").textContent = message;
      setConnection(error.name === "AbortError" ? "Request cancelled" : "Network / CORS error", true);
    } finally {
      clearTimeout(timeout);
      state.activeController = null;
      $("sendRequest").disabled = false;
      $("cancelRequest").disabled = true;
    }
  }

  function syncPathRows() {
    const old = new Map();
    for (const row of $("pathRows").querySelectorAll(".kv-row")) {
      const inputs = row.querySelectorAll("input");
      if (inputs[0].value) old.set(inputs[0].value, inputs[1].value);
    }
    const names = [...$("path").value.matchAll(/\{([^}]+)\}/g)].map(match => match[1]);
    $("pathRows").replaceChildren();
    for (const name of names) createKvRow($("pathRows"), name, old.get(name) || "");
    if (!names.length) {
      const note = document.createElement("div");
      note.className = "muted small";
      note.textContent = "No {pathVariables} detected in the request path.";
      $("pathRows").appendChild(note);
    }
    updateBadges();
  }

  function renderEndpoints() {
    const container = $("endpointGroups");
    const filter = $("endpointSearch").value.trim().toLowerCase();
    container.replaceChildren();
    const filtered = state.endpoints.filter(endpoint =>
      (endpoint.path + " " + endpoint.summary + " " + endpoint.method + " " + endpoint.tag).toLowerCase().includes(filter)
    );
    $("endpointCount").textContent = String(state.endpoints.length);
    if (!state.endpoints.length) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      empty.innerHTML = '<div class="empty-symbol">⌘</div><div class="empty-title">No API schema</div><p>Load an OpenAPI / Swagger JSON document to browse endpoints, or create a request manually.</p>';
      const button = document.createElement("button");
      button.className = "text-button";
      button.textContent = "Import schema →";
      button.addEventListener("click", openSpecDrawer);
      empty.appendChild(button);
      container.appendChild(empty);
      return;
    }
    if (!filtered.length) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      empty.textContent = "No endpoints match this filter.";
      container.appendChild(empty);
      return;
    }
    const groups = new Map();
    for (const endpoint of filtered) {
      const tag = endpoint.tag || "DEFAULT";
      if (!groups.has(tag)) groups.set(tag, []);
      groups.get(tag).push(endpoint);
    }
    for (const [tag, endpoints] of groups) {
      const label = document.createElement("div");
      label.className = "endpoint-group-label";
      label.textContent = tag + " · " + endpoints.length;
      container.appendChild(label);
      for (const endpoint of endpoints) {
        const button = document.createElement("button");
        button.className = "endpoint-item";
        button.type = "button";
        const badge = document.createElement("span");
        badge.className = "method-badge " + METHOD_CLASS(endpoint.method);
        badge.textContent = endpoint.method;
        const texts = document.createElement("span");
        texts.className = "endpoint-text";
        const path = document.createElement("span");
        path.className = "endpoint-path";
        path.textContent = endpoint.path;
        const summary = document.createElement("span");
        summary.className = "endpoint-summary";
        summary.textContent = endpoint.summary || endpoint.operationId || "";
        texts.append(path, summary);
        button.append(badge, texts);
        button.title = endpoint.path;
        button.addEventListener("click", () => {
          $("method").value = endpoint.method;
          $("path").value = endpoint.path;
          if (endpoint.server) $("baseUrl").value = endpoint.server;
          syncPathRows();
          rowsFromObject($("queryRows"), {});
          if (endpoint.parameters?.length) {
            const query = {};
            for (const param of endpoint.parameters) {
              if (param.in === "query") query[param.name] = param.example ?? param.schema?.default ?? "";
            }
            rowsFromObject($("queryRows"), query);
          }
          button.blur();
          container.querySelectorAll(".endpoint-item").forEach(item => item.classList.toggle("selected", item === button));
          requestTab(endpoint.parameters?.some(p => p.in === "path") ? "pathvars" : "params");
        });
        container.appendChild(button);
      }
    }
  }

  function parseOpenApi(documentObject) {
    if (!documentObject || typeof documentObject !== "object" || !documentObject.paths || typeof documentObject.paths !== "object") {
      throw new Error("This JSON does not look like an OpenAPI / Swagger document (missing paths).");
    }
    let serverUrl = documentObject.servers?.[0]?.url
      || documentObject.host && ((documentObject.schemes?.[0] || "https") + "://" + documentObject.host + (documentObject.basePath || ""))
      || "";
    if (serverUrl && !/^https?:\/\//i.test(serverUrl)) {
      try { serverUrl = new URL(serverUrl, location.origin).href; } catch {}
    }
    const endpoints = [];
    for (const [path, pathItem] of Object.entries(documentObject.paths)) {
      if (!pathItem || typeof pathItem !== "object") continue;
      const sharedParams = Array.isArray(pathItem.parameters) ? pathItem.parameters : [];
      for (const method of METHOD_ORDER) {
        const operation = pathItem[method];
        if (!operation || typeof operation !== "object") continue;
        const mergedParams = [...sharedParams, ...(Array.isArray(operation.parameters) ? operation.parameters : [])];
        endpoints.push({
          method: method.toUpperCase(),
          path,
          summary: operation.summary || operation.description?.split(/\n/)[0] || "",
          operationId: operation.operationId || "",
          tag: operation.tags?.[0] || "DEFAULT",
          server: operation.servers?.[0]?.url || serverUrl,
          parameters: mergedParams
        });
      }
    }
    state.schema = documentObject;
    state.endpoints = endpoints.sort((a,b) => a.tag.localeCompare(b.tag) || a.path.localeCompare(b.path) || METHOD_ORDER.indexOf(a.method.toLowerCase()) - METHOD_ORDER.indexOf(b.method.toLowerCase()));
    if (serverUrl && !state.endpoints.length) $("baseUrl").value = serverUrl;
    if (serverUrl && !$("baseUrl").value.trim()) $("baseUrl").value = serverUrl;
    $("specStatus").textContent = "Loaded " + endpoints.length + " endpoints" + (documentObject.info?.title ? " from " + documentObject.info.title : "") + ".";
    setConnection("OpenAPI schema loaded");
    renderEndpoints();
    setResponseStatus("SPEC LOADED", "ok");
    $("responseSummary").textContent = $("specStatus").textContent;
    $("responseBody").textContent = JSON.stringify({title: documentObject.info?.title || "", version: documentObject.info?.version || "", endpointCount: endpoints.length}, null, 2);
    return endpoints.length;
  }

  async function loadSpecFromUrl() {
    const url = $("specUrl").value.trim();
    if (!url) {
      $("specStatus").textContent = "Enter an OpenAPI JSON URL.";
      return;
    }
    $("specStatus").textContent = "Loading spec…";
    try {
      const response = await fetch(url, {cache:"no-store"});
      if (!response.ok) throw new Error("HTTP " + response.status + " while loading spec.");
      const text = await response.text();
      $("specText").value = text;
      parseOpenApi(JSON.parse(text));
    } catch (error) {
      $("specStatus").textContent = "Could not load spec: " + error.message + ". Try importing a local JSON file or pasting JSON.";
      setConnection("Spec import failed", true);
    }
  }

  function openSpecDrawer() {
    $("specDrawer").hidden = false;
    $("specText").focus();
  }

  $("toggleSpec").addEventListener("click", () => $("specDrawer").hidden = !$("specDrawer").hidden);
  $("closeSpec").addEventListener("click", () => $("specDrawer").hidden = true);
  $("loadSpecUrl").addEventListener("click", loadSpecFromUrl);
  $("parseSpec").addEventListener("click", () => {
    try { parseOpenApi(JSON.parse($("specText").value)); }
    catch(error) { $("specStatus").textContent = "Spec parse error: " + error.message; }
  });
  $("chooseSpecFile").addEventListener("click", () => $("specFile").click());
  $("specFile").addEventListener("change", async event => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      $("specText").value = text;
      parseOpenApi(JSON.parse(text));
      $("specDrawer").hidden = true;
    } catch(error) {
      $("specStatus").textContent = "Import failed: " + error.message + ". JSON files are supported; convert YAML to JSON first.";
      $("specDrawer").hidden = false;
    } finally {
      event.target.value = "";
    }
  });

  $("addQuery").addEventListener("click", () => createKvRow($("queryRows")));
  $("addHeader").addEventListener("click", () => createKvRow($("headerRows")));
  $("sendRequest").addEventListener("click", sendRequest);
  $("cancelRequest").addEventListener("click", () => {
    if (state.activeController) state.activeController.abort();
  });
  $("path").addEventListener("input", () => { syncPathRows(); });
  $("endpointSearch").addEventListener("input", renderEndpoints);
  $("clearHistory").addEventListener("click", () => { state.history = []; renderHistory(); });
  document.querySelectorAll("[data-request-tab]").forEach(button => button.addEventListener("click", () => requestTab(button.dataset.requestTab)));
  document.querySelectorAll("[data-response-tab]").forEach(button => button.addEventListener("click", () => responseTab(button.dataset.responseTab)));

  $("copyResponse").addEventListener("click", async () => {
    const text = state.responseText;
    try {
      await navigator.clipboard.writeText(text);
      $("copyResponse").textContent = "COPIED";
      setTimeout(() => $("copyResponse").textContent = "COPY", 900);
    } catch {
      setConnection("Clipboard permission denied", true);
    }
  });

  $("downloadResponse").addEventListener("click", () => {
    const blob = new Blob([state.responseText], {type: state.responseBlobType || "text/plain"});
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "api-response-" + new Date().toISOString().replace(/[:.]/g,"-") + ".txt";
    link.click();
    URL.revokeObjectURL(url);
  });

  document.addEventListener("keydown", event => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      sendRequest();
    }
    if (event.key === "/" && !["INPUT","TEXTAREA","SELECT"].includes(document.activeElement?.tagName)) {
      event.preventDefault();
      $("endpointSearch").focus();
    }
    if (event.key === "Escape" && state.activeController) state.activeController.abort();
  });

  $("method").addEventListener("change", () => {
    const method = $("method").value;
    $("requestBody").placeholder = method === "GET" || method === "HEAD" ? "Body is not sent for this method" : '{\n  "example": true\n}';
  });

  $("bodyType").addEventListener("change", () => {
    const builtInTypes = new Set([
      "application/json",
      "application/x-www-form-urlencoded;charset=utf-8",
      "text/plain;charset=utf-8"
    ]);
    const row = [...$("headerRows").querySelectorAll(".kv-row")]
      .find(item => item.querySelectorAll("input")[0].value.trim().toLowerCase() === "content-type");
    if (!row) return;
    const valueInput = row.querySelectorAll("input")[1];
    if (!builtInTypes.has(valueInput.value.trim().toLowerCase())) return;
    const types = {
      json: "application/json",
      form: "application/x-www-form-urlencoded;charset=UTF-8",
      text: "text/plain;charset=UTF-8"
    };
    valueInput.value = types[$("bodyType").value];
  });

  createKvRow($("headerRows"), "Content-Type", "application/json");
  createKvRow($("queryRows"));
  syncPathRows();
  updateBadges();
  renderEndpoints();
  setConnection("Ready");
})();