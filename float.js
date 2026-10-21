(() => {
  const ID = "coneui-liquid-glass-float";
  const STYLE_ID = "coneui-liquid-glass-style";
  document.getElementById(ID)?.remove();
  document.getElementById(STYLE_ID)?.remove();

  const host = document.createElement("div");
  host.id = ID;
  host.style.cssText = "all:initial;position:fixed;right:24px;top:24px;z-index:2147483647;pointer-events:none;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;";

  const markup = [
    '<section class="cg-window" id="cg-window">',
    '<div class="cg-glass-surface" id="cg-glass-surface"></div>',
    '<svg class="cg-filter-defs" aria-hidden="true"><defs>',
    '<filter id="coneui-liquid-filter" x="-15%" y="-15%" width="130%" height="130%" color-interpolation-filters="sRGB">',
    '<feGaussianBlur id="cg-filter-blur" in="SourceGraphic" stdDeviation="0.5" result="blurred"/>',
    '<feImage id="cg-displacement-image" href="" x="0" y="0" width="420" height="520" result="displacement_map" preserveAspectRatio="none"/>',
    '<feDisplacementMap id="cg-displacement-filter" in="blurred" in2="displacement_map" scale="80" xChannelSelector="R" yChannelSelector="G" result="displaced"/>',
    '<feColorMatrix in="displaced" type="saturate" values="1.3" result="displaced_saturated"/>',
    '<feImage id="cg-specular-image" href="" x="0" y="0" width="420" height="520" result="specular_layer" preserveAspectRatio="none"/>',
    '<feComponentTransfer in="specular_layer" result="specular_faded"><feFuncA id="cg-specular-alpha" type="linear" slope="0.7"/></feComponentTransfer>',
    '<feBlend in="specular_faded" in2="displaced_saturated" mode="screen"/>',
    '</filter></defs></svg>',
    '<div class="cg-content" id="cg-content">',
    '<header class="cg-header" id="cg-drag"><div class="cg-mark">◈</div><div class="cg-heading"><div class="cg-title">Liquid Glass</div><div class="cg-subtitle">Optical material controls</div></div><div class="cg-spacer"></div><button class="cg-icon-button" id="cg-min" title="Minimize">−</button><button class="cg-icon-button" id="cg-close" title="Close">×</button></header>',
    '<nav class="cg-tabs"><button class="cg-tab cg-active" data-page="material">Material</button><button class="cg-tab" data-page="appearance">Appearance</button></nav>',
    '<main class="cg-main" id="cg-main">',
    '<section class="cg-page" id="cg-page-material">',
    '<div class="cg-intro"><span class="cg-intro-icon">✧</span><div><div class="cg-intro-title">Liquid Glass material</div><div class="cg-intro-copy">Change the optical profile and render the effect on this floating panel. No website is embedded.</div></div></div>',
    '<div class="cg-controls-panel"><div class="cg-controls-header"><span class="cg-controls-header-text">Surface profile</span><span class="cg-controls-header-line"></span></div>',
    '<div class="cg-surface-selector"><button class="cg-surface-btn cg-active" data-surface="convex_squircle">Convex Squircle</button><button class="cg-surface-btn" data-surface="convex_circle">Convex Circle</button><button class="cg-surface-btn" data-surface="concave">Concave</button><button class="cg-surface-btn" data-surface="lip">Soft Lip</button></div>',
    '<div class="cg-controls-header cg-spaced"><span class="cg-controls-header-text">Optical parameters</span><span class="cg-controls-header-line"></span></div>',
    '<div class="cg-control-row"><label class="cg-control-label" for="cg-bezel">Bezel width</label><input class="cg-control-slider" id="cg-bezel" type="range" min="3" max="18" value="10" step="1"><output class="cg-control-value" id="cg-bezel-value">10 px</output></div>',
    '<div class="cg-control-row"><label class="cg-control-label" for="cg-thickness">Glass thickness</label><input class="cg-control-slider" id="cg-thickness" type="range" min="20" max="240" value="150" step="5"><output class="cg-control-value" id="cg-thickness-value">150</output></div>',
    '<div class="cg-control-row"><label class="cg-control-label" for="cg-index">Refractive index</label><input class="cg-control-slider" id="cg-index" type="range" min="1.1" max="2.2" value="1.5" step="0.05"><output class="cg-control-value" id="cg-index-value">1.50</output></div>',
    '<div class="cg-control-row"><label class="cg-control-label" for="cg-refraction">Refraction scale</label><input class="cg-control-slider" id="cg-refraction" type="range" min="0.2" max="3.5" value="1.5" step="0.1"><output class="cg-control-value" id="cg-refraction-value">1.50</output></div>',
    '<div class="cg-control-row"><label class="cg-control-label" for="cg-specular">Specular opacity</label><input class="cg-control-slider" id="cg-specular" type="range" min="0" max="1.5" value="0.7" step="0.05"><output class="cg-control-value" id="cg-specular-value">0.70</output></div>',
    '<div class="cg-control-row"><label class="cg-control-label" for="cg-blur">Optical blur</label><input class="cg-control-slider" id="cg-blur" type="range" min="0" max="3" value="0.5" step="0.1"><output class="cg-control-value" id="cg-blur-value">0.5</output></div>',
    '<div class="cg-actions"><button class="cg-action-button" id="cg-reset-optical">Reset parameters</button><button class="cg-action-button cg-primary" id="cg-rerender">Render material</button></div></div></section>',
    '<section class="cg-page" id="cg-page-appearance" hidden><div class="cg-controls-panel">',
    '<div class="cg-controls-header"><span class="cg-controls-header-text">Glass appearance</span><span class="cg-controls-header-line"></span></div>',
    '<div class="cg-control-row"><label class="cg-control-label" for="cg-ui-blur">Fallback blur</label><input class="cg-control-slider" id="cg-ui-blur" type="range" min="0" max="36" value="18" step="1"><output class="cg-control-value" id="cg-ui-blur-value">18 px</output></div>',
    '<div class="cg-control-row"><label class="cg-control-label" for="cg-opacity">Glass tint</label><input class="cg-control-slider" id="cg-opacity" type="range" min="4" max="55" value="18" step="1"><output class="cg-control-value" id="cg-opacity-value">18%</output></div>',
    '<div class="cg-control-row"><label class="cg-control-label" for="cg-radius">Corner radius</label><input class="cg-control-slider" id="cg-radius" type="range" min="14" max="42" value="24" step="1"><output class="cg-control-value" id="cg-radius-value">24 px</output></div>',
    '<div class="cg-controls-header cg-spaced"><span class="cg-controls-header-text">Color scheme</span><span class="cg-controls-header-line"></span></div>',
    '<div class="cg-surface-selector"><button class="cg-surface-btn cg-active" id="cg-dark">Dark Glass</button><button class="cg-surface-btn" id="cg-light">Light Glass</button></div>',
    '<div class="cg-render-status" id="cg-render-status">Preparing SVG renderer…</div>',
    '<div class="cg-actions"><button class="cg-action-button" id="cg-reset-all">Reset all settings</button><button class="cg-action-button cg-primary" id="cg-center">Restore position</button></div>',
    '</div></section></main>',
    '<footer class="cg-footer"><span class="cg-status"><i class="cg-dot"></i><span id="cg-status-text">Liquid Glass renderer</span></span><span>LIQUID GLASS · 01</span></footer>',
    '</div></section>'
  ].join("");

  host.innerHTML = markup;

  const style = document.createElement("style");
  style.id = STYLE_ID;
  const prefix = "#" + ID;
  style.textContent = [
    prefix+" .cg-window{--bg-primary:#f8fafc;--bg-secondary:#e7eeef;--text-primary:#1a1a2e;--text-secondary:rgba(0,0,0,.7);--border-color:rgba(0,0,0,.1);--panel-bg:rgba(255,255,255,.68);--accent:#667eea;position:relative;isolation:isolate;width:420px;max-width:calc(100vw - 24px);max-height:calc(100vh - 32px);overflow:hidden;border:1px solid var(--border-color);border-radius:16px;color:var(--text-primary);box-shadow:0 24px 80px rgba(0,0,0,.32),inset 0 1px rgba(255,255,255,.12);pointer-events:auto}",
    prefix+" .cg-glass-surface{position:absolute;inset:0;z-index:0;pointer-events:none;border-radius:inherit;border:1px solid rgba(255,255,255,.16);background:var(--panel-bg);backdrop-filter:blur(var(--cg-fallback-blur,18px)) saturate(145%);-webkit-backdrop-filter:blur(var(--cg-fallback-blur,18px)) saturate(145%)}",
    prefix+" .cg-window.cg-native .cg-glass-surface{backdrop-filter:url(#coneui-liquid-filter);-webkit-backdrop-filter:url(#coneui-liquid-filter)}",
    prefix+" .cg-filter-defs{position:absolute;width:0;height:0;overflow:hidden;pointer-events:none}",
    prefix+" .cg-content{position:relative;z-index:1;display:flex;flex-direction:column;max-height:calc(100vh - 34px)}",
    prefix+" .cg-header{height:58px;flex-shrink:0;display:flex;align-items:center;gap:11px;padding:0 15px;border-bottom:1px solid var(--border-color);background:linear-gradient(120deg,rgba(255,255,255,.12),transparent 72%);cursor:move;user-select:none}",
    prefix+" .cg-mark{width:31px;height:31px;display:grid;place-items:center;border-radius:11px;border:1px solid rgba(255,255,255,.32);background:linear-gradient(145deg,rgba(255,255,255,.38),rgba(255,255,255,.04));box-shadow:inset 0 1px rgba(255,255,255,.4);font-size:16px}",
    prefix+" .cg-heading{min-width:0}"+prefix+" .cg-title{font-size:14px;font-weight:750;letter-spacing:-.2px}"+prefix+" .cg-subtitle{font-size:10px;color:var(--text-secondary);margin-top:2px}"+prefix+" .cg-spacer{flex:1}",
    prefix+" button{font:inherit;color:inherit;cursor:pointer}",
    prefix+" .cg-icon-button{width:29px;height:29px;display:grid;place-items:center;border-radius:9px;border:1px solid var(--border-color);background:rgba(255,255,255,.08);font-size:16px}",
    prefix+" .cg-icon-button:hover,"+prefix+" .cg-action-button:hover{background:rgba(255,255,255,.18)}",
    prefix+" .cg-tabs{display:flex;gap:4px;padding:10px 14px 0;flex-shrink:0}",
    prefix+" .cg-tab{border:1px solid transparent;background:transparent;color:var(--text-secondary);border-radius:8px;padding:8px 13px;font-size:11px}",
    prefix+" .cg-tab.cg-active{color:var(--text-primary);background:rgba(255,255,255,.16);border-color:var(--border-color)}",
    prefix+" .cg-main{overflow:auto;min-height:0;max-height:calc(100vh - 145px);padding:15px}",
    prefix+" .cg-page[hidden]{display:none!important}",
    prefix+" .cg-intro{display:flex;align-items:flex-start;gap:11px;margin-bottom:14px;padding:12px;border:1px solid rgba(102,126,234,.22);border-radius:12px;background:linear-gradient(135deg,rgba(102,126,234,.10),rgba(118,75,162,.10))}",
    prefix+" .cg-intro-icon{width:28px;height:28px;flex-shrink:0;display:grid;place-items:center;border-radius:9px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;font-size:16px}",
    prefix+" .cg-intro-title{font-size:12px;font-weight:650;margin-bottom:3px}"+prefix+" .cg-intro-copy{font-size:10px;line-height:1.5;color:var(--text-secondary)}",
    prefix+" .cg-controls-panel{background:var(--panel-bg);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-radius:12px;border:1px solid var(--border-color);padding:16px}",
    prefix+" .cg-controls-header{display:flex;align-items:center;gap:1rem;margin-bottom:14px}",
    prefix+" .cg-controls-header-text{text-transform:uppercase;letter-spacing:.14em;font-size:10px;opacity:.7}"+prefix+" .cg-controls-header-line{flex:1;height:1px;background:var(--border-color)}"+prefix+" .cg-spaced{margin-top:22px}",
    prefix+" .cg-control-row{display:flex;align-items:center;gap:12px;margin-bottom:15px}"+prefix+" .cg-control-row:last-child{margin-bottom:0}",
    prefix+" .cg-control-label{width:128px;text-transform:uppercase;letter-spacing:.06em;font-size:10px;opacity:.84;flex-shrink:0}",
    prefix+" .cg-control-value{width:45px;text-align:right;font-family:'SF Mono',Monaco,'Cascadia Code',monospace;font-size:10px;opacity:.65;font-variant-numeric:tabular-nums;flex-shrink:0}",
    prefix+" .cg-control-slider{flex:1;min-width:35px;-webkit-appearance:none;appearance:none;height:2px;background:rgba(128,128,128,.26);border-radius:1px;outline:none}",
    prefix+" .cg-control-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:14px;height:14px;border-radius:50%;background:linear-gradient(135deg,#667eea,#764ba2);cursor:pointer;transition:transform .15s ease}",
    prefix+" .cg-control-slider::-webkit-slider-thumb:hover{transform:scale(1.18)}"+prefix+" .cg-control-slider::-moz-range-thumb{width:14px;height:14px;border-radius:50%;background:linear-gradient(135deg,#667eea,#764ba2);cursor:pointer;border:0}",
    prefix+" .cg-surface-selector{display:flex;gap:7px;flex-wrap:wrap}",
    prefix+" .cg-surface-btn{flex:1;min-width:110px;padding:8px 9px;border:1px solid var(--border-color);border-radius:8px;background:transparent;color:var(--text-primary);font-size:10px;cursor:pointer;transition:all .15s ease}",
    prefix+" .cg-surface-btn:hover{background:rgba(102,126,234,.1);border-color:#667eea}"+prefix+" .cg-surface-btn.cg-active{background:linear-gradient(135deg,#667eea,#764ba2);color:white;border-color:transparent}",
    prefix+" .cg-actions{display:flex;gap:8px;margin-top:16px}"+prefix+" .cg-action-button{flex:1;padding:9px 10px;border:1px solid var(--border-color);border-radius:8px;background:rgba(255,255,255,.06);font-size:10px}",
    prefix+" .cg-action-button.cg-primary{background:linear-gradient(135deg,#667eea,#764ba2);border-color:transparent;color:#fff}",
    prefix+" .cg-render-status{margin-top:16px;padding:10px 11px;border-radius:9px;border:1px solid var(--border-color);background:rgba(255,255,255,.05);font-size:10px;line-height:1.5;color:var(--text-secondary)}",
    prefix+" .cg-footer{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px 15px;border-top:1px solid var(--border-color);font-size:9px;color:var(--text-secondary);flex-shrink:0}",
    prefix+" .cg-status{display:flex;align-items:center;gap:6px}"+prefix+" .cg-dot{height:6px;width:6px;border-radius:50%;background:#76ddb1;box-shadow:0 0 8px #76ddb177}",
    prefix+" .cg-light .cg-window{--bg-primary:#f8fafc;--bg-secondary:#e7eeef;--text-primary:#1a1a2e;--text-secondary:rgba(0,0,0,.7);--border-color:rgba(0,0,0,.1);--panel-bg:rgba(255,255,255,.68)}",
    prefix+".cg-light .cg-window{--bg-primary:#f8fafc;--bg-secondary:#e7eeef;--text-primary:#1a1a2e;--text-secondary:rgba(0,0,0,.7);--border-color:rgba(0,0,0,.1);--panel-bg:rgba(255,255,255,.68)}",
    prefix+".cg-light .cg-header{background:linear-gradient(120deg,rgba(255,255,255,.55),transparent 72%)}",
    prefix+".cg-light .cg-icon-button,"+prefix+".cg-light .cg-action-button{background:rgba(255,255,255,.22)}",
    prefix+" .cg-hidden{display:none!important}",
    "@media(max-width:500px){"+prefix+" .cg-window{width:calc(100vw - 16px);max-width:calc(100vw - 16px)}"+prefix+" .cg-control-label{width:105px;font-size:9px}"+prefix+" .cg-control-row{gap:8px}"+prefix+" .cg-main{padding:12px}"+prefix+" .cg-controls-panel{padding:12px}}",
    "@media(prefers-reduced-motion:reduce){"+prefix+" *{scroll-behavior:auto!important;transition:none!important}}"
  ].join("\n");
  document.head.appendChild(style);
  document.documentElement.appendChild(host);

  const $ = id => host.querySelector("#" + id);
  const panel = $("cg-window");
  const surface = $("cg-glass-surface");
  const state = { surfaceType:"convex_squircle", bezelWidth:10, glassThickness:150, refractiveIndex:1.5, refractionScale:1.5, specularOpacity:.7, blur:.5, uiBlur:18, opacity:18, radius:24, theme:"light" };
  const clamp = (n,a,b) => Math.max(a,Math.min(b,n));
  const SurfaceEquations = {
    convex_circle:x=>Math.sqrt(Math.max(0,1-Math.pow(1-x,2))),
    convex_squircle:x=>Math.pow(Math.max(0,1-Math.pow(1-x,4)),.25),
    concave:x=>1-Math.sqrt(Math.max(0,1-x*x)),
    lip:x=>{const c=Math.pow(Math.max(0,1-Math.pow(1-Math.min(x*2,1),4)),.25);const n=1-Math.sqrt(Math.max(0,1-Math.pow(1-x,2)))+.1;const t=6*Math.pow(x,5)-15*Math.pow(x,4)+10*Math.pow(x,3);return c*(1-t)+n*t;}
  };
  function dataURL(imageData){const c=document.createElement("canvas");c.width=imageData.width;c.height=imageData.height;c.getContext("2d").putImageData(imageData,0,0);return c.toDataURL("image/png");}
  function displacement1D(){const eta=1/state.refractiveIndex,fn=SurfaceEquations[state.surfaceType],out=[];for(let i=0;i<128;i++){const x=i/128,y=fn(x),dx=x<1?.0001:-.0001,x2=clamp(x+dx,0,1),der=(fn(x2)-y)/(x2-x||dx),mag=Math.sqrt(der*der+1),nx=-der/mag,ny=-1/mag,dot=ny,k=1-eta*eta*(1-dot*dot);if(k<0){out.push(0);continue;}const root=Math.sqrt(k),rx=-(eta*dot+root)*nx,ry=eta-(eta*dot+root)*ny;if(!Number.isFinite(rx)||!Number.isFinite(ry)||Math.abs(ry)<.00001){out.push(0);continue;}out.push(clamp(rx*((y*state.bezelWidth+state.glassThickness)/ry),-1000,1000));}return out;}
  function buildMap(width,height,profile){const w=Math.max(1,Math.round(width*.5)),h=Math.max(1,Math.round(height*.5)),c=document.createElement("canvas");c.width=w;c.height=h;const ctx=c.getContext("2d",{willReadFrequently:true}),im=ctx.createImageData(w,h);for(let i=0;i<im.data.length;i+=4){im.data[i]=128;im.data[i+1]=128;im.data[i+3]=255;}const r=Math.min(state.radius*.5,h/2,w/2),r2=r*r,plus=(r+1)*(r+1),inner=Math.max(0,(r-state.bezelWidth*.5)*(r-state.bezelWidth*.5)),gx=w-2*r,gy=h-2*r,max=Math.max(1,...profile.map(Math.abs));for(let y=0;y<h;y++){for(let x=0;x<w;x++){const px=x<r?x-r:x>=w-r?x-r-gx:0,py=y<r?y-r:y>=h-r?y-r-gy:0,d2=px*px+py*py;if(d2>plus||d2<inner)continue;const d=Math.sqrt(d2),opacity=d2<r2?1:1-(d-r)/(Math.sqrt(plus)-r),ratio=clamp((r-d)/Math.max(1,state.bezelWidth*.5),0,1),idx=clamp(Math.floor(ratio*profile.length),0,profile.length-1),disp=profile[idx]||0,dx=-(d>0?px/d:0)*disp/max,dy=-(d>0?py/d:0)*disp/max,o=(y*w+x)*4;im.data[o]=clamp(128+dx*127*opacity,0,255);im.data[o+1]=clamp(128+dy*127*opacity,0,255);}}return {im,w,h};}
  function buildSpecular(width,height){const w=Math.max(1,Math.round(width*.5)),h=Math.max(1,Math.round(height*.5)),c=document.createElement("canvas");c.width=w;c.height=h;const ctx=c.getContext("2d",{willReadFrequently:true}),im=ctx.createImageData(w,h),r=Math.min(state.radius*.5,h/2,w/2),plus=(r+1)*(r+1),inner=Math.max(0,(r-1.5)*(r-1.5)),gx=w-2*r,gy=h-2*r,vx=Math.cos(Math.PI/3),vy=Math.sin(Math.PI/3);for(let y=0;y<h;y++){for(let x=0;x<w;x++){const px=x<r?x-r:x>=w-r?x-r-gx:0,py=y<r?y-r:y>=h-r?y-r-gy:0,d2=px*px+py*py;if(d2>plus||d2<inner)continue;const d=Math.sqrt(d2),opacity=d2<r*r?1:1-(d-r)/(Math.sqrt(plus)-r),cos=d>0?px/d:0,sin=d>0?-py/d:0,dot=Math.abs(cos*vx+sin*vy),edge=clamp((r-d)/1.5,0,1),fall=Math.sqrt(Math.max(0,1-Math.pow(1-edge,2))),co=dot*fall,col=Math.min(255,255*co),alpha=Math.min(255,col*co*opacity),o=(y*w+x)*4;im.data[o]=col;im.data[o+1]=col;im.data[o+2]=col;im.data[o+3]=alpha;}}return {im,w,h};}
  let frame=0;
  function render(){if(frame)cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{frame=0;const w=Math.max(120,panel.clientWidth),h=Math.max(160,panel.clientHeight);state.radius=clamp(state.radius,14,Math.floor(Math.min(w,h)/2));const profile=displacement1D(),map=buildMap(w,h,profile),spec=buildSpecular(w,h),di=$("cg-displacement-image"),si=$("cg-specular-image");di.setAttribute("href",dataURL(map.im));di.setAttribute("width",map.w);di.setAttribute("height",map.h);si.setAttribute("href",dataURL(spec.im));si.setAttribute("width",spec.w);si.setAttribute("height",spec.h);$("cg-displacement-filter").setAttribute("scale",Math.max(...profile.map(Math.abs))*state.refractionScale);$("cg-filter-blur").setAttribute("stdDeviation",state.blur);$("cg-specular-alpha").setAttribute("slope",state.specularOpacity);updateAppearance();});}
  function updateAppearance(){panel.style.setProperty("--cg-fallback-blur",state.uiBlur+"px");panel.style.setProperty("--panel-bg",state.theme==="dark"?"rgba(30,30,40,"+(state.opacity/100)+")":"rgba(255,255,255,"+(state.opacity/100)+")");panel.style.borderRadius=state.radius+"px";surface.style.borderRadius=state.radius+"px";}
  function showVal(id,suffix,digits){const v=Number($(id).value);$(id+"-value").textContent=(digits===undefined?String(v):v.toFixed(digits))+suffix;}
  const controls=[["cg-bezel"," px",0,"bezelWidth"],["cg-thickness","",0,"glassThickness"],["cg-index","",2,"refractiveIndex"],["cg-refraction","",2,"refractionScale"],["cg-specular","",2,"specularOpacity"],["cg-blur","",1,"blur"]];
  controls.forEach(([id,suffix,digits,key])=>$(id).addEventListener("input",()=>{state[key]=Number($(id).value);if(key==="bezelWidth")state.bezelWidth=clamp(state.bezelWidth,3,Math.floor(state.radius/2));showVal(id,suffix,digits);render();}));
  $("cg-ui-blur").addEventListener("input",()=>{state.uiBlur=Number($("cg-ui-blur").value);showVal("cg-ui-blur"," px",0);updateAppearance();});
  $("cg-opacity").addEventListener("input",()=>{state.opacity=Number($("cg-opacity").value);showVal("cg-opacity","%",0);updateAppearance();});
  $("cg-radius").addEventListener("input",()=>{state.radius=Number($("cg-radius").value);showVal("cg-radius"," px",0);render();});
  host.querySelectorAll("[data-surface]").forEach(b=>b.addEventListener("click",()=>{host.querySelectorAll("[data-surface]").forEach(x=>x.classList.toggle("cg-active",x===b));state.surfaceType=b.dataset.surface;render();}));
  function theme(t){state.theme=t;host.classList.toggle("cg-light",t==="light");$("cg-dark").classList.toggle("cg-active",t==="dark");$("cg-light").classList.toggle("cg-active",t==="light");updateAppearance();}
  $("cg-dark").onclick=()=>theme("dark");$("cg-light").onclick=()=>theme("light");
  function page(p){$("cg-page-material").hidden=p!=="material";$("cg-page-appearance").hidden=p!=="appearance";host.querySelectorAll("[data-page]").forEach(t=>t.classList.toggle("cg-active",t.dataset.page===p));}
  host.querySelectorAll("[data-page]").forEach(t=>t.onclick=()=>page(t.dataset.page));
  $("cg-min").onclick=()=>{const off=!$("cg-main").classList.contains("cg-hidden");$("cg-main").classList.toggle("cg-hidden",off);host.querySelector(".cg-tabs").classList.toggle("cg-hidden",off);$("cg-min").textContent=off?"+":"−";render();};
  $("cg-close").onclick=()=>{host.remove();style.remove();};
  function resetOptical(){const d={"cg-bezel":10,"cg-thickness":150,"cg-index":1.5,"cg-refraction":1.5,"cg-specular":.7,"cg-blur":.5};controls.forEach(([id,suf,dig,key])=>{$(id).value=d[id];state[key]=d[id];showVal(id,suf,dig);});state.surfaceType="convex_squircle";host.querySelectorAll("[data-surface]").forEach(b=>b.classList.toggle("cg-active",b.dataset.surface==="convex_squircle"));render();}
  $("cg-reset-optical").onclick=resetOptical;$("cg-rerender").onclick=render;
  $("cg-reset-all").onclick=()=>{resetOptical();$("cg-ui-blur").value=18;$("cg-opacity").value=18;$("cg-radius").value=24;state.uiBlur=18;state.opacity=18;state.radius=24;showVal("cg-ui-blur"," px",0);showVal("cg-opacity","%",0);showVal("cg-radius"," px",0);theme("light");render();};
  $("cg-center").onclick=()=>{host.style.left="";host.style.top="24px";host.style.right="24px";};
  let moving=false,ox=0,oy=0;
  $("cg-drag").addEventListener("pointerdown",e=>{if(e.target.closest("button"))return;const r=host.getBoundingClientRect();moving=true;ox=e.clientX-r.left;oy=e.clientY-r.top;$("cg-drag").setPointerCapture(e.pointerId);});
  $("cg-drag").addEventListener("pointermove",e=>{if(!moving)return;host.style.left=clamp(e.clientX-ox,0,innerWidth-host.offsetWidth)+"px";host.style.top=clamp(e.clientY-oy,0,innerHeight-40)+"px";host.style.right="auto";});
  $("cg-drag").addEventListener("pointerup",()=>moving=false);$("cg-drag").addEventListener("pointercancel",()=>moving=false);

  const probe=document.createElement("div");probe.style.backdropFilter="url(#coneui-liquid-filter)";
  const native=!!window.chrome&&probe.style.backdropFilter.includes("url");
  if(native){panel.classList.add("cg-native");$("cg-status-text").textContent="SVG Liquid Glass selected";$("cg-render-status").textContent="Using the original demo's SVG filter approach: displacement map, specular layer and edge refraction, rendered onto this floating panel.";}
  else{$("cg-status-text").textContent="Blur fallback";$("cg-render-status").textContent="This Chrome build does not expose SVG backdrop-filter. The same interface and controls remain, with CSS blur as a fallback.";}
  theme("light");
  const ro=new ResizeObserver(render);ro.observe(panel);
  render();
  console.info("ConeUI Liquid Glass UI loaded: adapted from the CSS and SVG refraction method in winaviation/liquid-glass-demo. No page, React app or iframe is embedded.");
})();