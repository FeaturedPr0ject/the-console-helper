(() => {
  "use strict";
  const ID = "the-console-helper-api-console";
  const EXISTING = document.getElementById(ID);
  if (EXISTING) {
    EXISTING.remove();
    if (window.__THE_CONSOLE_HELPER_API_CONSOLE) delete window.__THE_CONSOLE_HELPER_API_CONSOLE;
    console.info("API Console closed.");
    return;
  }

  const host = document.createElement("div");
  host.id = ID;
  host.style.cssText = "all:initial;position:fixed;left:16px;top:16px;z-index:2147483647;width:calc(100vw - 32px);max-width:1180px;height:calc(100vh - 32px);max-height:900px;pointer-events:none;";
  const shadow = host.attachShadow({ mode: "open" });
  document.documentElement.appendChild(host);

  const css = [
    ":host{all:initial;color-scheme:dark;font:12px/1.45 Inter,'Segoe UI',Arial,sans-serif;color:#e2e3e7}",
    "*,*::before,*::after{box-sizing:border-box;border-radius:0!important}",
    "button,input,select,textarea{font:inherit;color:inherit}button{cursor:pointer}button:disabled{opacity:.38;cursor:not-allowed}",
    "input,select,textarea{min-width:0;border:1px solid #484a50;background:#1e1f22;color:#e2e3e7;outline:none}input:focus,select:focus,textarea:focus{border-color:#aeb1ba;box-shadow:inset 0 -1px #aeb1ba}input::placeholder,textarea::placeholder{color:#73757c}button:focus-visible{outline:1px solid #c7c9d0;outline-offset:1px}",
    ".app{width:100%;height:100%;min-height:0;display:flex;flex-direction:column;overflow:hidden;background:#222326;border:1px solid #55575d;box-shadow:0 16px 65px #0008;pointer-events:auto}",
    ".app.minimized .serverbar,.app.minimized .scan-panel,.app.minimized .layout{display:none}.app.minimized{height:54px!important}",
    ".topbar{height:54px;flex:0 0 54px;display:flex;align-items:center;gap:12px;padding:0 14px;background:#292a2e;border-bottom:1px solid #45474d;cursor:move;user-select:none;touch-action:none}",
    ".brand-mark{width:29px;height:29px;display:grid;place-items:center;border:1px solid #61636a;background:#3a3b40;color:#eee;font:700 10px ui-monospace,Consolas,monospace}",
    ".brand-title{font-size:11px;font-weight:800;letter-spacing:.12em}.brand-sub{margin-top:2px;color:#94969e;font-size:9px;letter-spacing:.12em}.spacer{flex:1}",
    ".top-actions{display:flex;align-items:center;gap:6px}.micro-status{display:flex;align-items:center;gap:6px;color:#a7a9b0;font:9px ui-monospace,Consolas,monospace}.dot{width:6px;height:6px;background:#7ec7a6;display:inline-block}.dot.off{background:#d1ad6a}",
    ".btn{height:30px;padding:0 10px;border:1px solid #505259;background:#34353a;color:#daddE3;font-size:9px;font-weight:700;letter-spacing:.045em;white-space:nowrap}.btn:hover:not(:disabled){background:#414249;border-color:#686a72}.btn-primary{background:#c4c6cd;border-color:#c4c6cd;color:#1e1f22}.btn-primary:hover:not(:disabled){background:#e0e1e5}.btn-quiet{background:transparent;border-color:transparent;color:#b9bbc2}.btn-danger{color:#e2a0a0;border-color:#684448;background:#3a2a2d}",
    ".serverbar{display:grid;grid-template-columns:minmax(200px,1fr) minmax(240px,1.35fr) auto auto auto;gap:7px;align-items:end;padding:10px 12px;background:#292a2e;border-bottom:1px solid #45474d}",
    ".scan-panel{padding:8px 12px;background:#242529;border-bottom:1px solid #45474d;display:flex;flex-direction:column;gap:6px}",
    ".scan-top{display:flex;align-items:center;gap:10px;min-width:0}.scan-status{flex:1;min-width:0;color:#b2b4bc;font:10px ui-monospace,Consolas,monospace;overflow-wrap:anywhere}.scan-tools{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.scan-deep{display:flex;align-items:center;gap:5px;color:#b6b8c0;font:9px ui-monospace,Consolas,monospace;white-space:nowrap}.scan-deep input{accent-color:#bfc2cb}",
    ".progress-track{height:4px;overflow:hidden;background:#3b3d42;border:1px solid #4a4c52}.progress-fill{width:0;height:100%;background:linear-gradient(90deg,#9ca2ad,#e0e2e6);transition:width .12s linear}.scan-detail{display:flex;align-items:center;justify-content:space-between;gap:8px;color:#898c95;font-size:9px}.server-results{display:flex;gap:5px;flex-wrap:wrap}.server-chip{border:1px solid #505259;background:#303136;color:#c5c7ce;padding:4px 7px;font:9px ui-monospace,Consolas,monospace;max-width:100%;overflow-wrap:anywhere}.server-chip:hover{background:#414249}.server-chip.selected{background:#c4c6cd;color:#1e1f22;border-color:#c4c6cd}",
    ".scan-panel[hidden]{display:none!important}",
    ".field{display:flex;flex-direction:column;gap:5px;min-width:0}.field label,.eyebrow{font:9px ui-monospace,Consolas,monospace;letter-spacing:.09em;color:#989aa2}.field input,.field select{width:100%;height:30px;padding:0 8px;font:10px ui-monospace,Consolas,monospace}",
    ".spec-drawer{padding:10px 12px;background:#26272b;border-bottom:1px solid #45474d}.spec-drawer[hidden],.pane[hidden],.request-content[hidden],.response-view[hidden]{display:none!important}.spec-top{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px}.spec-help{color:#a2a4ac;font-size:10px}.spec-input{width:100%;padding:8px;font:10px/1.5 ui-monospace,Consolas,monospace;resize:vertical}.spec-bottom{display:flex;align-items:center;gap:8px;margin-top:7px}.spec-msg{flex:1;color:#a5a7af;font-size:10px}",
    ".layout{display:grid;grid-template-columns:250px minmax(0,1fr);flex:1;min-height:0}",
    ".sidebar{display:flex;flex-direction:column;min-height:0;background:#26272b;border-right:1px solid #45474d}.side-head{display:flex;align-items:center;justify-content:space-between;padding:12px 11px 9px}.section-title{font-size:9px;font-weight:800;letter-spacing:.12em}.count{padding:2px 5px;color:#bfc1c7;background:#3c3d43;font:9px ui-monospace,Consolas,monospace}",
    ".search{display:flex;gap:6px;padding:0 9px 9px}.search input{width:100%;height:29px;padding:0 8px;font-size:10px}.endpoint-list{overflow:auto;flex:1;min-height:80px;padding:0 6px 8px}.empty{padding:18px 8px;color:#92949d;font-size:10px;line-height:1.6}.group-label{padding:11px 6px 5px;color:#878991;font:9px ui-monospace,Consolas,monospace;letter-spacing:.1em;text-transform:uppercase}.endpoint{display:flex;width:100%;align-items:flex-start;gap:7px;padding:7px 6px;border:0;border-left:2px solid transparent;background:transparent;text-align:left}.endpoint:hover{background:#333439}.endpoint.selected{background:#393a40;border-left-color:#c2c4cb}.method{width:43px;flex:0 0 43px;padding:3px 2px;background:#37383e;text-align:center;font:700 9px ui-monospace,Consolas,monospace;color:#c7c9d0}.m-get{color:#8bc9a9}.m-post{color:#d4bd80}.m-put,.m-patch{color:#98bae3}.m-delete{color:#e49b9b}.ep-path{display:block;overflow-wrap:anywhere;font:10px/1.45 ui-monospace,Consolas,monospace;color:#dbdce1}.ep-summary{display:block;margin-top:2px;color:#898b94;font-size:9px;line-height:1.4}.history{max-height:155px;overflow:auto;border-top:1px solid #45474d}.history-list{padding:0 7px 8px}.history-item{display:flex;width:100%;align-items:center;gap:6px;padding:6px;border:0;background:transparent;text-align:left}.history-item:hover{background:#35363b}.history-path{overflow:hidden;white-space:nowrap;text-overflow:ellipsis;color:#c2c4cc;font:9px ui-monospace,Consolas,monospace}",
    ".work{display:flex;flex-direction:column;min-width:0;min-height:0}.request{padding:13px 14px 11px;border-bottom:1px solid #45474d}.section-line{display:flex;align-items:center;justify-content:space-between;gap:10px}.muted{color:#9698a1;font-size:10px}.request-line{display:grid;grid-template-columns:91px minmax(0,1fr) auto auto;gap:6px;margin-top:11px}.request-line select,.request-line input{height:35px;padding:0 9px}.request-line select{background:#35363b;font:700 10px ui-monospace,Consolas,monospace}.request-line input{font:11px ui-monospace,Consolas,monospace}.request-tabs{display:flex;gap:15px;margin-top:14px;border-bottom:1px solid #3d3f44}.tab{padding:0 0 8px;border:0;border-bottom:2px solid transparent;background:transparent;color:#9698a1;font-size:10px}.tab.active{border-bottom-color:#c6c8ce;color:#edeef1}.tab-badge{margin-left:4px;color:#858791;font:9px ui-monospace,Consolas,monospace}.request-content{padding-top:9px}.table-head,.kv{display:grid;grid-template-columns:minmax(85px,.8fr) minmax(100px,1.2fr) 22px;gap:6px}.table-head{padding:0 3px 6px;color:#83858d;font:9px ui-monospace,Consolas,monospace;letter-spacing:.08em}.kv{margin-bottom:5px}.kv input{height:28px;width:100%;padding:0 7px;font:10px ui-monospace,Consolas,monospace}.remove{border:0;background:transparent;color:#898b93;font-size:15px}.remove:hover{color:#e6a1a1}.add-row{height:24px;padding:0;border:0;background:transparent;color:#c4c6ce;font-size:10px}.body-tools{display:flex;align-items:center;gap:8px;margin-bottom:6px}.body-tools select{height:26px;padding:0 6px;font-size:10px}.body-editor{display:block;width:100%;min-height:85px;padding:8px;font:10px/1.55 ui-monospace,Consolas,monospace;resize:vertical;tab-size:2}.req-options{display:flex;align-items:end;justify-content:space-between;gap:10px;padding-top:9px;margin-top:8px;border-top:1px solid #3b3d42}.req-options .field{width:185px}.req-options select{height:27px;font-size:10px}.req-note{flex:1;text-align:right;color:#93959e;font-size:10px;line-height:1.5}",
    ".response{display:flex;flex:1;flex-direction:column;min-height:190px}.response-head{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:11px 14px 9px;border-bottom:1px solid #3b3d42}.response-tools{display:flex;align-items:center;gap:6px;flex-wrap:wrap}.status-code{padding:4px 6px;border:1px solid #4b4d54;color:#aeb0b9;font:9px ui-monospace,Consolas,monospace}.status-code.ok{color:#83c9a6;border-color:#3e6551;background:#28372f}.status-code.bad{color:#e7a2a2;border-color:#664347;background:#392a2c}.duration{color:#9b9da5;font:9px ui-monospace,Consolas,monospace;white-space:nowrap}.response-tabs{display:flex;gap:15px;padding:9px 14px 0;border-bottom:1px solid #3b3d42}.response-view{flex:1;min-height:140px;overflow:auto;background:#1d1e21}.response-code{margin:0;min-height:140px;padding:12px 14px;white-space:pre-wrap;overflow-wrap:anywhere;tab-size:2;color:#d2d4da;font:10px/1.6 ui-monospace,Consolas,monospace}.placeholder{color:#777982}.statusbar{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:7px 10px;background:#292a2e;border-top:1px solid #45474d;color:#898b93;font:9px ui-monospace,Consolas,monospace}.status-connection{display:flex;align-items:center;gap:6px}",
    "@media(max-width:760px){.layout{grid-template-columns:190px minmax(0,1fr)}.serverbar{grid-template-columns:1fr 1fr}.serverbar .field:first-child{grid-column:1/-1}.request-line{grid-template-columns:77px minmax(0,1fr) auto}.request-line #cancel{grid-column:3}.req-note{display:none}.request{padding:10px}.response-head{align-items:flex-start;flex-direction:column}}",
    "@media(max-width:560px){.layout{grid-template-columns:1fr}.sidebar{max-height:175px;border-right:0;border-bottom:1px solid #45474d}.endpoint-list{max-height:85px}.history{display:none}.topbar{padding:0 8px}.top-actions .micro-status{display:none}.brand-sub{font-size:8px}.serverbar{padding:7px}.request-line{grid-template-columns:72px minmax(0,1fr) auto}.request-line #cancel{grid-column:3}.request-tabs{gap:10px}.tab{font-size:9px}.table-head,.kv{grid-template-columns:minmax(70px,.8fr) minmax(80px,1.2fr) 20px}.response-head{padding:9px}.response-code{padding:9px}}",
    "@media(prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}"
  ].join("\n");

  const markup = [
    "<div class='app' id='app'>",
    "<header class='topbar' id='drag'><div class='brand-mark'>TC</div><div><div class='brand-title'>THE CONSOLE HELPER</div><div class='brand-sub'>API WORKBENCH / DEVTOOLS SNIPPET</div></div><div class='spacer'></div><div class='top-actions'><span class='micro-status'><i class='dot'></i> LOCAL SESSION</span><button class='btn btn-quiet' id='specToggle'>OPENAPI</button><button class='btn btn-quiet' id='min'>MINIMIZE</button><button class='btn btn-quiet' id='close'>CLOSE ×</button></div></header>",
    "<div class='serverbar'><div class='field'><label>SERVER BASE URL</label><input id='baseUrl' type='url' spellcheck='false' placeholder='https://api.example.com'></div><div class='field'><label>OPENAPI SPEC URL</label><input id='specUrl' type='url' spellcheck='false' placeholder='https://api.example.com/openapi.json'></div><button class='btn btn-primary' id='loadSpec'>LOAD SPEC</button><button class='btn' id='discover'>FIND SPEC</button><button class='btn' id='importFile'>IMPORT JSON</button><input id='file' type='file' accept='.json,application/json' hidden></div>",
    "<section class='scan-panel' id='scanPanel'><div class='scan-top'><span class='scan-status' id='scanStatus'>Ready to inspect the current page for observed API servers and endpoints.</span><div class='scan-tools'><label class='scan-deep'><input id='deepScanToggle' type='checkbox'> DEEP SCAN SCRIPTS</label><button class='btn btn-primary' id='scanPage'>SCAN CURRENT PAGE</button><button class='btn' id='cancelScan' disabled>CANCEL</button></div></div><div class='progress-track'><div class='progress-fill' id='scanFill'></div></div><div class='scan-detail'><span id='scanDetail'>Quick scan checks loaded fetch/XHR resources, links and inline scripts. Deep scan reads same-origin scripts when allowed.</span><span id='scanPercent'>0%</span></div><div class='server-results' id='serverResults'></div></section>",
    "<section class='spec-drawer' id='specDrawer' hidden><div class='spec-top'><div><div class='section-title'>OPENAPI / SWAGGER JSON</div><div class='spec-help'>Import a schema to list documented endpoints. YAML is not parsed by this snippet.</div></div><button class='btn btn-quiet' id='closeSpec'>CLOSE ×</button></div><textarea class='spec-input' id='specText' rows='5' spellcheck='false' placeholder='Paste OpenAPI 3.x / Swagger 2.0 JSON here'></textarea><div class='spec-bottom'><span class='spec-msg' id='specMsg'>No schema loaded.</span><button class='btn btn-primary' id='parseSpec'>PARSE JSON</button></div></section>",
    "<div class='layout'><aside class='sidebar'><div class='side-head'><span class='section-title'>API EXPLORER</span><span class='count' id='endpointCount'>0</span></div><div class='search'><input id='endpointSearch' type='search' placeholder='Filter endpoints…'></div><div class='endpoint-list' id='endpointList'><div class='empty'>No API schema loaded.<br>Click OPENAPI or FIND SPEC.</div></div><div class='history'><div class='side-head'><span class='section-title'>REQUEST HISTORY</span><button class='btn btn-quiet' id='clearHistory'>CLEAR</button></div><div class='history-list' id='historyList'><div class='empty'>Requests appear here for this session.</div></div></div></aside>",
    "<main class='work'><section class='request'><div class='section-line'><div><div class='section-title'>REQUEST BUILDER</div><div class='muted'>Compose an HTTP request to the selected server.</div></div><span class='muted'>Ctrl + Enter · SEND</span></div>",
    "<div class='request-line'><select id='method' aria-label='HTTP method'><option>GET</option><option>POST</option><option>PUT</option><option>PATCH</option><option>DELETE</option><option>HEAD</option><option>OPTIONS</option></select><input id='path' spellcheck='false' placeholder='/v1/resource or /users/{userId}' aria-label='Request path'><button class='btn btn-primary' id='send'>SEND ▶</button><button class='btn btn-danger' id='cancel' disabled>CANCEL</button></div>",
    "<div class='request-tabs'><button class='tab active' data-rtab='params'>PARAMS <span class='tab-badge' id='paramCount'>0</span></button><button class='tab' data-rtab='pathvars'>PATH <span class='tab-badge' id='pathCount'>0</span></button><button class='tab' data-rtab='headers'>HEADERS <span class='tab-badge' id='headerCount'>0</span></button><button class='tab' data-rtab='body'>BODY</button></div>",
    "<div class='request-content' id='tab-params'><div class='table-head'><span>KEY</span><span>VALUE</span><span></span></div><div id='queryRows'></div><button class='add-row' id='addQuery'>+ Add query parameter</button></div>",
    "<div class='request-content' id='tab-pathvars' hidden><div class='table-head'><span>PATH VARIABLE</span><span>VALUE</span><span></span></div><div id='pathRows'></div><div class='muted'>Path variables are URL-encoded before sending.</div></div>",
    "<div class='request-content' id='tab-headers' hidden><div class='table-head'><span>HEADER</span><span>VALUE</span><span></span></div><div id='headerRows'></div><button class='add-row' id='addHeader'>+ Add header</button></div>",
    "<div class='request-content' id='tab-body' hidden><div class='body-tools'><span class='eyebrow'>BODY TYPE</span><select id='bodyType'><option value='json'>JSON</option><option value='text'>TEXT</option><option value='form'>URL-ENCODED</option></select><span class='muted'>GET and HEAD do not send a body.</span></div><textarea class='body-editor' id='body' rows='4' spellcheck='false' placeholder='{\"example\":true}'></textarea></div>",
    "<div class='req-options'><div class='field'><label>CREDENTIALS</label><select id='credentials'><option value='same-origin'>Same-origin cookies</option><option value='omit'>Omit cookies</option><option value='include'>Include cookies (CORS)</option></select></div><div class='req-note' id='requestNote'>Ready. Configure base URL and path.</div></div></section>",
    "<section class='response'><div class='response-head'><div><div class='section-title'>RESPONSE</div><div class='muted' id='responseSummary'>Waiting for request</div></div><div class='response-tools'><span class='status-code' id='statusCode'>NO RESPONSE</span><span class='duration' id='duration'>—</span><button class='btn' id='copy' disabled>COPY</button><button class='btn' id='export' disabled>EXPORT</button></div></div>",
    "<div class='response-tabs'><button class='tab active' data-vtab='body'>BODY</button><button class='tab' data-vtab='headers'>HEADERS</button></div><div class='response-view' id='view-body'><pre class='response-code' id='responseBody'><span class='placeholder'>Send a request to inspect its response.</span></pre></div><div class='response-view' id='view-headers' hidden><pre class='response-code' id='responseHeaders'><span class='placeholder'>Response headers will appear here.</span></pre></div></section>",
    "<footer class='statusbar'><span class='status-connection' id='connection'><i class='dot off'></i><span>READY</span></span><span>DIRECT BROWSER REQUEST · CORS APPLIES</span><span id='size'>0 B</span></footer></main></div></div>"
  ].join("");

  shadow.innerHTML = "<style>" + css + "</style>" + markup;
  const $ = id => shadow.getElementById(id);
  const state = { endpoints: [], schemaEndpoints: [], discoveredEndpoints: [], discoveredServers: [], active: null, history: [], response: "", responseType: "text/plain", schema: null, timers: new Set(), scanController: null, scanRunId: 0 };
  const methods = ["get","post","put","patch","delete","head","options"];
  const clamp = (v,a,b) => Math.max(a,Math.min(b,v));

  function status(message, bad = false) {
    $("connection").replaceChildren();
    const dot = document.createElement("i");
    dot.className = "dot" + (bad ? " off" : "");
    const text = document.createElement("span");
    text.textContent = message;
    $("connection").append(dot,text);
  }

  function addRow(container, key = "", value = "") {
    const row = document.createElement("div");
    row.className = "kv";
    const k = document.createElement("input");
    k.placeholder = "Key"; k.value = key; k.spellcheck = false;
    const v = document.createElement("input");
    v.placeholder = "Value"; v.value = value; v.spellcheck = false;
    const remove = document.createElement("button");
    remove.className = "remove"; remove.type = "button"; remove.textContent = "×";
    remove.title = "Remove row";
    remove.addEventListener("click", () => { row.remove(); updateCounts(); });
    k.addEventListener("input", updateCounts);
    v.addEventListener("input", updateCounts);
    row.append(k,v,remove); container.append(row);
    updateCounts();
    return row;
  }

  function readRows(container) {
    return [...container.querySelectorAll(".kv")].map(row => {
      const inputs = row.querySelectorAll("input");
      return [inputs[0].value.trim(),inputs[1].value];
    }).filter(pair => pair[0]);
  }

  function fillRows(container, object) {
    container.replaceChildren();
    for (const [key,value] of Object.entries(object || {})) addRow(container,key,typeof value === "string" ? value : JSON.stringify(value));
    if (!container.children.length) addRow(container);
    updateCounts();
  }

  function updateCounts() {
    $("paramCount").textContent = readRows($("queryRows")).length;
    $("headerCount").textContent = readRows($("headerRows")).length;
    $("pathCount").textContent = [...$("path").value.matchAll(/\{([^}]+)\}/g)].length;
  }

  function showRequestTab(name) {
    shadow.querySelectorAll("[data-rtab]").forEach(b => b.classList.toggle("active",b.dataset.rtab === name));
    ["params","pathvars","headers","body"].forEach(n => $("tab-" + n).hidden = n !== name);
  }

  function showView(name) {
    shadow.querySelectorAll("[data-vtab]").forEach(b => b.classList.toggle("active",b.dataset.vtab === name));
    $("view-body").hidden = name !== "body";
    $("view-headers").hidden = name !== "headers";
  }

  function syncPathRows() {
    const old = new Map(readRows($("pathRows")));
    const names = [...$("path").value.matchAll(/\{([^}]+)\}/g)].map(m => m[1]);
    $("pathRows").replaceChildren();
    for (const name of names) addRow($("pathRows"),name,old.get(name) || "");
    if (!names.length) {
      const note = document.createElement("div");
      note.className = "empty";
      note.textContent = "No {pathVariables} in this path.";
      $("pathRows").append(note);
    }
    updateCounts();
  }

  function makeUrl() {
    let baseText = $("baseUrl").value.trim();
    let path = $("path").value.trim() || "/";
    let fullUrl = null;

    if (/^https?:\/\//i.test(path)) {
      try {
        fullUrl = new URL(path);
      } catch {
        throw new Error("The full URL in PATH is invalid.");
      }
      if (!["http:","https:"].includes(fullUrl.protocol)) throw new Error("Only HTTP and HTTPS URLs are supported.");
      if (fullUrl.username || fullUrl.password) throw new Error("Remove credentials from the URL and use an Authorization header.");
      baseText = fullUrl.origin;
      $("baseUrl").value = baseText;
      path = fullUrl.pathname + fullUrl.search;
      $("path").value = path || "/";
      syncPathRows();
    }

    if (!baseText) {
      if (/^\/\//.test(path)) {
        const parsed = new URL(location.protocol + path);
        baseText = parsed.origin;
        $("baseUrl").value = baseText;
        path = parsed.pathname + parsed.search;
        $("path").value = path || "/";
      } else {
        throw new Error("Enter SERVER BASE URL, or paste the complete https:// URL into PATH.");
      }
    }

    const base = new URL(baseText);
    if (!["http:","https:"].includes(base.protocol)) throw new Error("Only HTTP and HTTPS URLs are supported.");
    if (base.username || base.password) throw new Error("Remove credentials from the URL and use an Authorization header.");

    const vars = Object.fromEntries(readRows($("pathRows")));
    path = path.replace(/\{([^}]+)\}/g, (match,key) => {
      if (!(key in vars)) throw new Error("Missing path variable: " + key);
      return encodeURIComponent(vars[key]);
    });
    while (path.startsWith("/")) path = path.slice(1);
    const url = new URL(path,base.href.endsWith("/") ? base.href : base.href + "/");
    for (const [key,value] of readRows($("queryRows"))) url.searchParams.append(key,value);
    return url;
  }

  function requestHeaders(method) {
    const result = new Headers();
    for (const [key,value] of readRows($("headerRows"))) {
      if (["GET","HEAD"].includes(method) && key.toLowerCase() === "content-type") continue;
      try { result.append(key,value); }
      catch { throw new Error("Invalid header: " + key); }
    }
    if (!["GET","HEAD"].includes(method) && !result.has("Content-Type")) {
      if ($("bodyType").value === "json") result.set("Content-Type","application/json");
      if ($("bodyType").value === "form") result.set("Content-Type","application/x-www-form-urlencoded;charset=UTF-8");
      if ($("bodyType").value === "text") result.set("Content-Type","text/plain;charset=UTF-8");
    }
    return result;
  }

  function requestBody(method, headers) {
    if (["GET","HEAD"].includes(method)) return undefined;
    const body = $("body").value;
    if (!body.trim()) return undefined;
    if ($("bodyType").value === "json") {
      try { JSON.parse(body); } catch { throw new Error("Request body is invalid JSON."); }
      if (!headers.has("Content-Type")) headers.set("Content-Type","application/json");
    }
    return body;
  }

  function formatBody(text,type) {
    if (!text) return "(empty response)";
    if (/json/i.test(type) || /^[\s]*[\[{]/.test(text)) {
      try { return JSON.stringify(JSON.parse(text),null,2); } catch {}
    }
    return text;
  }

  function sizeText(size) {
    if (size < 1024) return size + " B";
    if (size < 1048576) return (size/1024).toFixed(1) + " KB";
    return (size/1048576).toFixed(2) + " MB";
  }

  function setResponse(text,type) {
    state.response = text; state.responseType = type || "text/plain";
    $("responseBody").textContent = formatBody(text,type);
    $("copy").disabled = !text;
    $("export").disabled = !text;
    $("size").textContent = sizeText(new TextEncoder().encode(text).length);
  }

  function historyAdd(item) {
    state.history.unshift(item);
    if (state.history.length > 25) state.history.pop();
    renderHistory();
  }

  function renderHistory() {
    const el = $("historyList"); el.replaceChildren();
    if (!state.history.length) {
      const empty = document.createElement("div"); empty.className = "empty"; empty.textContent = "Requests appear here for this session."; el.append(empty); return;
    }
    for (const item of state.history) {
      const b = document.createElement("button"); b.className = "history-item";
      const badge = document.createElement("span"); badge.className = "method " + ("m-" + item.method.toLowerCase()); badge.textContent = item.method;
      const path = document.createElement("span"); path.className = "history-path"; path.textContent = item.path; path.title = item.url;
      b.append(badge,path);
      b.addEventListener("click",() => { $("method").value=item.method; $("path").value=item.path; syncPathRows(); });
      el.append(b);
    }
  }

  async function send() {
    if (state.active) return;
    let url, headers, body;
    const method = $("method").value;
    try {
      url = makeUrl();
      headers = requestHeaders(method);
      body = requestBody(method,headers);
    } catch (error) {
      $("responseSummary").textContent = error.message;
      $("statusCode").textContent = "INVALID REQUEST";
      $("statusCode").className = "status-code bad";
      $("responseBody").textContent = error.message;
      showView("body"); status("REQUEST INVALID",true); return;
    }

    const controller = new AbortController();
    state.active = controller;
    const timeout = setTimeout(() => controller.abort(),45000);
    $("send").disabled = true; $("cancel").disabled = false;
    $("requestNote").textContent = "Sending request…";
    $("responseSummary").textContent = method + " " + url.href;
    $("statusCode").textContent = "PENDING"; $("statusCode").className = "status-code";
    $("duration").textContent = "—"; $("responseBody").textContent = "Waiting for response…";
    $("responseHeaders").textContent = "Waiting for response headers…";
    showView("body"); status("REQUEST IN PROGRESS");
    const start = performance.now();

    try {
      const response = await fetch(url.href,{
        method,headers,body,credentials:$("credentials").value,cache:"no-store",redirect:"follow",signal:controller.signal
      });
      const text = method === "HEAD" ? "" : await response.text();
      const elapsed = performance.now() - start;
      $("statusCode").textContent = response.status + " " + response.statusText;
      $("statusCode").className = "status-code " + (response.ok ? "ok" : "bad");
      $("duration").textContent = elapsed.toFixed(0) + " ms";
      $("responseSummary").textContent = method + " " + url.href;
      setResponse(text,response.headers.get("content-type") || "");
      const lines=[]; response.headers.forEach((value,key)=>lines.push(key + ": " + value)); lines.sort();
      $("responseHeaders").textContent = lines.join("\n") || "(No response headers exposed to JavaScript by CORS.)";
      $("requestNote").textContent = "Completed in " + elapsed.toFixed(0) + " ms.";
      status("RESPONSE RECEIVED");
      historyAdd({method,path:$("path").value.trim() || "/",url:url.href});
    } catch (error) {
      const elapsed = performance.now() - start;
      const message = error.name === "AbortError"
        ? "Request cancelled or timed out."
        : "Request failed. The server may be offline, CSP may block connect-src, or CORS may not allow this page's origin. Browser restrictions cannot be bypassed by this snippet. Details: " + error.message;
      $("statusCode").textContent = error.name === "AbortError" ? "CANCELLED" : "NETWORK / CORS";
      $("statusCode").className = "status-code bad";
      $("duration").textContent = elapsed.toFixed(0) + " ms";
      $("responseSummary").textContent = method + " " + url.href;
      setResponse(message,"text/plain"); $("responseHeaders").textContent = "(Unavailable)";
      $("requestNote").textContent = message; status("REQUEST FAILED",true);
    } finally {
      clearTimeout(timeout); state.active = null;
      $("send").disabled = false; $("cancel").disabled = true;
    }
  }

  function rebuildEndpointList() {
    const combined = [...state.schemaEndpoints, ...state.discoveredEndpoints];
    const seen = new Set();
    state.endpoints = combined.filter(endpoint => {
      const key = [endpoint.method, endpoint.server || "", endpoint.path].join("|");
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function renderEndpoints() {
    const list = $("endpointList"); list.replaceChildren();
    const query = $("endpointSearch").value.trim().toLowerCase();
    const entries = state.endpoints.filter(e => (e.method+" "+e.path+" "+e.summary+" "+e.tag).toLowerCase().includes(query));
    $("endpointCount").textContent = String(state.endpoints.length);
    if (!state.endpoints.length) {
      const empty = document.createElement("div"); empty.className = "empty";
      empty.textContent = "No OpenAPI schema loaded. Try FIND SPEC or import a JSON file.";
      list.append(empty); return;
    }
    if (!entries.length) {
      const empty = document.createElement("div"); empty.className = "empty"; empty.textContent = "No endpoints match this filter."; list.append(empty); return;
    }
    let currentTag = null;
    for (const endpoint of entries) {
      if (endpoint.tag !== currentTag) {
        currentTag = endpoint.tag;
        const group = document.createElement("div"); group.className = "group-label"; group.textContent = currentTag; list.append(group);
      }
      const button = document.createElement("button"); button.className = "endpoint";
      const method = document.createElement("span"); method.className = "method m-" + endpoint.method.toLowerCase(); method.textContent = endpoint.method;
      const text = document.createElement("span");
      const path = document.createElement("span"); path.className = "ep-path"; path.textContent = endpoint.path;
      const summary = document.createElement("span"); summary.className = "ep-summary"; summary.textContent = endpoint.summary || endpoint.operationId || "";
      text.append(path,summary); button.append(method,text); button.title = endpoint.path;
      button.addEventListener("click",() => {
        $("method").value = endpoint.method; $("path").value = endpoint.path;
        if (endpoint.server && !endpoint.server.includes("{")) $("baseUrl").value = endpoint.server;
        syncPathRows(); fillRows($("queryRows"),{});
        const queryParams={};
        for (const p of endpoint.parameters || []) if (p.in === "query") queryParams[p.name] = p.example ?? p.schema?.default ?? "";
        fillRows($("queryRows"),queryParams);
        if (endpoint.parameters?.some(p=>p.in==="path")) showRequestTab("pathvars"); else showRequestTab("params");
        list.querySelectorAll(".endpoint").forEach(el=>el.classList.toggle("selected",el===button));
      });
      list.append(button);
    }
  }

  function parseSpec(doc) {
    if (!doc || typeof doc !== "object" || !doc.paths || typeof doc.paths !== "object") throw new Error("Missing paths. Import an OpenAPI / Swagger JSON document.");
    let server = doc.servers?.[0]?.url || (doc.host ? (doc.schemes?.[0] || "https") + "://" + doc.host + (doc.basePath || "") : "");
    if (server && !/^https?:\/\//i.test(server)) {
      try { server = new URL(server,location.origin).href; } catch {}
    }
    const results = [];
    for (const [path,item] of Object.entries(doc.paths)) {
      if (!item || typeof item !== "object") continue;
      for (const method of methods) {
        const op = item[method];
        if (!op || typeof op !== "object") continue;
        const params = [...(item.parameters || []),...(op.parameters || [])];
        results.push({
          method:method.toUpperCase(),path,
          summary:op.summary || (op.description || "").split("\n")[0],
          operationId:op.operationId || "",tag:op.tags?.[0] || "DEFAULT",
          server:op.servers?.[0]?.url || server,parameters:params
        });
      }
    }
    results.sort((a,b)=>a.tag.localeCompare(b.tag)||a.path.localeCompare(b.path)||methods.indexOf(a.method.toLowerCase())-methods.indexOf(b.method.toLowerCase()));
    state.schema = doc; state.schemaEndpoints = results; rebuildEndpointList();
    if (server && !$("baseUrl").value.trim()) $("baseUrl").value = server;
    $("specMsg").textContent = "Loaded " + results.length + " endpoints" + (doc.info?.title ? " · " + doc.info.title : "");
    status("OPENAPI LOADED"); renderEndpoints();
    $("responseSummary").textContent = $("specMsg").textContent;
    $("responseBody").textContent = JSON.stringify({title:doc.info?.title || "",version:doc.info?.version || "",endpoints:results.length},null,2);
    $("statusCode").textContent = "SPEC LOADED"; $("statusCode").className = "status-code ok";
    return results.length;
  }

  async function loadSpec() {
    const value = $("specUrl").value.trim();
    if (!value) { $("specMsg").textContent = "Enter an OpenAPI JSON URL or paste/import a file."; return; }
    try {
      $("specMsg").textContent = "Loading spec from " + value + "…";
      const response = await fetch(value,{cache:"no-store"});
      if (!response.ok) throw new Error("HTTP " + response.status);
      const text = await response.text(); $("specText").value = text;
      parseSpec(JSON.parse(text)); $("specDrawer").hidden = true;
    } catch(error) {
      $("specMsg").textContent = "Load failed: " + error.message + ". Try importing a local JSON file or paste its JSON. CORS/CSP can block cross-origin fetch.";
      status("SPEC LOAD FAILED",true);
    }
  }

  async function discoverSpec() {
    const base = $("baseUrl").value.trim();
    if (!base) { status("ENTER BASE URL FIRST",true); $("requestNote").textContent = "Enter the server's base URL before searching common schema paths."; return; }
    let origin;
    try { origin = new URL(base).origin; } catch { status("INVALID BASE URL",true); return; }
    const candidates = [
      "/openapi.json","/openapi.yaml","/swagger.json","/swagger/v1/swagger.json",
      "/v3/api-docs","/api-docs","/api/openapi.json","/.well-known/openapi.json",
      "/openapi/v1.json","/swagger/doc.json"
    ];
    $("specMsg").textContent = "Checking common OpenAPI locations…";
    $("specDrawer").hidden = false;
    for (const path of candidates) {
      try {
        const response = await fetch(new URL(path,origin).href,{cache:"no-store",headers:{Accept:"application/json"}});
        if (!response.ok) continue;
        const text = await response.text();
        let doc;
        try { doc=JSON.parse(text); } catch { continue; }
        if (doc && doc.paths) {
          $("specUrl").value = new URL(path,origin).href;
          $("specText").value = text;
          parseSpec(doc);
          $("specMsg").textContent = "Found a schema at " + path;
          return;
        }
      } catch {}
    }
    $("specMsg").textContent = "No common JSON schema found or browser blocked requests by CORS/CSP. Import the server's OpenAPI JSON manually. This does not brute-force undocumented routes.";
    status("SCHEMA NOT FOUND",true);
  }


  const API_PATH_RE = /\/(?:api|apis|graphql|graphiql|rest|v[0-9]+|auth|oauth|rpc|trpc|backend|services?)(?:\/|$)/i;
  const API_STRING_RE = /["'](\/(?:api|apis|graphql|graphiql|rest|v[0-9]+|auth|oauth|rpc|trpc|backend|services?)(?:\/[A-Za-z0-9_.$~!+,:@%=-]+)*(?:\?[A-Za-z0-9_.$~!+,:@%/?=-]*)?)["']/gi;
  const ABSOLUTE_URL_RE = /https?:\/\/[A-Za-z0-9.-]+(?::[0-9]+)?(?:\/[^\s"'<>\\)]*)?/gi;
  const STATIC_FILE_RE = /\.(?:css|mjs|js|map|png|jpe?g|gif|webp|svg|ico|woff2?|ttf|eot|mp[34]|webm|pdf)(?:$|\?)/i;

  function setScanProgress(percent, statusText, detailText) {
    const value = Math.max(0, Math.min(100, Math.round(percent)));
    $("scanFill").style.width = value + "%";
    $("scanPercent").textContent = value + "%";
    if (statusText) $("scanStatus").textContent = statusText;
    if (detailText) $("scanDetail").textContent = detailText;
  }

  function urlIsApiLike(url, initiator = "", fromScript = false) {
    if (!url || !["http:","https:"].includes(url.protocol)) return false;
    if (url.hostname === "localhost" || url.hostname === "127.0.0.1") return API_PATH_RE.test(url.pathname) || /fetch|xmlhttprequest/i.test(initiator);
    if (STATIC_FILE_RE.test(url.pathname)) return false;
    if (/^(chrome|chrome-extension|devtools|data|blob):/i.test(url.href)) return false;
    return API_PATH_RE.test(url.pathname)
      || /\/(?:\.well-known\/)?(?:openapi|swagger|api-docs|v3\/api-docs)(?:\.json|\/|$)/i.test(url.pathname)
      || /^api[.-]/i.test(url.hostname)
      || /(?:graphql|trpc|jsonrpc|\/rpc)(?:\/|$|\?)/i.test(url.href)
      || /^(fetch|xmlhttprequest|beacon)$/i.test(initiator);
  }

  function rememberApiUrl(rawUrl, source, allowEndpoint = true, referenceUrl = location.href) {
    let url;
    try { url = new URL(rawUrl, referenceUrl); } catch { return false; }
    if (!["http:","https:"].includes(url.protocol) || url.username || url.password) return false;
    url.hash = "";
    const origin = url.origin;
    let server = state.discoveredServers.find(item => item.origin === origin);
    if (!server) {
      server = { origin, score: 0, sources: new Set(), count: 0 };
      state.discoveredServers.push(server);
    }
    server.sources.add(source);
    server.count++;
    server.score += /fetch|xhr|network|resource/i.test(source) ? 5 : /script/i.test(source) ? 2 : 1;

    const path = url.pathname + url.search;
    const looksLikePath = API_PATH_RE.test(url.pathname)
      || /(?:openapi|swagger|api-docs|graphql|trpc|jsonrpc)/i.test(url.href)
      || /^api[.-]/i.test(url.hostname);
    if (allowEndpoint && (looksLikePath || /fetch|xhr|network resource/i.test(source))) {
      const key = origin + "|" + path;
      const existing = state.discoveredEndpoints.find(item => item.discoveredKey === key);
      if (existing) {
        existing.count = (existing.count || 1) + 1;
        existing.summary = "Observed in page resources · HTTP method is not exposed; GET selected as a starting point";
      } else {
        state.discoveredEndpoints.push({
          method: "GET",
          path: path || "/",
          summary: "Discovered from " + source + " · method unknown, GET selected as a starting point",
          operationId: "",
          tag: "DISCOVERED API",
          server: origin,
          parameters: [],
          discoveredKey: key,
          count: 1
        });
      }
    }
    return true;
  }

  function extractApiUrls(text, source, referenceUrl = location.href) {
    if (!text || typeof text !== "string") return 0;
    let found = 0;
    const seen = new Set();
    const absoluteMatches = text.match(ABSOLUTE_URL_RE) || [];
    for (let raw of absoluteMatches) {
      raw = raw.replace(/[),.;}\]]+$/g, "");
      let url;
      try { url = new URL(raw, referenceUrl); } catch { continue; }
      if (!urlIsApiLike(url, source, true)) continue;
      const key = url.href;
      if (seen.has(key)) continue;
      seen.add(key);
      if (rememberApiUrl(url.href, source, API_PATH_RE.test(url.pathname) || /^api[.-]/i.test(url.hostname), referenceUrl)) found++;
    }
    API_STRING_RE.lastIndex = 0;
    let match;
    while ((match = API_STRING_RE.exec(text)) !== null) {
      const raw = match[1];
      const key = new URL(raw, referenceUrl).href;
      if (seen.has(key)) continue;
      seen.add(key);
      if (rememberApiUrl(raw, source, true, referenceUrl)) found++;
    }
    return found;
  }

  function getPageResources() {
    const out = [];
    const seen = new Set();
    const push = (url, source, initiator = "") => {
      try {
        const parsed = new URL(url, location.href);
        if (!["http:","https:"].includes(parsed.protocol)) return;
        if (parsed.origin === location.origin && parsed.href === location.href) return;
        const key = parsed.href + "|" + source;
        if (seen.has(key)) return;
        seen.add(key);
        out.push({ url: parsed.href, source, initiator });
      } catch {}
    };

    for (const entry of performance.getEntriesByType("resource")) {
      const initiator = String(entry.initiatorType || "").toLowerCase();
      const isNetworkCall = initiator === "fetch" || initiator === "xmlhttprequest" || initiator === "beacon";
      const parsed = (() => { try { return new URL(entry.name); } catch { return null; } })();
      if (!parsed) continue;
      if (isNetworkCall || urlIsApiLike(parsed, initiator)) {
        const source = isNetworkCall ? (initiator === "xmlhttprequest" ? "XHR resource" : "Fetch resource") : "API-like resource";
        push(entry.name, source, initiator);
        rememberApiUrl(entry.name, source, isNetworkCall || urlIsApiLike(parsed, initiator), location.href);
      }
    }

    for (const script of document.scripts) {
      if (script.src) push(script.src, "Script URL", "script");
      else if (script.textContent) extractApiUrls(script.textContent, "Inline script", location.href);
    }

    for (const element of document.querySelectorAll("a[href],form[action],[data-api-url],[data-endpoint],[data-url]")) {
      const value = element.getAttribute("href") || element.getAttribute("action") || element.getAttribute("data-api-url") || element.getAttribute("data-endpoint") || element.getAttribute("data-url");
      if (!value) continue;
      let url;
      try { url = new URL(value, location.href); } catch { continue; }
      if (urlIsApiLike(url, "DOM reference")) {
        push(url.href, "DOM API reference", "dom");
        rememberApiUrl(url.href, "DOM API reference", true, location.href);
      }
    }
    return out;
  }

  function renderDiscoveredServers() {
    const container = $("serverResults");
    container.replaceChildren();
    const list = [...state.discoveredServers].sort((a,b) => b.score - a.score || b.count - a.count).slice(0,12);
    if (!list.length) return;
    for (const server of list) {
      const button = document.createElement("button");
      button.className = "server-chip" + ($("baseUrl").value.trim().replace(/\/+$/,"") === server.origin ? " selected" : "");
      button.type = "button";
      button.textContent = server.origin + " · " + server.count;
      button.title = "Seen via: " + [...server.sources].join(", ");
      button.addEventListener("click", () => {
        $("baseUrl").value = server.origin;
        status("API SERVER SELECTED");
        setScanProgress(100, "Selected server: " + server.origin, "Choose a discovered endpoint from API EXPLORER or enter its path manually.");
        renderDiscoveredServers();
      });
      container.append(button);
    }
  }

  async function scanCurrentPage(deep = false) {
    if (state.scanController) state.scanController.abort();
    const controller = new AbortController();
    state.scanController = controller;
    const runId = ++state.scanRunId;
    $("scanPage").disabled = true;
    $("cancelScan").disabled = false;
    state.discoveredEndpoints = [];
    state.discoveredServers = [];
    setScanProgress(2, "Scanning resources already loaded by this page…", "Reading Performance Resource Timing, fetch/XHR entries, inline scripts, links and API-like DOM attributes.");
    await new Promise(resolve => setTimeout(resolve, 0));
    if (runId !== state.scanRunId) return;

    const resources = getPageResources();
    const inlineScriptCount = [...document.scripts].filter(script => !script.src && script.textContent).length;
    setScanProgress(22, "Analyzing " + resources.length + " observed resources…", "Resource timing only reveals URLs already requested by this page; request methods are generally not exposed.");
    await new Promise(resolve => setTimeout(resolve, 0));

    let scannedScripts = 0;
    let unreadableScripts = 0;
    const scriptUrls = [...new Set(resources
      .filter(item => item.source === "Script URL" && new URL(item.url).origin === location.origin)
      .map(item => item.url))].slice(0,30);

    if (deep) {
      const total = scriptUrls.length;
      setScanProgress(25, "Deep scan enabled", "Reading up to 30 same-origin JavaScript files. CSP, authentication or page changes may prevent some reads.");
      for (let i = 0; i < scriptUrls.length; i++) {
        if (controller.signal.aborted || runId !== state.scanRunId) break;
        const scriptUrl = scriptUrls[i];
        setScanProgress(25 + Math.round(((i + 1) / Math.max(total,1)) * 65), "Inspecting script " + (i + 1) + "/" + total, new URL(scriptUrl).pathname);
        try {
          const response = await fetch(scriptUrl, { credentials: "same-origin", cache: "force-cache", signal: controller.signal });
          if (!response.ok) { unreadableScripts++; continue; }
          const text = await response.text();
          extractApiUrls(text.slice(0, 1800000), "Deep-scanned same-origin script", scriptUrl);
          scannedScripts++;
        } catch (error) {
          if (controller.signal.aborted) break;
          unreadableScripts++;
        }
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }

    if (runId !== state.scanRunId) return;
    rebuildEndpointList();
    const apiOrigins = [...state.discoveredServers].sort((a,b) => b.score - a.score || b.count - a.count);
    if (!$("baseUrl").value.trim()) {
      $("baseUrl").value = apiOrigins[0]?.origin || (/^https?:$/.test(location.protocol) ? location.origin : "");
    } else if (apiOrigins.length) {
      try {
        const configuredOrigin = new URL($("baseUrl").value).origin;
        if (configuredOrigin === location.origin && apiOrigins[0].origin !== location.origin && apiOrigins[0].score > 4) $("baseUrl").value = apiOrigins[0].origin;
      } catch {
        $("baseUrl").value = apiOrigins[0].origin;
      }
    }
    renderEndpoints();
    renderDiscoveredServers();
    const endpointCount = state.discoveredEndpoints.length;
    const serverCount = state.discoveredServers.length;
    if (controller.signal.aborted) {
      setScanProgress(100, "Scan cancelled", "Results collected before cancellation are shown below.");
      status("SCAN CANCELLED", true);
    } else {
      setScanProgress(100, "Scan complete · " + endpointCount + " candidate endpoints · " + serverCount + " server origins", deep
        ? "Deep scan read " + scannedScripts + " of " + scriptUrls.length + " same-origin scripts; " + unreadableScripts + " were unreadable. " + inlineScriptCount + " inline scripts were checked."
        : inlineScriptCount + " inline scripts were checked. Enable DEEP SCAN SCRIPTS to inspect up to 30 same-origin bundles.");
      status(endpointCount ? "PAGE API SCAN COMPLETE" : "NO API CALLS IDENTIFIED", !endpointCount);
    }
    $("scanPage").disabled = false;
    $("cancelScan").disabled = true;
    state.scanController = null;
  }


  $("specToggle").addEventListener("click",()=>$("specDrawer").hidden=!$("specDrawer").hidden);
  $("closeSpec").addEventListener("click",()=>$("specDrawer").hidden=true);
  $("loadSpec").addEventListener("click",loadSpec);
  $("discover").addEventListener("click",discoverSpec);
  $("scanPage").addEventListener("click",()=>scanCurrentPage($("deepScanToggle").checked));
  $("cancelScan").addEventListener("click",()=>{ if(state.scanController){state.scanController.abort();$("scanStatus").textContent="Cancelling scan…";$("cancelScan").disabled=true;} });
  $("baseUrl").addEventListener("input",renderDiscoveredServers);
  $("parseSpec").addEventListener("click",()=>{
    try { parseSpec(JSON.parse($("specText").value)); }
    catch(error) { $("specMsg").textContent = "Parse error: " + error.message; }
  });
  $("importFile").addEventListener("click",()=>$("file").click());
  $("file").addEventListener("change",async event=>{
    const file=event.target.files?.[0]; if(!file)return;
    try { const text=await file.text(); $("specText").value=text; parseSpec(JSON.parse(text)); }
    catch(error) { $("specMsg").textContent="Import failed: "+error.message+". JSON is supported; convert YAML to JSON first."; $("specDrawer").hidden=false; }
    finally { event.target.value=""; }
  });
  $("addQuery").addEventListener("click",()=>addRow($("queryRows")));
  $("addHeader").addEventListener("click",()=>addRow($("headerRows")));
  $("path").addEventListener("input",syncPathRows);
  $("endpointSearch").addEventListener("input",renderEndpoints);
  $("clearHistory").addEventListener("click",()=>{state.history=[];renderHistory();});
  $("send").addEventListener("click",send);
  $("cancel").addEventListener("click",()=>state.active?.abort());
  shadow.querySelectorAll("[data-rtab]").forEach(button=>button.addEventListener("click",()=>showRequestTab(button.dataset.rtab)));
  shadow.querySelectorAll("[data-vtab]").forEach(button=>button.addEventListener("click",()=>showView(button.dataset.vtab)));
  $("copy").addEventListener("click",async()=>{
    try { await navigator.clipboard.writeText(state.response); $("copy").textContent="COPIED"; setTimeout(()=>$("copy").textContent="COPY",900); }
    catch { $("requestNote").textContent="Clipboard access denied by the browser."; }
  });
  $("export").addEventListener("click",()=>{
    const blob=new Blob([state.response],{type:state.responseType || "text/plain"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a"); a.href=url; a.download="api-response.txt"; a.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
  $("method").addEventListener("change",()=>{$("body").placeholder=["GET","HEAD"].includes($("method").value)?"Body is ignored for GET and HEAD.":'{"example":true}';});
  $("min").addEventListener("click",()=>{
    const hidden=$("app").classList.toggle("minimized");
    $("min").textContent=hidden?"RESTORE":"MINIMIZE";
    $("app").style.height=hidden?"54px":"calc(100vh - 32px)";
  });
  $("close").addEventListener("click",()=>{host.remove();delete window.__THE_CONSOLE_HELPER_API_CONSOLE;});
  let drag=false,dx=0,dy=0;
  $("drag").addEventListener("pointerdown",event=>{
    if(event.target.closest("button"))return;
    const r=host.getBoundingClientRect();drag=true;dx=event.clientX-r.left;dy=event.clientY-r.top;
    $("drag").setPointerCapture(event.pointerId);
  });
  $("drag").addEventListener("pointermove",event=>{
    if(!drag)return;
    host.style.left=clamp(event.clientX-dx,0,innerWidth-host.offsetWidth)+"px";
    host.style.top=clamp(event.clientY-dy,0,innerHeight-host.offsetHeight)+"px";
    host.style.right="auto";
  });
  $("drag").addEventListener("pointerup",()=>drag=false);
  $("drag").addEventListener("pointercancel",()=>drag=false);
  window.addEventListener("resize",()=>{
    host.style.maxWidth="calc(100vw - 16px)";
    if(host.getBoundingClientRect().right>innerWidth)host.style.left=Math.max(0,innerWidth-host.offsetWidth)+"px";
    if(host.getBoundingClientRect().bottom>innerHeight)host.style.top=Math.max(0,innerHeight-host.offsetHeight)+"px";
  });

  addRow($("headerRows"),"Accept","application/json");
  addRow($("queryRows"));
  syncPathRows();
  renderEndpoints();
  if(/^https?:$/.test(location.protocol)) $("baseUrl").value = location.origin;
  status("READY");
  renderDiscoveredServers();
  setTimeout(()=>scanCurrentPage(false),0);
  window.__THE_CONSOLE_HELPER_API_CONSOLE = {
    close:()=>{$("close").click();},
    send,
    loadSpec,
    discoverSpec,
    scanCurrentPage,
    get endpoints(){return state.endpoints.length;},
    get discoveredServers(){return state.discoveredServers.map(item=>({origin:item.origin,count:item.count,sources:[...item.sources]}));}
  };
  console.info("The Console Helper API Console injected. Press CLOSE in the panel or run window.__THE_CONSOLE_HELPER_API_CONSOLE.close() to remove it.");
})();