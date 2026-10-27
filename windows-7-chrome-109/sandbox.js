"use strict";

(() => {
  const send = (message) => {
    try { parent.postMessage({ serverTraceLegacySandbox: true, ...message }, "*"); } catch {}
  };

  function blockedNetwork() {
    throw new Error("Network access is disabled in the Server Trace sandbox.");
  }

  try { Object.defineProperty(globalThis, "fetch", { value: blockedNetwork, writable: false, configurable: false }); } catch {}
  try { Object.defineProperty(globalThis, "XMLHttpRequest", { value: blockedNetwork, writable: false, configurable: false }); } catch {}
  try { Object.defineProperty(globalThis, "WebSocket", { value: blockedNetwork, writable: false, configurable: false }); } catch {}
  try { Object.defineProperty(globalThis, "EventSource", { value: blockedNetwork, writable: false, configurable: false }); } catch {}

  window.addEventListener("message", (event) => {
    if (event.source !== parent || !event.data || event.data.serverTraceLegacyRequest !== true) return;
    send({ type: "ERROR", message: "The legacy sandbox runner has not been implemented yet." });
  });
})();
