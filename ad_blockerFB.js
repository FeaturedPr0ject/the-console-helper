(() => {
  if (!/(^|\.)facebook\.com$/i.test(location.hostname)) {
    console.warn("ConeUI FB Ad Blocker must be run on facebook.com.");
    return;
  }

  if (window.__coneuiFBAdBlocker && typeof window.__coneuiFBAdBlocker.stop === "function") {
    window.__coneuiFBAdBlocker.stop();
  }

  const UI_ID = "coneui-fb-adblocker-ui";
  const HIDDEN_ATTR = "data-coneui-fb-ad-hidden";
  const INVISIBLE_RE = /[\p{Cf}\p{Mn}\p{Co}]/gu;
  const CARD_SELECTOR = '[data-pagelet*="FeedUnit"], [aria-posinset], [role="article"]';
  const LABEL_SELECTOR = 'span, a, abbr, use, [aria-label], [aria-labelledby], [title]';
  const hiddenPosts = new Map();

  let enabled = true;
  let hideSuggested = false;
  let observer = null;
  let scanTimer = 0;
  let intervalTimer = 0;
  let stopped = false;

  const uiHost = document.createElement("div");
  uiHost.id = UI_ID;
  uiHost.style.cssText = "all:initial;position:fixed;right:20px;bottom:20px;z-index:2147483647;width:300px;max-width:calc(100vw - 24px);pointer-events:none;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;";
  const ui = uiHost.attachShadow({ mode: "open" });

  const style = document.createElement("style");
  style.textContent = [
    ":host{all:initial;color:#f7f7fc;font:12px/1.45 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}",
    "*{box-sizing:border-box}",
    ".panel{overflow:hidden;border:1px solid rgba(255,255,255,.22);border-radius:18px;background:rgba(25,25,34,.76);color:#f7f7fc;box-shadow:0 18px 60px rgba(0,0,0,.3),inset 0 1px rgba(255,255,255,.16);backdrop-filter:blur(24px) saturate(1.45);-webkit-backdrop-filter:blur(24px) saturate(1.45);pointer-events:auto}",
    ".head{display:flex;align-items:center;gap:10px;padding:12px 13px;border-bottom:1px solid rgba(255,255,255,.12);cursor:move;user-select:none;touch-action:none}",
    ".mark{width:30px;height:30px;display:grid;place-items:center;border:1px solid rgba(255,255,255,.25);border-radius:10px;background:linear-gradient(145deg,rgba(255,255,255,.35),rgba(255,255,255,.06));font-weight:800;font-size:14px}",
    ".title{font-size:13px;font-weight:750;letter-spacing:-.15px}.subtitle{margin-top:2px;color:#b8b8c8;font-size:10px}.spacer{flex:1}",
    "button{font:inherit;color:inherit;cursor:pointer}",
    ".icon{width:27px;height:27px;border:1px solid rgba(255,255,255,.16);border-radius:9px;background:rgba(255,255,255,.07);font-size:15px}",
    ".body{padding:13px}.status{display:flex;align-items:center;gap:8px;padding:10px 11px;border:1px solid rgba(255,255,255,.13);border-radius:12px;background:rgba(255,255,255,.055)}",
    ".dot{width:7px;height:7px;flex:0 0 7px;border-radius:50%;background:#59d7a1;box-shadow:0 0 9px rgba(89,215,161,.6)}.dot.off{background:#e5a35b;box-shadow:0 0 9px rgba(229,163,91,.4)}",
    ".count{margin-left:auto;color:#d4d1ff;font-variant-numeric:tabular-nums;font-weight:700}",
    ".actions{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:10px}",
    ".btn{min-height:34px;padding:8px 9px;border:1px solid rgba(255,255,255,.16);border-radius:10px;background:linear-gradient(145deg,rgba(255,255,255,.12),rgba(255,255,255,.035));box-shadow:inset 0 1px rgba(255,255,255,.12);font-size:10px;transition:transform .12s,background .12s}",
    ".btn:hover{background:rgba(255,255,255,.17);transform:translateY(-1px)}.btn.primary{background:linear-gradient(135deg,#7569d8,#5b74c8);border-color:rgba(255,255,255,.22);font-weight:700}.btn.wide{grid-column:1/-1}",
    ".note{margin-top:10px;color:#aeadbf;font-size:10px;line-height:1.5}.collapsed .body{display:none}",
    "@media(prefers-reduced-motion:reduce){*{transition:none!important}}"
  ].join("");
  ui.appendChild(style);

  const panel = document.createElement("section");
  panel.className = "panel";
  panel.innerHTML = [
    '<header class="head" id="head">',
    '<div class="mark">FB</div><div><div class="title">ConeUI FB Ad Blocker</div><div class="subtitle">Sponsored feed filter</div></div>',
    '<div class="spacer"></div><button class="icon" id="min" title="Minimize">−</button>',
    '</header>',
    '<div class="body" id="body">',
    '<div class="status"><span class="dot" id="dot"></span><span id="statusText">Filtering sponsored posts</span><span class="count" id="count">0 hidden</span></div>',
    '<div class="actions">',
    '<button class="btn primary" id="toggle">Pause filter</button><button class="btn" id="rescan">Rescan feed</button>',
    '<button class="btn" id="suggested">Hide suggested: OFF</button><button class="btn" id="restore">Restore hidden</button>',
    '<button class="btn wide" id="stop">Stop blocker and restore posts</button>',
    '</div>',
    '<div class="note">Best-effort DOM filter. It hides feed cards with recognizable ad signals; Facebook can change its markup, and in-video or server-delivered ads may remain.</div>',
    '</div>'
  ].join("");
  ui.appendChild(panel);
  document.documentElement.appendChild(uiHost);

  const $ = id => ui.getElementById(id);

  function normalizeText(value) {
    return String(value || "")
      .replace(INVISIBLE_RE, "")
      .normalize("NFKD")
      .replace(/\p{M}/gu, "")
      .replace(/đ/gi, "d")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  }

  function classifyText(value) {
    const text = normalizeText(value);
    if (!text || text.length > 100) return null;

    if (/^(sponsored|sponsored content|paid partnership|paid partnership with .{1,70}|sponsored by .{1,70}|duoc tai tro|duoc tai tro boi .{1,70}|partenariat remunere|publicite|sponsorise|gesponsert|patrocinado|patrocinada|publicidad|sponsorizzato|pubblicita)(\s*[·•|]\s*.*)?$/i.test(text)) {
      return "sponsored";
    }

    if (hideSuggested && /^(suggested for you|suggested|goi y cho ban|bai viet goi y)(\s*[·•|]\s*.*)?$/i.test(text)) {
      return "suggested";
    }

    if (text === "ad" || text === "quang cao") return "ad-label";
    return null;
  }

  function ownText(element) {
    let value = "";
    for (const node of element.childNodes) {
      if (node.nodeType === Node.TEXT_NODE) value += node.textContent || "";
      if (value.length > 260) return "";
    }
    return value.trim();
  }

  function isCharacterSplit(element) {
    const children = element.children;
    if (children.length < 4 || children.length > 120) return false;
    for (const child of children) {
      if (child.tagName !== "SPAN" || child.children.length !== 0) return false;
      if (normalizeText(child.textContent).length > 1) return false;
    }
    return true;
  }

  function characterVariants(element) {
    const children = Array.from(element.children).map((child, index) => {
      const computed = getComputedStyle(child);
      const order = Number.parseInt(computed.order, 10);
      return {
        child,
        index,
        order: Number.isNaN(order) ? index : order,
        classCount: child.classList.length,
        hidden: computed.display === "none" || computed.visibility === "hidden"
      };
    }).filter(item => !item.hidden).sort((a, b) => a.order - b.order || a.index - b.index);

    const assemble = predicate => normalizeText(children
      .filter(item => predicate(item.classCount))
      .map(item => item.child.textContent || "")
      .join(""));

    return [
      assemble(() => true),
      assemble(count => count > 10),
      assemble(count => count <= 10)
    ];
  }

  function textFromSvgUse(element) {
    const href = element.getAttribute("href")
      || element.getAttribute("xlink:href")
      || element.getAttributeNS("http://www.w3.org/1999/xlink", "href");
    if (!href || !href.startsWith("#")) return "";
    const target = document.getElementById(href.slice(1));
    return target ? target.textContent || "" : "";
  }

  function labelTexts(element) {
    const values = [];
    const aria = element.getAttribute("aria-label");
    if (aria) values.push(aria);
    const title = element.getAttribute("title");
    if (title) values.push(title);

    const labelledBy = element.getAttribute("aria-labelledby");
    if (labelledBy) {
      for (const id of labelledBy.split(/\s+/).slice(0, 4)) {
        const target = document.getElementById(id);
        if (target) values.push(target.textContent || "");
      }
    }

    if (element.tagName === "USE") values.push(textFromSvgUse(element));

    const direct = ownText(element);
    if (direct) values.push(direct);

    if (element.children.length === 0 && element.tagName !== "USE") {
      const leaf = element.textContent || "";
      if (leaf.length <= 260) values.push(leaf);
    } else if (isCharacterSplit(element)) {
      values.push(...characterVariants(element));
    }

    return values;
  }

  function hasStrongAdSignal(card) {
    if (card.querySelector('a[href*="/ads/about/"], a[href*="facebook.com/ads/about/"]')) return true;

    const labelled = card.querySelectorAll("[aria-label]");
    for (const element of labelled) {
      const label = normalizeText(element.getAttribute("aria-label"));
      if (/sponsored content|paid partnership|why am i seeing this ad|ve sao toi thay quang cao/.test(label)) return true;
    }

    return false;
  }

  function classifyCard(card) {
    if (!card || !(card instanceof Element)) return null;
    if (card.id === UI_ID || card.contains(uiHost) || uiHost.contains(card)) return null;

    const strongAdSignal = hasStrongAdSignal(card);
    const elements = [card, ...card.querySelectorAll(LABEL_SELECTOR)];
    for (const element of elements) {
      if (!(element instanceof Element)) continue;
      const href = element.tagName === "A" ? element.getAttribute("href") || "" : "";
      if (/\/ads\/about(?:\/|\?|$)/i.test(href)) return "sponsored";

      const values = labelTexts(element);
      for (const value of values) {
        const reason = classifyText(value);
        if (reason === "sponsored" || reason === "suggested") return reason;
        if (reason === "ad-label" && (strongAdSignal || element.tagName === "USE" || element.hasAttribute("aria-label"))) {
          return "sponsored";
        }
      }
    }

    return null;
  }

  function findCardRoot(element) {
    return element.closest('[data-pagelet*="FeedUnit"]')
      || element.closest("[aria-posinset]")
      || element.closest('[role="article"]');
  }

  function hideCard(card, reason) {
    if (!hiddenPosts.has(card)) {
      hiddenPosts.set(card, {
        display: card.style.getPropertyValue("display"),
        priority: card.style.getPropertyPriority("display"),
        reason
      });
    }
    card.style.setProperty("display", "none", "important");
    card.setAttribute(HIDDEN_ATTR, reason);
  }

  function restoreCard(card) {
    const original = hiddenPosts.get(card);
    if (!original) return;

    if (card.getAttribute(HIDDEN_ATTR)) {
      if (original.display) {
        card.style.setProperty("display", original.display, original.priority);
      } else {
        card.style.removeProperty("display");
      }
      card.removeAttribute(HIDDEN_ATTR);
    }
    hiddenPosts.delete(card);
  }

  function restoreAll() {
    for (const card of Array.from(hiddenPosts.keys())) restoreCard(card);
    updatePanel();
  }

  function getCardCandidates() {
    const candidates = document.querySelectorAll(CARD_SELECTOR);
    const cards = new Set();
    for (const candidate of candidates) {
      const root = findCardRoot(candidate);
      if (root && !uiHost.contains(root) && root.isConnected) cards.add(root);
    }
    return cards;
  }

  function updatePanel() {
    if (stopped) return;
    $("count").textContent = hiddenPosts.size + " hidden";
    $("statusText").textContent = enabled ? "Filtering sponsored posts" : "Filter paused";
    $("dot").classList.toggle("off", !enabled);
    $("toggle").textContent = enabled ? "Pause filter" : "Enable filter";
    $("toggle").classList.toggle("primary", enabled);
    $("suggested").textContent = "Hide suggested: " + (hideSuggested ? "ON" : "OFF");
  }

  function scan() {
    if (stopped) return;
    if (!enabled) {
      updatePanel();
      return;
    }

    const cards = getCardCandidates();

    for (const card of Array.from(hiddenPosts.keys())) {
      if (!card.isConnected || !cards.has(card)) {
        restoreCard(card);
      } else {
        const reason = classifyCard(card);
        if (!reason) restoreCard(card);
      }
    }

    for (const card of cards) {
      if (card.hasAttribute(HIDDEN_ATTR)) continue;
      const reason = classifyCard(card);
      if (reason) hideCard(card, reason);
    }

    updatePanel();
  }

  function scheduleScan() {
    if (stopped || !enabled) return;
    if (scanTimer) clearTimeout(scanTimer);
    scanTimer = setTimeout(() => {
      scanTimer = 0;
      scan();
    }, 350);
  }

  function setEnabled(value) {
    enabled = !!value;
    if (enabled) {
      scheduleScan();
    } else {
      restoreAll();
    }
    updatePanel();
  }

  $("toggle").addEventListener("click", () => setEnabled(!enabled));
  $("rescan").addEventListener("click", () => scan());
  $("suggested").addEventListener("click", () => {
    hideSuggested = !hideSuggested;
    if (!hideSuggested) {
      for (const [card, value] of Array.from(hiddenPosts.entries())) {
        if (value.reason === "suggested") restoreCard(card);
      }
    }
    scan();
  });
  $("restore").addEventListener("click", () => restoreAll());
  $("stop").addEventListener("click", () => api.stop());
  $("min").addEventListener("click", () => panel.classList.toggle("collapsed"));

  let dragging = false;
  let dragX = 0;
  let dragY = 0;
  $("head").addEventListener("pointerdown", event => {
    if (event.target.closest("button")) return;
    const rect = uiHost.getBoundingClientRect();
    dragging = true;
    dragX = event.clientX - rect.left;
    dragY = event.clientY - rect.top;
    $("head").setPointerCapture(event.pointerId);
  });
  $("head").addEventListener("pointermove", event => {
    if (!dragging) return;
    uiHost.style.left = Math.max(0, Math.min(innerWidth - uiHost.offsetWidth, event.clientX - dragX)) + "px";
    uiHost.style.top = Math.max(0, Math.min(innerHeight - uiHost.offsetHeight, event.clientY - dragY)) + "px";
    uiHost.style.right = "auto";
    uiHost.style.bottom = "auto";
  });
  $("head").addEventListener("pointerup", () => { dragging = false; });
  $("head").addEventListener("pointercancel", () => { dragging = false; });

  const api = {
    scan,
    pause: () => setEnabled(false),
    resume: () => setEnabled(true),
    restore: restoreAll,
    stop: () => {
      if (stopped) return;
      stopped = true;
      if (observer) observer.disconnect();
      if (scanTimer) clearTimeout(scanTimer);
      if (intervalTimer) clearInterval(intervalTimer);
      restoreAll();
      uiHost.remove();
      if (window.__coneuiFBAdBlocker === api) delete window.__coneuiFBAdBlocker;
      console.info("ConeUI FB Ad Blocker stopped. Hidden posts have been restored.");
    },
    get status() {
      return { enabled, hideSuggested, hidden: hiddenPosts.size };
    }
  };

  window.__coneuiFBAdBlocker = api;

  observer = new MutationObserver(() => scheduleScan());
  observer.observe(document.body, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: ["aria-label", "aria-labelledby", "href", "xlink:href"]
  });

  intervalTimer = setInterval(() => {
    if (enabled && !document.hidden) scheduleScan();
  }, 4500);

  scan();
  console.info("ConeUI FB Ad Blocker loaded. Run window.__coneuiFBAdBlocker.stop() to stop and restore hidden posts.");
})();