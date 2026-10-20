(() => {
  const ID = "coneui-console-float";
  document.getElementById(ID)?.remove();

  const root = document.createElement("div");
  root.id = ID;
  root.style.cssText = [
    "all:initial",
    "position:fixed",
    "right:24px",
    "bottom:24px",
    "z-index:2147483647",
    "font-family:Inter,Segoe UI,Arial,sans-serif",
    "color:#f7f7fb"
  ].join(";");

  const shadow = root.attachShadow({ mode: "open" });
  shadow.innerHTML = `
    <style>
      *{box-sizing:border-box}
      .panel{
        width:310px;overflow:hidden;border-radius:22px;
        color:#f6f6fa;background:rgba(24,25,32,.68);
        border:1px solid rgba(255,255,255,.16);
        box-shadow:0 24px 80px rgba(0,0,0,.34),inset 0 1px rgba(255,255,255,.12);
        backdrop-filter:blur(28px) saturate(155%);
        -webkit-backdrop-filter:blur(28px) saturate(155%);
        animation:appear .24s cubic-bezier(.2,.8,.2,1);
      }
      @keyframes appear{from{opacity:0;transform:translateY(10px) scale(.97)}to{opacity:1;transform:none}}
      .top{display:flex;align-items:center;gap:11px;padding:15px 15px 13px;cursor:move;border-bottom:1px solid #ffffff14;user-select:none}
      .mark{width:36px;height:36px;display:grid;place-items:center;border-radius:12px;background:linear-gradient(145deg,#b4a4ff,#7465e9);color:white;font-size:18px;font-weight:800;box-shadow:0 4px 18px #9585ff40}
      .brand{font-size:14px;font-weight:700;letter-spacing:.1px}.sub{margin-top:3px;color:#aaaaba;font-size:11px}
      .spacer{flex:1}
      button{font:inherit;cursor:pointer;border:0;color:inherit}
      .icon{width:28px;height:28px;border-radius:9px;background:#ffffff0d;color:#c9c8d5;font-size:17px;display:grid;place-items:center}
      .icon:hover{background:#ffffff1b}
      .body{padding:15px}
      .eyebrow{font-size:10px;text-transform:uppercase;letter-spacing:1.3px;color:#aaa9bd;font-weight:700;margin:0 0 10px}
      .hero{padding:13px;border-radius:15px;background:linear-gradient(125deg,#9d87ff20,#6a8cff12);border:1px solid #b5a4ff25}
      .heroTitle{font-size:15px;font-weight:650;margin:0 0 5px}.heroText{font-size:12px;line-height:1.5;color:#b9b8c9}
      .status{display:flex;align-items:center;gap:7px;font-size:11px;color:#c4c3d1;margin-top:12px}
      .dot{width:7px;height:7px;border-radius:50%;background:#6ee7b7;box-shadow:0 0 10px #6ee7b755}
      .row{display:flex;gap:8px;margin-top:11px}
      .action{flex:1;padding:10px 9px;border-radius:12px;background:#ffffff0c;border:1px solid #ffffff12;font-size:12px;transition:background .16s,transform .16s}
      .action:hover{background:#ffffff19;transform:translateY(-1px)}
      .primary{background:linear-gradient(135deg,#8e7cf6,#6e69df);border-color:#ffffff22;color:white;font-weight:650}
      .primary:hover{background:linear-gradient(135deg,#a093ff,#7d77f0)}
      .foot{display:flex;align-items:center;justify-content:space-between;border-top:1px solid #ffffff12;padding:11px 15px;color:#9998aa;font-size:10px}
      .hidden{display:none!important}
      @media(prefers-reduced-motion:reduce){.panel{animation:none}button{transition:none}}
    </style>
    <section class="panel">
      <header class="top" id="drag">
        <div class="mark">C</div>
        <div><div class="brand">ConeUI Float</div><div class="sub">Console interface · Glass edition</div></div>
        <div class="spacer"></div>
        <button class="icon" id="min" title="Minimize" aria-label="Minimize">−</button>
        <button class="icon" id="close" title="Close" aria-label="Close">×</button>
      </header>
      <div class="body" id="body">
        <p class="eyebrow">Workspace</p>
        <div class="hero">
          <div class="heroTitle">Your floating space</div>
          <div class="heroText">A lightweight glass panel injected into this page. Drag the header to move it around.</div>
          <div class="status"><span class="dot"></span><span>Running locally in this tab</span></div>
        </div>
        <div class="row">
          <button class="action primary" id="theme">Change glow</button>
          <button class="action" id="clock">Show time</button>
        </div>
        <div class="row">
          <button class="action" id="reset">Reset position</button>
          <button class="action" id="remove">Remove UI</button>
        </div>
      </div>
      <footer class="foot"><span>FLOAT UI  •  0.2</span><span>Liquid glass</span></footer>
    </section>
  `;

  document.documentElement.appendChild(root);

  let glow = false;
  shadow.getElementById("theme").onclick = () => {
    glow = !glow;
    const mark = shadow.querySelector(".mark");
    mark.style.background = glow
      ? "linear-gradient(145deg,#71d9ff,#4679e9)"
      : "linear-gradient(145deg,#b4a4ff,#7465e9)";
    mark.style.boxShadow = glow ? "0 4px 22px #64bcff66" : "0 4px 18px #9585ff40";
  };

  shadow.getElementById("clock").onclick = () => {
    const text = shadow.querySelector(".heroText");
    text.textContent = "Local time: " + new Date().toLocaleTimeString();
  };

  shadow.getElementById("min").onclick = () => {
    shadow.getElementById("body").classList.toggle("hidden");
    shadow.getElementById("min").textContent =
      shadow.getElementById("body").classList.contains("hidden") ? "+" : "−";
  };

  const remove = () => root.remove();
  shadow.getElementById("close").onclick = remove;
  shadow.getElementById("remove").onclick = remove;
  shadow.getElementById("reset").onclick = () => {
    root.style.left = "";
    root.style.top = "";
    root.style.right = "24px";
    root.style.bottom = "24px";
  };

  const drag = shadow.getElementById("drag");
  let moving = false, dx = 0, dy = 0;
  drag.addEventListener("pointerdown", event => {
    if (event.target.closest("button")) return;
    const rect = root.getBoundingClientRect();
    moving = true;
    dx = event.clientX - rect.left;
    dy = event.clientY - rect.top;
    drag.setPointerCapture(event.pointerId);
  });
  drag.addEventListener("pointermove", event => {
    if (!moving) return;
    root.style.left = Math.max(0, Math.min(innerWidth - root.offsetWidth, event.clientX - dx)) + "px";
    root.style.top = Math.max(0, Math.min(innerHeight - 48, event.clientY - dy)) + "px";
    root.style.right = "auto";
    root.style.bottom = "auto";
  });
  drag.addEventListener("pointerup", () => moving = false);
  drag.addEventListener("pointercancel", () => moving = false);

  console.info("ConeUI Float loaded. Use the panel buttons to customize or remove it.");
})();