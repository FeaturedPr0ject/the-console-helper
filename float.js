(() => {
  const ID = "coneui-liquid-glass-demo";
  document.getElementById(ID)?.remove();

  const host = document.createElement("div");
  host.id = ID;
  host.style.cssText = "position:fixed;left:24px;top:24px;width:min(1100px,calc(100vw - 48px));height:min(820px,calc(100vh - 48px));z-index:2147483647;border:1px solid rgba(255,255,255,.24);border-radius:20px;overflow:hidden;background:rgba(16,17,22,.76);box-shadow:0 28px 100px rgba(0,0,0,.5);backdrop-filter:blur(24px);";
  const shadow = host.attachShadow({mode:"open"});
  shadow.innerHTML = `
    <style>
      :host{font-family:Inter,Segoe UI,Arial,sans-serif}
      *{box-sizing:border-box}
      .bar{height:44px;display:flex;align-items:center;gap:10px;padding:0 12px;background:rgba(20,20,26,.92);color:#f7f7fb;border-bottom:1px solid #ffffff20;cursor:move;user-select:none}
      .dot{width:9px;height:9px;border-radius:50%;background:#b3a4ff;box-shadow:0 0 12px #a998ff}
      .name{font-size:12px;font-weight:650;letter-spacing:.2px}
      .hint{font-size:11px;color:#a5a4b4}
      .spacer{flex:1}
      button{font:inherit;border:1px solid #ffffff20;background:#ffffff0d;color:#fff;border-radius:9px;padding:5px 10px;cursor:pointer}
      button:hover{background:#ffffff20}
      iframe{display:block;width:100%;height:calc(100% - 44px);border:0;background:#111}
      @media(max-width:600px){.hint{display:none}}
    </style>
    <div class="bar" id="drag"><span class="dot"></span><span class="name">Liquid Glass Demo</span><span class="hint">winaviation.github.io</span><span class="spacer"></span><button id="reload">Reload</button><button id="close">×</button></div>
    <iframe id="demo" src="https://winaviation.github.io/liquid-glass-demo/" title="Liquid Glass Demo" referrerpolicy="no-referrer"></iframe>
  `;
  document.documentElement.appendChild(host);

  shadow.getElementById("close").onclick = () => host.remove();
  shadow.getElementById("reload").onclick = () => {
    const frame = shadow.getElementById("demo");
    frame.src = "https://winaviation.github.io/liquid-glass-demo/";
  };

  const bar = shadow.getElementById("drag");
  let moving = false, dx = 0, dy = 0;
  bar.addEventListener("pointerdown", e => {
    if (e.target.closest("button")) return;
    const r = host.getBoundingClientRect();
    moving = true;
    dx = e.clientX - r.left;
    dy = e.clientY - r.top;
    bar.setPointerCapture(e.pointerId);
  });
  bar.addEventListener("pointermove", e => {
    if (!moving) return;
    host.style.left = Math.max(0, Math.min(innerWidth - host.offsetWidth, e.clientX - dx)) + "px";
    host.style.top = Math.max(0, Math.min(innerHeight - 60, e.clientY - dy)) + "px";
  });
  const stop = () => moving = false;
  bar.addEventListener("pointerup", stop);
  bar.addEventListener("pointercancel", stop);
  console.info("ConeUI: Liquid Glass demo panel loaded.");
})();