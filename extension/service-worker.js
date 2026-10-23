chrome.action.onClicked.addListener(async (tab) => {
  if (!tab || typeof tab.id !== "number") return;
  const target = {
    id: tab.id,
    url: typeof tab.url === "string" ? tab.url : "",
    title: typeof tab.title === "string" ? tab.title : ""
  };
  await chrome.storage.session.set({ serverTraceTargetTab: target });
  await chrome.sidePanel.open({ tabId: tab.id });
  try {
    await chrome.runtime.sendMessage({ type: "SERVER_TRACE_TARGET_TAB", tab: target });
  } catch {}
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type !== "SERVER_TRACE_GET_TARGET_TAB") return;
  chrome.storage.session.get("serverTraceTargetTab").then((data) => {
    sendResponse({ tab: data.serverTraceTargetTab || null });
  }).catch((error) => {
    sendResponse({ tab: null, error: String(error?.message || error) });
  });
  return true;
});