"use strict";

(() => {
  const send = (message) => {
    try { parent.postMessage({ serverTraceSandbox: true, ...message }, "*"); } catch {}
  };

  const serialize = (value) => {
    if (value === undefined) return "undefined";
    if (typeof value === "string") return value;
    if (typeof value === "bigint") return value.toString() + "n";
    if (typeof value === "function") return "[Function " + (value.name || "anonymous") + "]";
    try {
      const seen = new WeakSet();
      const result = JSON.stringify(value, (_key, item) => {
        if (typeof item === "bigint") return item.toString() + "n";
        if (typeof item === "function") return "[Function]";
        if (item && typeof item === "object") {
          if (seen.has(item)) return "[Circular]";
          seen.add(item);
        }
        return item;
      }, 2);
      return result === undefined ? String(value) : result;
    } catch {
      try { return String(value); } catch { return "[Unserializable value]"; }
    }
  };

  function blockedNetwork() {
    throw new Error("Network access is disabled in the Server Trace sandbox.");
  }
  const disabledApi = function() {
    throw new Error("This browser API is disabled in the Server Trace sandbox.");
  };

  try { Object.defineProperty(globalThis, "fetch", { value: blockedNetwork, writable: false, configurable: false }); } catch {}
  try { Object.defineProperty(globalThis, "XMLHttpRequest", { value: disabledApi, writable: false, configurable: false }); } catch {}
  try { Object.defineProperty(globalThis, "WebSocket", { value: disabledApi, writable: false, configurable: false }); } catch {}
  try { Object.defineProperty(globalThis, "EventSource", { value: disabledApi, writable: false, configurable: false }); } catch {}
  try { Object.defineProperty(globalThis, "Worker", { value: disabledApi, writable: false, configurable: false }); } catch {}
  try { Object.defineProperty(globalThis, "SharedWorker", { value: disabledApi, writable: false, configurable: false }); } catch {}

  const AsyncFunction = Object.getPrototypeOf(async function() {}).constructor;
  const persistentState = Object.create(null);

  window.addEventListener("message", async (event) => {
    if (event.source !== parent || !event.data) return;
    if (event.data.serverTracePing === true) {
      send({ type: "READY" });
      return;
    }
    if (event.data.serverTraceRequest !== true) return;
    const { runId, code, report } = event.data;
    if (typeof code !== "string" || code.length > 500000) {
      send({ type: "ERROR", runId, message: "Command is empty or exceeds the 500 KB safety limit." });
      return;
    }

    const safeReport = report && typeof report === "object" ? report : {};
    const pageInfo = Object.freeze({
      title: String(safeReport.pageTitle || ""),
      url: String(safeReport.pageUrl || ""),
      origin: String(safeReport.pageOrigin || ""),
      scannedAt: String(safeReport.scannedAt || ""),
      resourceCount: Number(safeReport.resourceCount || 0),
      inlineScriptCount: Number(safeReport.inlineScriptCount || 0)
    });
    const endpoints = Object.freeze(Array.isArray(safeReport.endpoints)
      ? safeReport.endpoints.map((item) => Object.freeze({
          url: String(item.url || ""),
          source: String(item.source || ""),
          host: String(item.host || "")
        }))
      : []);
    const findEndpoints = (query) => {
      const term = String(query || "").toLowerCase();
      return endpoints.filter((item) => item.url.toLowerCase().includes(term) ||
        item.host.toLowerCase().includes(term) || item.source.toLowerCase().includes(term));
    };

    const customConsole = Object.freeze({
      log: (...args) => send({ type: "LOG", runId, level: "log", values: args.map(serialize) }),
      info: (...args) => send({ type: "LOG", runId, level: "log", values: args.map(serialize) }),
      debug: (...args) => send({ type: "LOG", runId, level: "log", values: args.map(serialize) }),
      warn: (...args) => send({ type: "LOG", runId, level: "warn", values: args.map(serialize) }),
      error: (...args) => send({ type: "LOG", runId, level: "error", values: args.map(serialize) }),
      table: (value) => send({ type: "LOG", runId, level: "log", values: [serialize(value)] }),
      clear: () => send({ type: "CLEAR", runId }),
      assert: (condition, ...args) => { if (!condition) send({ type: "LOG", runId, level: "error", values: ["Assertion failed", ...args.map(serialize)] }); },
      time: () => {},
      timeEnd: () => {}
    });

    send({ type: "START", runId });
    try {
      const run = new AsyncFunction(
        "console", "pageInfo", "endpoints", "findEndpoints", "state",
        "fetch", "XMLHttpRequest", "WebSocket", "EventSource", "Worker", "SharedWorker",
        '"use strict";\n' + code
      );
      const result = await run(
        customConsole, pageInfo, endpoints, findEndpoints, persistentState,
        blockedNetwork, disabledApi, disabledApi, disabledApi, disabledApi, disabledApi
      );
      if (result !== undefined) send({ type: "RESULT", runId, value: serialize(result) });
      send({ type: "DONE", runId });
    } catch (error) {
      send({
        type: "ERROR",
        runId,
        message: String(error && error.stack || error && error.message || error)
      });
    }
  });

  send({ type: "READY" });
})();