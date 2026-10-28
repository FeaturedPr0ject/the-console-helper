"use strict";

(() => {
  const send = (message) => {
    try { parent.postMessage({ serverTraceLegacySandbox: true, ...message }, "*"); } catch {}
  };
  const persistentState = Object.create(null);
  const AsyncFunction = Object.getPrototypeOf(async function() {}).constructor;

  function safeText(value) {
    if (typeof value === "string") return value;
    if (typeof value === "undefined") return "undefined";
    if (typeof value === "bigint") return String(value) + "n";
    if (typeof value === "function") return "[Function " + (value.name || "anonymous") + "]";
    try {
      const seen = new WeakSet();
      const result = JSON.stringify(value, (_key, item) => {
        if (typeof item === "bigint") return String(item) + "n";
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
  }

  function blockedNetwork() {
    throw new Error("Network access is disabled in the Server Trace Legacy sandbox.");
  }

  try { Object.defineProperty(globalThis, "fetch", { value: blockedNetwork, writable: false, configurable: false }); } catch {}
  try { Object.defineProperty(globalThis, "XMLHttpRequest", { value: blockedNetwork, writable: false, configurable: false }); } catch {}
  try { Object.defineProperty(globalThis, "WebSocket", { value: blockedNetwork, writable: false, configurable: false }); } catch {}
  try { Object.defineProperty(globalThis, "EventSource", { value: blockedNetwork, writable: false, configurable: false }); } catch {}
  try { Object.defineProperty(globalThis, "Worker", { value: blockedNetwork, writable: false, configurable: false }); } catch {}
  try { Object.defineProperty(globalThis, "SharedWorker", { value: blockedNetwork, writable: false, configurable: false }); } catch {}

  function makeConsole(runId) {
    const levels = ["log", "info", "warn", "error", "debug", "table"];
    const result = {};
    levels.forEach((level) => {
      result[level] = (...values) => {
        send({
          type: "LOG",
          runId,
          level,
          text: values.map(safeText).join(" ")
        });
      };
    });
    result.clear = () => send({ type: "CLEAR", runId });
    result.assert = (condition, ...values) => {
      if (!condition) result.error("Assertion failed:", ...values);
    };
    result.time = () => {};
    result.timeEnd = () => {};
    result.group = () => {};
    result.groupEnd = () => {};
    return result;
  }

  window.addEventListener("message", async (event) => {
    if (event.source !== parent || !event.data) return;
    if (event.data.serverTraceLegacyPing === true) {
      send({ type: "READY" });
      return;
    }
    if (event.data.serverTraceLegacyRequest !== true) return;

    const runId = event.data.runId;
    const code = event.data.code;
    if (typeof runId !== "number" || typeof code !== "string") return;
    if (code.length > 500000) {
      send({ type: "ERROR", runId, message: "Code is larger than the 500 KB safety limit." });
      send({ type: "DONE", runId });
      return;
    }

    try {
      const consoleCapture = makeConsole(runId);
      const fn = new AsyncFunction("console", "state", "\"use strict\";\n" + code);
      const result = await fn(consoleCapture, persistentState);
      if (result !== undefined) send({ type: "RESULT", runId, text: safeText(result) });
    } catch (error) {
      send({ type: "ERROR", runId, message: String(error && error.stack ? error.stack : error) });
    } finally {
      send({ type: "DONE", runId });
    }
  });

  send({ type: "READY" });
})();
