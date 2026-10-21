(async () => {
  const ID = "coneui-liquid-glass-float";
  const CSS_URL = "https://raw.githubusercontent.com/FeaturedPr0ject/the-console-helper/main/float.css";
  document.getElementById(ID)?.remove();

  const host = document.createElement("div");
  host.id = ID;
  host.style.cssText = "all:initial;position:fixed;right:24px;top:24px;z-index:2147483647;width:max-content;height:max-content;max-width:calc(100vw - 16px);pointer-events:none;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;";

  const shadow = host.attachShadow({mode:"open"});
  document.documentElement.appendChild(host);

  let cssText = "";
  try {
    const response = await fetch(CSS_URL, {cache:"no-store"});
    if (!response.ok) throw new Error("CSS fetch failed: HTTP " + response.status);
    cssText = await response.text();
  } catch (error) {
    host.remove();
    console.error("ConeUI Float could not load float.css from GitHub.", error);
    return;
  }

  const style = document.createElement("style");
  style.textContent = cssText;
  shadow.appendChild(style);

  const markup = [
    '<section class="lg-root" id="lg-root">',
    '<div class="lg-backdrop" id="lg-backdrop"></div>',
    '<svg class="lg-filter-defs" aria-hidden="true"><defs>',
    '<filter id="cg-liquid-filter" x="-12%" y="-12%" width="124%" height="124%" color-interpolation-filters="sRGB">',
    '<feGaussianBlur id="cg-main-blur" in="SourceGraphic" stdDeviation=".5" result="blurred"/>',
    '<feImage id="cg-main-displacement-image" href="" x="0" y="0" width="420" height="520" result="displacement_map" preserveAspectRatio="none"/>',
    '<feDisplacementMap id="cg-main-displacement" in="blurred" in2="displacement_map" scale="75" xChannelSelector="R" yChannelSelector="G" result="displaced"/>',
    '<feColorMatrix in="displaced" type="saturate" values="1.25" result="saturated"/>',
    '<feImage id="cg-main-specular-image" href="" x="0" y="0" width="420" height="520" result="specular_layer" preserveAspectRatio="none"/>',
    '<feComponentTransfer in="specular_layer" result="specular_faded"><feFuncA id="cg-main-specular-alpha" type="linear" slope=".72"/></feComponentTransfer>',
    '<feBlend in="specular_faded" in2="saturated" mode="screen"/>',
    '</filter>',
    '<filter id="cg-control-liquid-filter" x="-20%" y="-25%" width="140%" height="150%" color-interpolation-filters="sRGB">',
    '<feGaussianBlur in="SourceGraphic" stdDeviation=".25" result="controlBlur"/>',
    '<feImage id="cg-control-displacement-image" href="" x="0" y="0" width="160" height="56" result="controlMap" preserveAspectRatio="none"/>',
    '<feDisplacementMap in="controlBlur" in2="controlMap" scale="22" xChannelSelector="R" yChannelSelector="G" result="controlBent"/>',
    '<feImage id="cg-control-specular-image" href="" x="0" y="0" width="160" height="56" result="controlShine" preserveAspectRatio="none"/>',
    '<feBlend in="controlShine" in2="controlBent" mode="screen"/>',
    '</filter></defs></svg>',
    '<div class="lg-content" id="lg-content">',
    '<header class="lg-header" id="lg-drag"><div class="lg-brand-mark">◈</div><div><div class="lg-title">ConeUI Liquid Glass</div><div class="lg-subtitle">Material system · CSS + SVG</div></div><div class="lg-spacer"></div><button class="lg-icon-button lg-glass-control" id="lg-min" title="Minimize" aria-label="Minimize">−</button><button class="lg-icon-button lg-glass-control" id="lg-close" title="Close" aria-label="Close">×</button></header>',
    '<nav class="lg-tabs" id="lg-tabs"><button class="lg-tab active lg-glass-control" data-page="material">Material</button><button class="lg-tab lg-glass-control" data-page="appearance">Appearance</button></nav>',
    '<main class="lg-main" id="lg-main">',
    '<section class="lg-page" id="lg-page-material">',
    '<div class="lg-intro"><span class="lg-intro-icon">✧</span><div><div class="lg-intro-title">Liquid Glass material</div><div class="lg-intro-copy">Adjust the glass applied to this floating window. No website is embedded.</div></div></div>',
    '<div class="lg-controls-panel">',
    '<div class="lg-section-heading"><span>Surface profile</span><span class="lg-heading-line"></span></div>',
    '<div class="lg-surface-selector"><button class="lg-glass-control active" data-surface="convex_squircle">Convex Squircle</button><button class="lg-glass-control" data-surface="convex_circle">Convex Circle</button><button class="lg-glass-control" data-surface="concave">Concave</button><button class="lg-glass-control" data-surface="lip">Soft Lip</button></div>',
    '<div class="lg-section-heading spaced"><span>Optical parameters</span><span class="lg-heading-line"></span></div>',
    '<div class="lg-control-row"><label class="lg-control-label" for="lg-bezel">Bezel width</label><input class="lg-slider" id="lg-bezel" type="range" min="3" max="18" value="10" step="1"><output class="lg-control-value" id="lg-bezel-value">10 px</output></div>',
    '<div class="lg-control-row"><label class="lg-control-label" for="lg-thickness">Glass thickness</label><input class="lg-slider" id="lg-thickness" type="range" min="20" max="240" value="150" step="5"><output class="lg-control-value" id="lg-thickness-value">150</output></div>',
    '<div class="lg-control-row"><label class="lg-control-label" for="lg-index">Refractive index</label><input class="lg-slider" id="lg-index" type="range" min="1.1" max="2.2" value="1.5" step="0.05"><output class="lg-control-value" id="lg-index-value">1.50</output></div>',
    '<div class="lg-control-row"><label class="lg-control-label" for="lg-refraction">Refraction scale</label><input class="lg-slider" id="lg-refraction" type="range" min="0.2" max="3.5" value="1.5" step="0.1"><output class="lg-control-value" id="lg-refraction-value">1.50</output></div>',
    '<div class="lg-control-row"><label class="lg-control-label" for="lg-specular">Specular opacity</label><input class="lg-slider" id="lg-specular" type="range" min="0" max="1.5" value="0.7" step="0.05"><output class="lg-control-value" id="lg-specular-value">0.70</output></div>',
    '<div class="lg-control-row"><label class="lg-control-label" for="lg-optical-blur">Optical blur</label><input class="lg-slider" id="lg-optical-blur" type="range" min="0" max="3" value="0.5" step="0.1"><output class="lg-control-value" id="lg-optical-blur-value">0.5 px</output></div>',
    '<div class="lg-actions"><button class="lg-glass-control" id="lg-reset-optical">Reset parameters</button><button class="lg-glass-control active" id="lg-render">Render glass</button></div>',
    '</div>',
    '</section>',
    '<section class="lg-page" id="lg-page-appearance" hidden>',
    '<div class="lg-controls-panel">',
    '<div class="lg-section-heading"><span>Liquid controls</span><span class="lg-heading-line"></span></div>',
    '<div class="lg-switch-row"><div class="lg-switch-text"><div class="lg-switch-title">Liquid refraction</div><div class="lg-switch-description">Use the generated SVG refraction filter when supported.</div></div><button class="lg-switch" id="lg-toggle-liquid" role="switch" aria-checked="true" aria-label="Liquid refraction"><span class="lg-switch-thumb"></span></button></div>',
    '<div class="lg-switch-row"><div class="lg-switch-text"><div class="lg-switch-title">Specular highlights</div><div class="lg-switch-description">Show the light-catching edge layer.</div></div><button class="lg-switch" id="lg-toggle-specular" role="switch" aria-checked="true" aria-label="Specular highlights"><span class="lg-switch-thumb"></span></button></div>',
    '<div class="lg-switch-row"><div class="lg-switch-text"><div class="lg-switch-title">Glass controls</div><div class="lg-switch-description">Apply glass finish to buttons and switches.</div></div><button class="lg-switch" id="lg-toggle-controls" role="switch" aria-checked="true" aria-label="Glass controls"><span class="lg-switch-thumb"></span></button></div>',
    '<div class="lg-section-heading spaced"><span>Panel appearance</span><span class="lg-heading-line"></span></div>',
    '<div class="lg-control-row"><label class="lg-control-label" for="lg-fallback-blur">Fallback blur</label><input class="lg-slider" id="lg-fallback-blur" type="range" min="0" max="36" value="18" step="1"><output class="lg-control-value" id="lg-fallback-blur-value">18 px</output></div>',
    '<div class="lg-control-row"><label class="lg-control-label" for="lg-opacity">Glass tint</label><input class="lg-slider" id="lg-opacity" type="range" min="4" max="55" value="18" step="1"><output class="lg-control-value" id="lg-opacity-value">18%</output></div>',
    '<div class="lg-control-row"><label class="lg-control-label" for="lg-radius">Corner radius</label><input class="lg-slider" id="lg-radius" type="range" min="14" max="42" value="24" step="1"><output class="lg-control-value" id="lg-radius-value">24 px</output></div>',
    '<div class="lg-section-heading spaced"><span>Color scheme</span><span class="lg-heading-line"></span></div>',
    '<div class="lg-surface-selector"><button class="lg-glass-control" id="lg-light">Light glass</button><button class="lg-glass-control active" id="lg-dark">Dark glass</button></div>',
    '<div class="lg-render-status" id="lg-render-status">Starting renderer…</div>',
    '<div class="lg-actions"><button class="lg-glass-control" id="lg-reset-all">Reset all</button><button class="lg-glass-control active" id="lg-center">Restore position</button></div>',
    '</div>',
    '</section>',
    '</main>',
    '<footer class="lg-footer"><span class="lg-status"><i class="lg-dot"></i><span id="lg-status-text">Liquid Glass renderer</span></span><span>CSS + SVG · FLOAT</span></footer>',
    '</div></section>'
  ].join("");

  const shadowStyle = document.createElement("style");
  shadow.appendChild(shadowStyle);
  shadowStyle.textContent = cssText;
  const markupContainer = document.createElement("div");
  markupContainer.innerHTML = markup;
  shadow.appendChild(markupContainer);

  const $ = id => shadow.getElementById(id);
  const root = $("lg-root");
  const backdrop = $("lg-backdrop");

  const state = {
    surfaceType:"convex_squircle",
    bezelWidth:10,
    glassThickness:150,
    refractiveIndex:1.5,
    refractionScale:1.5,
    specularOpacity:.7,
    blur:.5,
    uiBlur:18,
    opacity:18,
    radius:24,
    theme:"dark",
    liquid:true,
    specular:true,
    glassControls:true
  };
  const clamp = (v,min,max) => Math.max(min,Math.min(max,v));
  const profiles = {
    convex_circle:x=>Math.sqrt(Math.max(0,1-Math.pow(1-x,2))),
    convex_squircle:x=>Math.pow(Math.max(0,1-Math.pow(1-x,4)),.25),
    concave:x=>1-Math.sqrt(Math.max(0,1-x*x)),
    lip:x=>{
      const convex=Math.pow(Math.max(0,1-Math.pow(1-Math.min(x*2,1),4)),.25);
      const concave=1-Math.sqrt(Math.max(0,1-Math.pow(1-x,2)))+.1;
      const t=6*Math.pow(x,5)-15*Math.pow(x,4)+10*Math.pow(x,3);
      return convex*(1-t)+concave*t;
    }
  };

  function makeDataURL(imageData) {
    const canvas=document.createElement("canvas");
    canvas.width=imageData.width;
    canvas.height=imageData.height;
    canvas.getContext("2d").putImageData(imageData,0,0);
    return canvas.toDataURL("image/png");
  }

  function makeDisplacement1D() {
    const fn=profiles[state.surfaceType], eta=1/state.refractiveIndex, out=[];
    for(let i=0;i<128;i++){
      const x=i/128,y=fn(x),dx=x<1?.0001:-.0001,x2=clamp(x+dx,0,1);
      const derivative=(fn(x2)-y)/(x2-x||dx),mag=Math.sqrt(derivative*derivative+1);
      const nx=-derivative/mag,ny=-1/mag,dot=ny,k=1-eta*eta*(1-dot*dot);
      if(k<0){out.push(0);continue;}
      const q=Math.sqrt(k),rx=-(eta*dot+q)*nx,ry=eta-(eta*dot+q)*ny;
      if(!Number.isFinite(rx)||!Number.isFinite(ry)||Math.abs(ry)<.00001){out.push(0);continue;}
      out.push(clamp(rx*((y*state.bezelWidth+state.glassThickness)/ry),-1000,1000));
    }
    return out;
  }

  function makeDisplacementMap(width,height,profile,rounded) {
    const w=Math.max(1,Math.min(300,Math.round(width*.42)));
    const h=Math.max(1,Math.min(500,Math.round(height*.42)));
    const canvas=document.createElement("canvas");canvas.width=w;canvas.height=h;
    const ctx=canvas.getContext("2d",{willReadFrequently:true}),image=ctx.createImageData(w,h);
    for(let i=0;i<image.data.length;i+=4){image.data[i]=128;image.data[i+1]=128;image.data[i+3]=255;}
    const radius=Math.min(state.radius*(w/width),h/2,w/2);
    const radius2=radius*radius,plus=(radius+1)*(radius+1);
    const inner=Math.max(0,(radius-state.bezelWidth*(w/width))*(radius-state.bezelWidth*(w/width)));
    const gapX=w-2*radius,gapY=h-2*radius;
    const maxDisplacement=Math.max(1,...profile.map(Math.abs));
    for(let y=0;y<h;y++){
      for(let x=0;x<w;x++){
        const px=x<radius?x-radius:x>=w-radius?x-radius-gapX:0;
        const py=y<radius?y-radius:y>=h-radius?y-radius-gapY:0;
        const d2=px*px+py*py;
        if(d2>plus||d2<inner)continue;
        const d=Math.sqrt(d2),opacity=d2<radius2?1:1-(d-radius)/(Math.sqrt(plus)-radius);
        const ratio=clamp((radius-d)/Math.max(.5,state.bezelWidth*(w/width)),0,1);
        const index=clamp(Math.floor(ratio*profile.length),0,profile.length-1);
        const distance=profile[index]||0,dx=-(d>0?px/d:0)*distance/maxDisplacement,dy=-(d>0?py/d:0)*distance/maxDisplacement,offset=(y*w+x)*4;
        image.data[offset]=clamp(128+dx*127*opacity,0,255);
        image.data[offset+1]=clamp(128+dy*127*opacity,0,255);
      }
    }
    return {image,w,h};
  }

  function makeSpecularMap(width,height) {
    const w=Math.max(1,Math.min(300,Math.round(width*.42)));
    const h=Math.max(1,Math.min(500,Math.round(height*.42)));
    const canvas=document.createElement("canvas");canvas.width=w;canvas.height=h;
    const ctx=canvas.getContext("2d",{willReadFrequently:true}),image=ctx.createImageData(w,h);
    const radius=Math.min(state.radius*(w/width),h/2,w/2),plus=(radius+1)*(radius+1),inner=Math.max(0,(radius-1.5)*(radius-1.5));
    const gapX=w-2*radius,gapY=h-2*radius,vx=Math.cos(Math.PI/3),vy=Math.sin(Math.PI/3);
    for(let y=0;y<h;y++){
      for(let x=0;x<w;x++){
        const px=x<radius?x-radius:x>=w-radius?x-radius-gapX:0;
        const py=y<radius?y-radius:y>=h-radius?y-radius-gapY:0;
        const d2=px*px+py*py;
        if(d2>plus||d2<inner)continue;
        const d=Math.sqrt(d2),opacity=d2<radius*radius?1:1-(d-radius)/(Math.sqrt(plus)-radius);
        const co=Math.abs((d>0?px/d:0)*vx+(d>0?-py/d:0)*vy);
        const edge=clamp((radius-d)/1.5,0,1),fall=Math.sqrt(Math.max(0,1-Math.pow(1-edge,2))),strength=co*fall;
        const color=Math.min(255,255*strength),alpha=Math.min(255,color*strength*opacity),offset=(y*w+x)*4;
        image.data[offset]=color;image.data[offset+1]=color;image.data[offset+2]=color;image.data[offset+3]=alpha;
      }
    }
    return {image,w,h};
  }

  let renderId=0;
  function renderGlass(force) {
    if(renderId)cancelAnimationFrame(renderId);
    renderId=requestAnimationFrame(()=>{
      renderId=0;
      const rect=root.getBoundingClientRect();
      const width=Math.max(120,Math.round(rect.width));
      const height=Math.max(160,Math.round(rect.height));
      const profile=makeDisplacement1D();
      const disp=makeDisplacementMap(width,height,profile,true);
      const spec=makeSpecularMap(width,height);
      const d=$("cg-main-displacement-image"),s=$("cg-main-specular-image");
      d.setAttribute("href",makeDataURL(disp.image));
      s.setAttribute("href",makeDataURL(spec.image));
      d.setAttribute("width",String(disp.w));d.setAttribute("height",String(disp.h));
      s.setAttribute("width",String(spec.w));s.setAttribute("height",String(spec.h));
      $("cg-displacement-filter").setAttribute("scale",String(Math.max(...profile.map(Math.abs))*state.refractionScale));
      $("cg-main-blur").setAttribute("stdDeviation",String(state.blur));
      $("cg-main-specular-alpha").setAttribute("slope",String(state.specular?state.specularOpacity:0));
      const capsule=makeDisplacementMap(160,56,profile,true);
      const capsuleSpec=makeSpecularMap(160,56);
      $("cg-control-displacement-image").setAttribute("href",makeDataURL(capsule.image));
      $("cg-control-specular-image").setAttribute("href",makeDataURL(capsuleSpec.image));
      $("cg-control-displacement-image").setAttribute("width",String(capsule.w));$("cg-control-displacement-image").setAttribute("height",String(capsule.h));
      $("cg-control-specular-image").setAttribute("width",String(capsuleSpec.w));$("cg-control-specular-image").setAttribute("height",String(capsuleSpec.h));
      $("cg-control-liquid-filter").setAttribute("color-interpolation-filters","sRGB");
      $("cg-status-text").textContent=state.liquid?(nativeSupport?"SVG liquid glass enabled":"CSS glass fallback"):"Liquid effect off";
      $("cg-render-status").textContent=nativeSupport
        ?(state.liquid?"SVG refraction filter enabled for the floating surface. Glass buttons and switch thumbs use their own glass styling.":"Liquid refraction is switched off; the CSS glass material remains visible.")
        :"This Chrome build does not expose SVG backdrop-filter. The UI uses the demo-inspired CSS glass fallback; the renderer settings remain available.";
      updateAppearance();
    });
  }

  function updateAppearance() {
    root.style.setProperty("--lg-blur",state.uiBlur+"px");
    root.style.setProperty("--lg-tint",state.opacity+"%");
    root.style.setProperty("--lg-radius",state.radius+"px");
    root.style.setProperty("--lg-panel",state.theme==="dark"?"rgba(30,30,40,"+(state.opacity/100)+")":"rgba(255,255,255,"+(state.opacity/100)+")");
    root.style.setProperty("--lg-text-primary",state.theme==="dark"?"#f0f0f5":"#1a1a2e");
    root.style.setProperty("--lg-text-secondary",state.theme==="dark"?"rgba(255,255,255,.72)":"rgba(0,0,0,.68)");
    root.style.setProperty("--lg-border",state.theme==="dark"?"rgba(255,255,255,.16)":"rgba(255,255,255,.56)");
    root.classList.toggle("lg-dark",state.theme==="dark");
    root.classList.toggle("lg-light",state.theme==="light");
    root.classList.toggle("lg-native",nativeSupport&&state.liquid);
    root.classList.toggle("lg-no-control-glass",!state.glassControls);
    $("cg-main-specular-alpha").setAttribute("slope",String(state.specular?state.specularOpacity:0));
  }

  function displayValue(id,suffix,digits) {
    const n=Number($(id).value);
    $(id+"-value").textContent=(digits===undefined?String(n):n.toFixed(digits))+suffix;
  }

  const controls=[
    ["cg-bezel"," px",0,"bezelWidth"],
    ["cg-thickness","",0,"glassThickness"],
    ["cg-index","",2,"refractiveIndex"],
    ["cg-refraction","",2,"refractionScale"],
    ["cg-specular","",2,"specularOpacity"],
    ["cg-optical-blur"," px",1,"blur"]
  ];
  controls.forEach(([id,suffix,digits,key])=>{
    $(id).addEventListener("input",()=>{
      state[key]=Number($(id).value);
      displayValue(id,suffix,digits);
      renderGlass(true);
    });
  });
  $("cg-fallback-blur").addEventListener("input",()=>{state.uiBlur=Number($("cg-fallback-blur").value);displayValue("cg-fallback-blur"," px",0);updateAppearance();});
  $("cg-opacity").addEventListener("input",()=>{state.opacity=Number($("cg-opacity").value);displayValue("cg-opacity","%",0);updateAppearance();});
  $("cg-radius").addEventListener("input",()=>{state.radius=Number($("cg-radius").value);displayValue("cg-radius"," px",0);renderGlass(true);});

  function setSwitch(id,on) {
    const el=$(id);
    el.setAttribute("aria-checked",String(!!on));
    if(id==="lg-toggle-liquid")state.liquid=!!on;
    if(id==="lg-toggle-specular")state.specular=!!on;
    if(id==="lg-toggle-controls")state.glassControls=!!on;
    updateAppearance();
    if(id!=="lg-toggle-controls")renderGlass(true);
  }
  [["lg-toggle-liquid",true],["lg-toggle-specular",true],["lg-toggle-controls",true]].forEach(([id,defaultValue])=>{
    setSwitch(id,defaultValue);
    const el=$(id);
    el.addEventListener("click",()=>setSwitch(id,el.getAttribute("aria-checked")!=="true"));
    let startX=0,moved=false;
    const thumb=el.querySelector(".lg-switch-thumb");
    thumb.addEventListener("pointerdown",e=>{startX=e.clientX;moved=false;thumb.setPointerCapture(e.pointerId);});
    thumb.addEventListener("pointermove",e=>{if(Math.abs(e.clientX-startX)>3)moved=true;});
    thumb.addEventListener("pointerup",e=>{
      if(!moved)return;
      e.preventDefault();
      const r=el.getBoundingClientRect();
      setSwitch(id,e.clientX>r.left+r.width/2);
      el.dataset.dragCompleted="1";
    });
  });

  host.querySelectorAll("[data-surface]").forEach(button=>button.addEventListener("click",()=>{
    host.querySelectorAll("[data-surface]").forEach(item=>item.classList.toggle("active",item===button));
    state.surfaceType=button.dataset.surface;
    renderGlass(true);
  }));

  function setTheme(theme) {
    state.theme=theme;
    $("lg-dark").classList.toggle("active",theme==="dark");
    $("lg-light").classList.toggle("active",theme==="light");
    updateAppearance();
  }
  $("lg-dark").onclick=()=>setTheme("dark");
  $("lg-light").onclick=()=>setTheme("light");

  function showPage(name) {
    $("lg-page-material").hidden=name!=="material";
    $("lg-page-appearance").hidden=name!=="appearance";
    host.querySelectorAll("[data-page]").forEach(tab=>tab.classList.toggle("active",tab.dataset.page===name));
  }
  host.querySelectorAll("[data-page]").forEach(tab=>tab.addEventListener("click",()=>showPage(tab.dataset.page)));

  $("lg-min").onclick=()=>{
    const collapsed=root.classList.toggle("lg-collapsed");
    $("lg-min").textContent=collapsed?"+":"−";
    requestAnimationFrame(()=>renderGlass(true));
  };
  $("lg-close").onclick=()=>{observer.disconnect();host.remove();};

  function resetOptical() {
    const defaults={"cg-bezel":10,"cg-thickness":150,"cg-index":1.5,"cg-refraction":1.5,"cg-specular":.7,"cg-optical-blur":.5};
    controls.forEach(([id,suffix,digits,key])=>{$(id).value=defaults[id];state[key]=defaults[id];displayValue(id,suffix,digits);});
    state.surfaceType="convex_squircle";
    host.querySelectorAll("[data-surface]").forEach(b=>b.classList.toggle("active",b.dataset.surface==="convex_squircle"));
    renderGlass(true);
  }
  $("lg-reset-optical").onclick=resetOptical;
  $("lg-render").onclick=()=>renderGlass(true);
  $("lg-reset-all").onclick=()=>{
    resetOptical();
    $("lg-fallback-blur").value="18";$("lg-opacity").value="18";$("lg-radius").value="24";
    state.uiBlur=18;state.opacity=18;state.radius=24;
    displayValue("lg-fallback-blur"," px",0);displayValue("lg-opacity","%",0);displayValue("lg-radius"," px",0);
    setSwitch("lg-toggle-liquid",true);setSwitch("lg-toggle-specular",true);setSwitch("lg-toggle-controls",true);setTheme("dark");renderGlass(true);
  };
  $("lg-center").onclick=()=>{host.style.left="";host.style.top="24px";host.style.right="24px";host.style.bottom="auto";};

  let dragging=false,dragX=0,dragY=0;
  $("lg-drag").addEventListener("pointerdown",e=>{
    if(e.target.closest("button"))return;
    const rect=host.getBoundingClientRect();dragging=true;dragX=e.clientX-rect.left;dragY=e.clientY-rect.top;
    $("lg-drag").setPointerCapture(e.pointerId);
  });
  $("lg-drag").addEventListener("pointermove",e=>{
    if(!dragging)return;
    host.style.left=clamp(e.clientX-dragX,0,innerWidth-host.offsetWidth)+"px";
    host.style.top=clamp(e.clientY-dragY,0,innerHeight-host.offsetHeight)+"px";
    host.style.right="auto";host.style.bottom="auto";
  });
  $("lg-drag").addEventListener("pointerup",()=>dragging=false);
  $("lg-drag").addEventListener("pointercancel",()=>dragging=false);

  const probe=document.createElement("div");
  probe.style.backdropFilter="url(#cg-liquid-filter)";
  const nativeSupport=!!window.chrome&&probe.style.backdropFilter.includes("url");
  let observer;
  themeDefaults();
  function themeDefaults(){setTheme("dark");}
  observer=new ResizeObserver(()=>renderGlass(true));
  observer.observe(root);
  renderGlass(true);
  console.info("ConeUI Liquid Glass: separated CSS loaded, responsive resize enabled, glass buttons and draggable switches initialized.");
})();