(() => {
  const ID = "coneui-liquid-float";
  document.getElementById(ID)?.remove();

  const host = document.createElement("div");
  host.id = ID;
  host.style.cssText = "all:initial;position:fixed;left:24px;top:24px;z-index:2147483647;color:#f5f5f7;font:13px/1.45 Inter,ui-sans-serif,system-ui,sans-serif;";
  const root = host.attachShadow({mode:"open"});
  root.innerHTML = `
    <style>
      *{box-sizing:border-box}
      .window{width:360px;max-width:calc(100vw - 24px);overflow:hidden;border:1px solid #ffffff25;border-radius:22px;background:rgba(22,23,28,.78);backdrop-filter:blur(24px) saturate(145%);-webkit-backdrop-filter:blur(24px) saturate(145%);box-shadow:0 22px 70px #0005,inset 0 1px #ffffff14;color:#f5f5f7}
      .head{height:52px;display:flex;align-items:center;gap:10px;padding:0 15px;border-bottom:1px solid #ffffff16;cursor:move;user-select:none;background:linear-gradient(120deg,#ffffff0a,transparent)}
      .brandIcon{width:28px;height:28px;border:1px solid #ffffff25;border-radius:10px;background:linear-gradient(145deg,#ffffff40,#ffffff08);box-shadow:inset 0 1px #ffffff50;display:grid;place-items:center;font-size:15px}
      .title{font-weight:650;font-size:13px;letter-spacing:.1px}.subtitle{font-size:10px;color:#a7a7b2;margin-top:1px}.spacer{flex:1}
      button{font:inherit;color:inherit;cursor:pointer}
      .icon{width:28px;height:28px;border:1px solid #ffffff1c;border-radius:9px;background:#ffffff0a;font-size:16px;display:grid;place-items:center}
      .icon:hover,.btn:hover{background:#ffffff1b}
      .content{padding:15px}
      .eyebrow{font-size:10px;text-transform:uppercase;letter-spacing:1.4px;color:#9d9da9;font-weight:700;margin:0 0 10px}
      .preview{height:155px;border-radius:16px;position:relative;overflow:hidden;background:#292b31;border:1px solid #ffffff20;margin-bottom:16px}
      .scene{position:absolute;inset:0;background:radial-gradient(ellipse at 20% 30%,#d8d3c7 0 3%,transparent 4%),linear-gradient(130deg,transparent 0 25%,#c4bdb0 25.5% 27%,transparent 27.5% 47%,#eee9de 47.5% 50%,transparent 50.5%),linear-gradient(25deg,#242831,#555762 48%,#a6a6a5);background-size:auto,100% 100%,100% 100%}
      .scene:before{content:"";position:absolute;inset:0;background:repeating-linear-gradient(90deg,transparent 0 31px,#ffffff20 32px 34px),repeating-linear-gradient(0deg,transparent 0 27px,#00000020 28px 30px);transform:perspective(220px) rotateX(14deg) scale(1.3)}
      .lens{position:absolute;left:48px;top:32px;width:154px;height:92px;border-radius:48px;border:1px solid #ffffffa0;background:linear-gradient(135deg,#ffffff35,#ffffff04 45%,#ffffff1b);box-shadow:inset 0 1px 3px #ffffffa0,inset 0 -8px 18px #ffffff0b,0 10px 25px #0005;backdrop-filter:blur(var(--lens-blur,2px)) saturate(1.7);-webkit-backdrop-filter:blur(var(--lens-blur,2px)) saturate(1.7);transform:translateZ(0)}
      .lens:before{content:"";position:absolute;inset:1px;border-radius:inherit;border:1px solid #ffffff28;background:linear-gradient(115deg,#ffffff30,transparent 38%,transparent 70%,#ffffff17);pointer-events:none}
      .lens:after{content:"";position:absolute;left:16%;right:16%;top:5px;height:1px;background:linear-gradient(90deg,transparent,#ffffffb0,transparent)}
      .previewLabel{position:absolute;bottom:10px;left:12px;font-size:10px;color:#ffffffb8;letter-spacing:.5px;text-shadow:0 1px 5px #000}
      .sectionHead{display:flex;align-items:center;gap:10px;margin:13px 0 12px;color:#b8b8c2;font-size:10px;letter-spacing:1.3px;text-transform:uppercase;font-weight:700}
      .line{height:1px;background:#ffffff18;flex:1}
      .control{margin:13px 0}
      .labelRow{display:flex;justify-content:space-between;align-items:center;margin-bottom:7px;color:#e2e2e8;font-size:11px}
      output{color:#a9a2ff;font-variant-numeric:tabular-nums}
      input[type=range]{width:100%;accent-color:#b6b0ff;height:4px;cursor:pointer}
      .segmented{display:grid;grid-template-columns:1fr 1fr;gap:6px}
      .btn{padding:9px 10px;border-radius:10px;border:1px solid #ffffff18;background:#ffffff08;font-size:11px;transition:background .15s,border-color .15s}
      .btn.active{background:#b5aaff20;border-color:#b9b0ff70;color:#e4e0ff}
      .foot{display:flex;align-items:center;justify-content:space-between;padding:11px 15px;border-top:1px solid #ffffff16;color:#92929f;font-size:10px}
      .status{display:flex;align-items:center;gap:6px}.dot{width:6px;height:6px;background:#a9e5c5;border-radius:50%;box-shadow:0 0 8px #8ce9b577}
      @media(prefers-reduced-motion:reduce){*{transition:none!important}}
    </style>
    <section class="window">
      <header class="head" id="drag">
        <div class="brandIcon">◈</div>
        <div><div class="title">Liquid Glass</div><div class="subtitle">Optics · Floating controls</div></div>
        <div class="spacer"></div>
        <button class="icon" id="min" aria-label="Minimize">−</button>
        <button class="icon" id="close" aria-label="Close">×</button>
      </header>
      <div id="body" class="content">
        <div class="preview" id="preview">
          <div class="scene"></div>
          <div class="lens" id="lens"></div>
          <div class="previewLabel">LIVE MATERIAL PREVIEW</div>
        </div>
        <div class="sectionHead">Surface type <span class="line"></span></div>
        <div class="segmented">
          <button class="btn active" data-shape="pill">Convex Squircle</button>
          <button class="btn" data-shape="round">Rounded Lens</button>
        </div>
        <div class="sectionHead">Parameters <span class="line"></span></div>
        <div class="control"><div class="labelRow"><label for="blur">Optical softness</label><output id="blurOut">2.0 px</output></div><input id="blur" type="range" min="0" max="12" step=".5" value="2"></div>
        <div class="control"><div class="labelRow"><label for="thickness">Glass thickness</label><output id="thickOut">55%</output></div><input id="thickness" type="range" min="10" max="100" value="55"></div>
        <div class="control"><div class="labelRow"><label for="shine">Specular highlight</label><output id="shineOut">70%</output></div><input id="shine" type="range" min="0" max="100" value="70"></div>
        <div class="segmented">
          <button class="btn active" id="reset">Reset values</button>
          <button class="btn" id="moveLens">Move lens</button>
        </div>
      </div>
      <footer class="foot"><span class="status"><span class="dot"></span>Local floating UI</span><span>GLASS / 01</span></footer>
    </section>
  `;
  document.documentElement.appendChild(host);

  const $ = id => root.getElementById(id);
  const lens = $("lens");
  $("blur").addEventListener("input", e => {
    lens.style.setProperty("--lens-blur", e.target.value + "px");
    $("blurOut").textContent = Number(e.target.value).toFixed(1) + " px";
  });
  $("thickness").addEventListener("input", e => {
    const v = Number(e.target.value);
    lens.style.height = (64 + v * .5) + "px";
    lens.style.boxShadow = "inset 0 1px 3px #ffffffa0,inset 0 -8px " + (v*.35) + "px #ffffff18,0 10px 25px #0005";
    $("thickOut").textContent = v + "%";
  });
  $("shine").addEventListener("input", e => {
    const v = Number(e.target.value)/100;
    lens.style.background = "linear-gradient(135deg,rgba(255,255,255,"+(v*.5)+"),rgba(255,255,255,.02) 45%,rgba(255,255,255,"+(v*.22)+"))";
    $("shineOut").textContent = e.target.value + "%";
  });
  root.querySelectorAll("[data-shape]").forEach(btn => btn.addEventListener("click", () => {
    root.querySelectorAll("[data-shape]").forEach(b => b.classList.toggle("active", b === btn));
    lens.style.borderRadius = btn.dataset.shape === "pill" ? "48px" : "24px";
  }));
  $("reset").onclick = () => {
    $("blur").value = 2; $("blur").dispatchEvent(new Event("input"));
    $("thickness").value = 55; $("thickness").dispatchEvent(new Event("input"));
    $("shine").value = 70; $("shine").dispatchEvent(new Event("input"));
    lens.style.left = "48px"; lens.style.top = "32px";
  };
  let lensMoved = false;
  $("moveLens").onclick = () => {
    lensMoved = !lensMoved;
    lens.style.left = lensMoved ? "150px" : "48px";
    lens.style.top = lensMoved ? "18px" : "32px";
  };
  $("min").onclick = () => {
    $("body").hidden = !$("body").hidden;
    $("min").textContent = $("body").hidden ? "+" : "−";
  };
  $("close").onclick = () => host.remove();

  const head = $("drag");
  let dragging = false, dx = 0, dy = 0;
  head.addEventListener("pointerdown", e => {
    if (e.target.closest("button")) return;
    const r = host.getBoundingClientRect();
    dragging = true; dx = e.clientX-r.left; dy = e.clientY-r.top;
    head.setPointerCapture(e.pointerId);
  });
  head.addEventListener("pointermove", e => {
    if (!dragging) return;
    host.style.left = Math.max(0,Math.min(innerWidth-host.offsetWidth,e.clientX-dx))+"px";
    host.style.top = Math.max(0,Math.min(innerHeight-50,e.clientY-dy))+"px";
  });
  head.addEventListener("pointerup", () => dragging = false);
  head.addEventListener("pointercancel", () => dragging = false);
  console.info("ConeUI Liquid Glass Float loaded.");
})();