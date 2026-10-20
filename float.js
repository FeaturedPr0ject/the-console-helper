(() => {
  const ID = "coneui-liquid-float";
  document.getElementById(ID)?.remove();

  const host = document.createElement("div");
  host.id = ID;
  host.style.cssText = "all:initial;position:fixed;right:28px;top:28px;z-index:2147483647;color:#f5f5f7;font:13px/1.45 -apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;";
  const shadow = host.attachShadow({mode:"open"});
  shadow.innerHTML = `
    <style>
      *{box-sizing:border-box}
      .window{width:390px;max-width:calc(100vw - 24px);overflow:hidden;color:var(--text-primary);background:var(--panel-bg);border:1px solid var(--border-color);border-radius:16px;box-shadow:0 24px 80px #0003;backdrop-filter:blur(20px) saturate(140%);-webkit-backdrop-filter:blur(20px) saturate(140%)}
      .top{display:flex;align-items:center;gap:10px;padding:13px 15px;border-bottom:1px solid var(--border-color);cursor:move;user-select:none}
      .brand{font-weight:750;font-size:14px;background:linear-gradient(135deg,#667eea,#764ba2);color:transparent;background-clip:text}
      .sub{font-size:10px;opacity:.62}.spacer{flex:1}
      button{font:inherit;cursor:pointer;color:inherit}
      .x{border:1px solid var(--border-color);background:transparent;border-radius:8px;width:27px;height:27px;font-size:16px}
      .main{padding:15px;max-height:min(78vh,690px);overflow:auto}
      .eyebrow{text-transform:uppercase;letter-spacing:.14em;font-size:10px;opacity:.65;margin:0 0 12px}
      .stage{position:relative;height:210px;border:1px solid var(--border-color);border-radius:14px;overflow:hidden;background-color:var(--bg-secondary);background-image:linear-gradient(to right,#80808012 1px,transparent 1px),linear-gradient(to bottom,#80808012 1px,transparent 1px),radial-gradient(120% 100% at 10% 0%,var(--bg-primary),var(--bg-secondary));background-size:24px 24px,24px 24px,100% 100%;margin-bottom:17px}
      .art{position:absolute;inset:0;display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:17px}
      .label{font-size:9px;letter-spacing:.2em;color:#b45b5b;margin-bottom:9px}
      .heading{font-size:25px;font-weight:820;line-height:.98;letter-spacing:-.04em;margin:0 0 10px;color:var(--text-primary)}
      .copy{font-size:10px;line-height:1.55;color:var(--text-secondary)}
      .photo{border-radius:10px;background:linear-gradient(145deg,#a6b0b4,#56636c 42%,#e3d7c1 43%,#6c7b81 62%,#242d37);position:relative;overflow:hidden}
      .photo:before{content:"";position:absolute;inset:-30%;background:repeating-linear-gradient(110deg,transparent 0 18px,#ffffff30 19px 21px,transparent 22px 40px);transform:rotate(10deg)}
      .lens{position:absolute;left:22px;top:54px;width:154px;height:100px;border-radius:50px;overflow:hidden;touch-action:none;cursor:grab;border:1px solid #ffffffa0;background:linear-gradient(135deg,#ffffff32,#ffffff04 43%,#ffffff22);box-shadow:inset 0 1px 3px #ffffffaa,inset 0 -9px 18px #ffffff12,0 10px 30px #0003;backdrop-filter:blur(var(--blur,1px)) saturate(1.35);-webkit-backdrop-filter:blur(var(--blur,1px)) saturate(1.35)}
      .lens:before{content:"";position:absolute;inset:1px;border-radius:inherit;border:1px solid #ffffff40;background:linear-gradient(115deg,#ffffff3b,transparent 42%,transparent 68%,#ffffff22);pointer-events:none}
      .lens:after{content:"";position:absolute;left:18%;right:18%;top:5px;height:1px;background:linear-gradient(90deg,transparent,#fff,transparent)}
      .lensLabel{position:absolute;bottom:8px;left:10px;font-size:9px;letter-spacing:.12em;color:var(--text-secondary)}
      .section{display:flex;align-items:center;gap:10px;font-size:10px;text-transform:uppercase;letter-spacing:.15em;opacity:.7;margin:14px 0}
      .rule{height:1px;background:var(--border-color);flex:1}
      .row{display:flex;align-items:center;gap:10px;margin:12px 0}
      .row label{font-size:11px;width:130px;flex-shrink:0}
      output{font:10px ui-monospace,monospace;opacity:.65;width:48px;text-align:right}
      input[type=range]{flex:1;min-width:40px;accent-color:#7770d9}
      .selector{display:flex;gap:6px;flex-wrap:wrap}
      .btn{padding:7px 10px;border:1px solid var(--border-color);border-radius:8px;background:transparent;font-size:11px}
      .btn.active{background:linear-gradient(135deg,#667eea,#764ba2);color:white;border-color:transparent}
      .bottom{padding:10px 15px;border-top:1px solid var(--border-color);display:flex;justify-content:space-between;align-items:center;font-size:10px;opacity:.65}
      .dot{display:inline-block;width:6px;height:6px;border-radius:50%;background:#4bbf90;margin-right:6px}
      :host{--bg-primary:#f8fafc;--bg-secondary:#e7eeef;--text-primary:#1a1a2e;--text-secondary:rgba(0,0,0,.7);--border-color:rgba(0,0,0,.12);--panel-bg:rgba(255,255,255,.88)}
      @media(prefers-color-scheme:dark){:host{--bg-primary:#1b1b22;--bg-secondary:#0f0f14;--text-primary:#f0f0f5;--text-secondary:rgba(255,255,255,.7);--border-color:rgba(255,255,255,.12);--panel-bg:rgba(30,30,40,.88)}}
      @media(max-width:460px){.window{width:calc(100vw - 24px)}.art{grid-template-columns:1fr}.copy{display:none}.photo{display:none}.heading{font-size:21px}}
      @media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;transition:none!important}}
    </style>
    <section class="window">
      <header class="top" id="drag"><div><div class="brand">Liquid Glass</div><div class="sub">Refraction study · Floating UI</div></div><div class="spacer"></div><button class="x" id="min" title="Minimize">−</button><button class="x" id="close" title="Close">×</button></header>
      <main class="main" id="main">
        <p class="eyebrow">Interactive magnifying glass</p>
        <div class="stage" id="stage">
          <div class="art"><div><div class="label">OPTICS STUDY</div><h2 class="heading">Liquid Glass<br><span style="opacity:.4">—</span> Precision Lens</h2><div class="copy">Drag the lens across the scene. Adjust the material properties below.</div></div><div class="photo"></div></div>
          <div class="lens" id="lens"></div><div class="lensLabel">LIVE MATERIAL PREVIEW</div>
        </div>
        <div class="section">Surface type <span class="rule"></span></div>
        <div class="selector"><button class="btn active" data-shape="capsule">Convex Squircle</button><button class="btn" data-shape="round">Rounded Lens</button></div>
        <div class="section">Parameters <span class="rule"></span></div>
        <div class="row"><label for="blur">Optical blur</label><input id="blur" type="range" min="0" max="12" step=".5" value="1"><output id="blurValue">1.0 px</output></div>
        <div class="row"><label for="thickness">Glass thickness</label><input id="thickness" type="range" min="10" max="100" value="55"><output id="thickValue">55%</output></div>
        <div class="row"><label for="shine">Specular highlight</label><input id="shine" type="range" min="0" max="100" value="70"><output id="shineValue">70%</output></div>
        <div class="selector"><button class="btn" id="reset">Reset parameters</button><button class="btn" id="theme">Toggle theme</button></div>
      </main>
      <footer class="bottom"><span><i class="dot"></i>Local floating interface</span><span>LIQUID GLASS / 01</span></footer>
    </section>`;
  document.documentElement.appendChild(host);
  const $ = id => shadow.getElementById(id);
  const lens = $("lens"), stage = $("stage");
  $("blur").oninput = e => { lens.style.setProperty("--blur", e.target.value+"px"); $("blurValue").textContent = Number(e.target.value).toFixed(1)+" px"; };
  $("thickness").oninput = e => { const v=Number(e.target.value); lens.style.height=(65+v*.55)+"px"; lens.style.boxShadow="inset 0 1px 3px #ffffffaa,inset 0 -"+(v*.16)+"px "+(v*.32)+"px #ffffff17,0 10px 30px #0003"; $("thickValue").textContent=v+"%"; };
  $("shine").oninput = e => {const v=Number(e.target.value)/100;lens.style.background="linear-gradient(135deg,rgba(255,255,255,"+(v*.45)+"),rgba(255,255,255,.025) 43%,rgba(255,255,255,"+(v*.2)+"))";$("shineValue").textContent=e.target.value+"%";};
  shadow.querySelectorAll("[data-shape]").forEach(btn=>btn.onclick=()=>{shadow.querySelectorAll("[data-shape]").forEach(b=>b.classList.toggle("active",b===btn));lens.style.borderRadius=btn.dataset.shape==="capsule"?"50px":"24px";});
  $("reset").onclick=()=>{$("blur").value=1;$("blur").dispatchEvent(new Event("input"));$("thickness").value=55;$("thickness").dispatchEvent(new Event("input"));$("shine").value=70;$("shine").dispatchEvent(new Event("input"));lens.style.left="22px";lens.style.top="54px";};
  $("theme").onclick=()=>{const dark=host.dataset.dark!=="1";host.dataset.dark=dark?"1":"0";host.style.color=dark?"#f0f0f5":"#1a1a2e";host.style.setProperty("--bg-primary",dark?"#1b1b22":"#f8fafc");host.style.setProperty("--bg-secondary",dark?"#0f0f14":"#e7eeef");host.style.setProperty("--text-primary",dark?"#f0f0f5":"#1a1a2e");host.style.setProperty("--text-secondary",dark?"rgba(255,255,255,.7)":"rgba(0,0,0,.7)");host.style.setProperty("--border-color",dark?"rgba(255,255,255,.12)":"rgba(0,0,0,.12)");host.style.setProperty("--panel-bg",dark?"rgba(30,30,40,.9)":"rgba(255,255,255,.9)");};
  $("min").onclick=()=>{$("main").hidden=!$("main").hidden;$("min").textContent=$("main").hidden?"+":"−";};
  $("close").onclick=()=>host.remove();
  let dragOn=false,dx=0,dy=0;
  $("drag").onpointerdown=e=>{if(e.target.closest("button"))return;const r=host.getBoundingClientRect();dragOn=true;dx=e.clientX-r.left;dy=e.clientY-r.top;$("drag").setPointerCapture(e.pointerId);};
  $("drag").onpointermove=e=>{if(!dragOn)return;host.style.left=Math.max(0,Math.min(innerWidth-host.offsetWidth,e.clientX-dx))+"px";host.style.top=Math.max(0,Math.min(innerHeight-40,e.clientY-dy))+"px";host.style.right="auto";};
  $("drag").onpointerup=$("drag").onpointercancel=()=>dragOn=false;
  let lensDrag=false,lx=0,ly=0;
  lens.onpointerdown=e=>{lensDrag=true;const r=lens.getBoundingClientRect();lx=e.clientX-r.left;ly=e.clientY-r.top;lens.setPointerCapture(e.pointerId);};
  lens.onpointermove=e=>{if(!lensDrag)return;const r=stage.getBoundingClientRect();lens.style.left=Math.max(0,Math.min(r.width-lens.offsetWidth,e.clientX-r.left-lx))+"px";lens.style.top=Math.max(0,Math.min(r.height-lens.offsetHeight,e.clientY-r.top-ly))+"px";};
  lens.onpointerup=lens.onpointercancel=()=>lensDrag=false;
  console.info("ConeUI Liquid Glass loaded. CSS-inspired original floating panel.");
})();