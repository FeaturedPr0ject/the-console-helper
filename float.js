(async () => {
  const ID = "coneui-liquid-glass-float";
  const CSS_URL = "https://raw.githubusercontent.com/FeaturedPr0ject/the-console-helper/main/float.css";
  document.getElementById(ID)?.remove();

  const host = document.createElement("div");
  host.id = ID;
  host.style.cssText = "all:initial;position:fixed;right:22px;top:22px;z-index:2147483647;pointer-events:none;max-width:calc(100vw - 16px);";
  const shadow = host.attachShadow({mode:"open"});
  document.documentElement.appendChild(host);

  let cssText;
  try {
    const response = await fetch(CSS_URL, {cache:"no-store"});
    if (!response.ok) throw new Error("float.css returned HTTP " + response.status);
    cssText = await response.text();
  } catch (error) {
    host.remove();
    console.error("ConeUI Liquid Glass: unable to load float.css.", error);
    return;
  }

  const style = document.createElement("style");
  style.textContent = cssText;
  shadow.appendChild(style);

  const markup = [
    '<section class="lg-root" id="lg-root">',
    '<div class="lg-backdrop" id="lg-backdrop"></div>',
    '<svg class="lg-filter-defs" aria-hidden="true">',
    '<defs>',
    '<filter id="cg-liquid-filter" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">',
    '<feGaussianBlur id="cg-main-blur" in="SourceGraphic" stdDeviation=".5" result="mainBlur"/>',
    '<feImage id="cg-main-map" href="" x="0" y="0" width="430" height="620" result="mainMap" preserveAspectRatio="none"/>',
    '<feDisplacementMap id="cg-main-displacement" in="mainBlur" in2="mainMap" scale="60" xChannelSelector="R" yChannelSelector="G" result="mainBent"/>',
    '<feColorMatrix in="mainBent" type="saturate" values="1.3" result="mainSaturated"/>',
    '<feImage id="cg-main-specular" href="" x="0" y="0" width="430" height="620" result="mainSpecular" preserveAspectRatio="none"/>',
    '<feComponentTransfer in="mainSpecular" result="mainSpecularAlpha"><feFuncA id="cg-main-specular-alpha" type="linear" slope=".7"/></feComponentTransfer>',
    '<feBlend in="mainSpecularAlpha" in2="mainSaturated" mode="screen"/>',
    '</filter>',
    '<filter id="cg-control-liquid-filter" x="-24%" y="-28%" width="148%" height="156%" color-interpolation-filters="sRGB">',
    '<feGaussianBlur in="SourceGraphic" stdDeviation=".3" result="controlBlur"/>',
    '<feImage id="cg-control-map" href="" x="0" y="0" width="160" height="56" result="controlMap" preserveAspectRatio="none"/>',
    '<feDisplacementMap id="cg-control-displacement" in="controlBlur" in2="controlMap" scale="22" xChannelSelector="R" yChannelSelector="G" result="controlBent"/>',
    '<feColorMatrix in="controlBent" type="saturate" values="1.35" result="controlSaturated"/>',
    '<feImage id="cg-control-shine" href="" x="0" y="0" width="160" height="56" result="controlShine" preserveAspectRatio="none"/>',
    '<feComponentTransfer in="controlShine" result="controlShineAlpha"><feFuncA id="cg-control-shine-alpha" type="linear" slope=".8"/></feComponentTransfer>',
    '<feBlend in="controlShineAlpha" in2="controlSaturated" mode="screen"/>',
    '</filter>',
    '<filter id="cg-switch-liquid-filter" x="-25%" y="-25%" width="150%" height="150%" color-interpolation-filters="sRGB">',
    '<feGaussianBlur in="SourceGraphic" stdDeviation=".25" result="switchBlur"/>',
    '<feImage id="cg-switch-map" href="" x="0" y="0" width="52" height="52" result="switchMap" preserveAspectRatio="none"/>',
    '<feDisplacementMap id="cg-switch-displacement" in="switchBlur" in2="switchMap" scale="18" xChannelSelector="R" yChannelSelector="G" result="switchBent"/>',
    '<feImage id="cg-switch-shine" href="" x="0" y="0" width="52" height="52" result="switchShine" preserveAspectRatio="none"/>',
    '<feBlend in="switchShine" in2="switchBent" mode="screen"/>',
    '</filter>',
    '</defs></svg>',
    '<div class="lg-content" id="lg-content">',
    '<header class="lg-header" id="lg-drag"><div class="lg-brand-mark">◈</div><div class="lg-heading"><div class="lg-title">ConeUI Liquid Glass</div><div class="lg-subtitle">Material · Refraction · Controls</div></div><div class="lg-spacer"></div><button class="lg-glass-control lg-icon-button" id="lg-min" title="Minimize" aria-label="Minimize"><span>−</span></button><button class="lg-glass-control lg-icon-button" id="lg-close" title="Close" aria-label="Close"><span>×</span></button></header>',
    '<nav class="lg-tabs" id="lg-tabs"><button class="lg-glass-control lg-tab active" data-page="material"><span>Material</span></button><button class="lg-glass-control lg-tab" data-page="appearance"><span>Appearance</span></button></nav>',
    '<main class="lg-main" id="lg-main">',
    '<section class="lg-page" id="lg-page-material">',
    '<div class="lg-intro"><span class="lg-intro-icon">✧</span><div><div class="lg-intro-title">Liquid Glass material</div><div class="lg-intro-copy">Lens-like controls inspired by the original demo. Drag the glass slider thumb and switch knobs.</div></div></div>',
    '<div class="lg-controls-panel">',
    '<div class="lg-section-heading"><span>Surface profile</span><span class="lg-heading-line"></span></div>',
    '<div class="lg-surface-selector"><button class="lg-glass-control active" data-surface="convex_squircle"><span>Convex Squircle</span></button><button class="lg-glass-control" data-surface="convex_circle"><span>Convex Circle</span></button><button class="lg-glass-control" data-surface="concave"><span>Concave</span></button><button class="lg-glass-control" data-surface="lip"><span>Soft Lip</span></button></div>',
    '<div class="lg-section-heading spaced"><span>Optical parameters</span><span class="lg-heading-line"></span></div>',
    '<div class="lg-control-row"><label class="lg-control-label">Bezel width</label><div class="lg-range" id="range-bezel" data-key="bezelWidth" data-min="3" data-max="18" data-step="1" data-value="10" role="slider" tabindex="0" aria-label="Bezel width"><div class="lg-range-track"><div class="lg-range-fill"></div></div><div class="lg-range-thumb"></div></div><output class="lg-control-value" id="value-bezel">10</output></div>',
    '<div class="lg-control-row"><label class="lg-control-label">Glass thickness</label><div class="lg-range" id="range-thickness" data-key="glassThickness" data-min="20" data-max="240" data-step="5" data-value="150" role="slider" tabindex="0" aria-label="Glass thickness"><div class="lg-range-track"><div class="lg-range-fill"></div></div><div class="lg-range-thumb"></div></div><output class="lg-control-value" id="value-thickness">150</output></div>',
    '<div class="lg-control-row"><label class="lg-control-label">Refractive index</label><div class="lg-range" id="range-index" data-key="refractiveIndex" data-min="1.1" data-max="2.2" data-step=".05" data-value="1.5" role="slider" tabindex="0" aria-label="Refractive index"><div class="lg-range-track"><div class="lg-range-fill"></div></div><div class="lg-range-thumb"></div></div><output class="lg-control-value" id="value-index">1.50</output></div>',
    '<div class="lg-control-row"><label class="lg-control-label">Refraction scale</label><div class="lg-range" id="range-refraction" data-key="refractionScale" data-min=".2" data-max="3.5" data-step=".1" data-value="1.5" role="slider" tabindex="0" aria-label="Refraction scale"><div class="lg-range-track"><div class="lg-range-fill"></div></div><div class="lg-range-thumb"></div></div><output class="lg-control-value" id="value-refraction">1.50</output></div>',
    '<div class="lg-control-row"><label class="lg-control-label">Edge highlight</label><div class="lg-range" id="range-specular" data-key="specularOpacity" data-min="0" data-max="1.5" data-step=".05" data-value=".7" role="slider" tabindex="0" aria-label="Edge highlight"><div class="lg-range-track"><div class="lg-range-fill"></div></div><div class="lg-range-thumb"></div></div><output class="lg-control-value" id="value-specular">0.70</output></div>',
    '<div class="lg-control-row"><label class="lg-control-label">Optical blur</label><div class="lg-range" id="range-blur" data-key="blur" data-min="0" data-max="3" data-step=".1" data-value=".5" role="slider" tabindex="0" aria-label="Optical blur"><div class="lg-range-track"><div class="lg-range-fill"></div></div><div class="lg-range-thumb"></div></div><output class="lg-control-value" id="value-blur">0.5</output></div>',
    '<div class="lg-actions"><button class="lg-glass-control" id="lg-reset-optical"><span>Reset parameters</span></button><button class="lg-glass-control active" id="lg-render"><span>Re-render glass</span></button></div>',
    '</div></section>',
    '<section class="lg-page" id="lg-page-appearance" hidden>',
    '<div class="lg-controls-panel">',
    '<div class="lg-section-heading"><span>Liquid controls</span><span class="lg-heading-line"></span></div>',
    '<div class="lg-switch-row"><div><div class="lg-switch-title">Liquid refraction</div><div class="lg-switch-description">Apply SVG liquid filter to glass surfaces when supported.</div></div><button class="lg-switch" id="toggle-liquid" role="switch" aria-checked="true" aria-label="Liquid refraction"><span class="lg-switch-thumb"></span></button></div>',
    '<div class="lg-switch-row"><div><div class="lg-switch-title">Specular highlights</div><div class="lg-switch-description">Enable the reflective edge highlight generated from a specular map.</div></div><button class="lg-switch" id="toggle-specular" role="switch" aria-checked="true" aria-label="Specular highlights"><span class="lg-switch-thumb"></span></button></div>',
    '<div class="lg-switch-row"><div><div class="lg-switch-title">Liquid Glass buttons</div><div class="lg-switch-description">Use the glass material on buttons, slider thumbs and switch knobs.</div></div><button class="lg-switch" id="toggle-controls" role="switch" aria-checked="true" aria-label="Liquid Glass controls"><span class="lg-switch-thumb"></span></button></div>',
    '<div class="lg-section-heading spaced"><span>Appearance</span><span class="lg-heading-line"></span></div>',
    '<div class="lg-control-row"><label class="lg-control-label">Fallback blur</label><div class="lg-range" id="range-ui-blur" data-key="uiBlur" data-min="0" data-max="36" data-step="1" data-value="18" role="slider" tabindex="0" aria-label="Fallback blur"><div class="lg-range-track"><div class="lg-range-fill"></div></div><div class="lg-range-thumb"></div></div><output class="lg-control-value" id="value-ui-blur">18</output></div>',
    '<div class="lg-control-row"><label class="lg-control-label">Glass tint</label><div class="lg-range" id="range-opacity" data-key="opacity" data-min="4" data-max="55" data-step="1" data-value="18" role="slider" tabindex="0" aria-label="Glass tint"><div class="lg-range-track"><div class="lg-range-fill"></div></div><div class="lg-range-thumb"></div></div><output class="lg-control-value" id="value-opacity">18%</output></div>',
    '<div class="lg-control-row"><label class="lg-control-label">Corner radius</label><div class="lg-range" id="range-radius" data-key="radius" data-min="14" data-max="42" data-step="1" data-value="24" role="slider" tabindex="0" aria-label="Corner radius"><div class="lg-range-track"><div class="lg-range-fill"></div></div><div class="lg-range-thumb"></div></div><output class="lg-control-value" id="value-radius">24</output></div>',
    '<div class="lg-section-heading spaced"><span>Color scheme</span><span class="lg-heading-line"></span></div>',
    '<div class="lg-surface-selector"><button class="lg-glass-control" id="lg-light"><span>Light glass</span></button><button class="lg-glass-control active" id="lg-dark"><span>Dark glass</span></button></div>',
    '<div class="lg-render-status" id="lg-render-status">Preparing liquid renderer…</div>',
    '<div class="lg-actions"><button class="lg-glass-control" id="lg-reset-all"><span>Reset all</span></button><button class="lg-glass-control active" id="lg-center"><span>Restore position</span></button></div>',
    '</div></section></main>',
    '<footer class="lg-footer"><span class="lg-status"><i class="lg-dot"></i><span id="lg-status-text">Liquid renderer</span></span><span>SVG · GLASS / 01</span></footer>',
    '</div></section>'
  ].join("");

  const mount = document.createElement("div");
  mount.innerHTML = markup;
  shadow.appendChild(mount);
  const $ = id => shadow.getElementById(id);
  const root = $("lg-root");
  const state = {
    surfaceType:"convex_squircle", bezelWidth:10, glassThickness:150,
    refractiveIndex:1.5, refractionScale:1.5, specularOpacity:.7, blur:.5,
    uiBlur:18, opacity:18, radius:24, theme:"dark",
    liquid:true, specular:true, glassControls:true
  };
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const profiles={
    convex_circle:x=>Math.sqrt(Math.max(0,1-Math.pow(1-x,2))),
    convex_squircle:x=>Math.pow(Math.max(0,1-Math.pow(1-x,4)),.25),
    concave:x=>1-Math.sqrt(Math.max(0,1-x*x)),
    lip:x=>{const c=Math.pow(Math.max(0,1-Math.pow(1-Math.min(x*2,1),4)),.25);const n=1-Math.sqrt(Math.max(0,1-Math.pow(1-x,2)))+.1;const t=6*Math.pow(x,5)-15*Math.pow(x,4)+10*Math.pow(x,3);return c*(1-t)+n*t;}
  };

  function toDataURL(imageData){
    const canvas=document.createElement("canvas");
    canvas.width=imageData.width;canvas.height=imageData.height;
    canvas.getContext("2d").putImageData(imageData,0,0);
    return canvas.toDataURL("image/png");
  }

  function displacementProfile(){
    const fn=profiles[state.surfaceType],eta=1/state.refractiveIndex,result=[];
    for(let i=0;i<128;i++){
      const x=i/128,y=fn(x),step=x<1?.0001:-.0001,x2=clamp(x+step,0,1);
      const derivative=(fn(x2)-y)/(x2-x||step),magnitude=Math.sqrt(derivative*derivative+1);
      const nx=-derivative/magnitude,ny=-1/magnitude,k=1-eta*eta*(1-ny*ny);
      if(k<0){result.push(0);continue;}
      const q=Math.sqrt(k),rx=-(eta*ny+q)*nx,ry=eta-(eta*ny+q)*ny;
      if(!Number.isFinite(rx)||!Number.isFinite(ry)||Math.abs(ry)<.00001){result.push(0);continue;}
      result.push(clamp(rx*((y*state.bezelWidth+state.glassThickness)/ry),-1000,1000));
    }
    return result;
  }

  function makeMaps(width,height,profile,cornerRadius,bezelWidth,scale=.38){
    const w=Math.max(1,Math.min(250,Math.round(width*scale)));
    const h=Math.max(1,Math.min(450,Math.round(height*scale)));
    const radius=Math.max(1,Math.min(cornerRadius*scale,h/2,w/2));
    const b=Math.max(.5,bezelWidth*scale);
    const displacementCanvas=document.createElement("canvas");
    displacementCanvas.width=w;displacementCanvas.height=h;
    const ctx=displacementCanvas.getContext("2d",{willReadFrequently:true});
    const disp=ctx.createImageData(w,h);
    for(let i=0;i<disp.data.length;i+=4){disp.data[i]=128;disp.data[i+1]=128;disp.data[i+3]=255;}
    const radius2=radius*radius,plus=(radius+1)*(radius+1),inner=Math.max(0,(radius-b)*(radius-b));
    const gapX=w-2*radius,gapY=h-2*radius;
    const maxDisplacement=Math.max(1,...profile.map(Math.abs));
    const shineCtx=document.createElement("canvas");
    shineCtx.width=w;shineCtx.height=h;
    const sctx=shineCtx.getContext("2d",{willReadFrequently:true});
    const shine=sctx.createImageData(w,h);
    const vx=Math.cos(Math.PI/3),vy=Math.sin(Math.PI/3);
    for(let y=0;y<h;y++){
      for(let x=0;x<w;x++){
        const px=x<radius?x-radius:x>=w-radius?x-radius-gapX:0;
        const py=y<radius?y-radius:y>=h-radius?y-radius-gapY:0;
        const d2=px*px+py*py;
        if(d2>plus||d2<inner)continue;
        const distance=Math.sqrt(d2),opacity=d2<radius2?1:1-(distance-radius)/(Math.sqrt(plus)-radius);
        const ratio=clamp((radius-distance)/b,0,1);
        const index=clamp(Math.floor(ratio*profile.length),0,profile.length-1);
        const offset=(y*w+x)*4;
        const delta=profile[index]||0;
        const dx=-(distance>0?px/distance:0)*delta/maxDisplacement;
        const dy=-(distance>0?py/distance:0)*delta/maxDisplacement;
        disp.data[offset]=clamp(128+dx*127*opacity,0,255);
        disp.data[offset+1]=clamp(128+dy*127*opacity,0,255);
        const cos=distance>0?px/distance:0,sin=distance>0?-py/distance:0;
        const dot=Math.abs(cos*vx+sin*vy);
        const edge=clamp((radius-distance)/1.5,0,1);
        const falloff=Math.sqrt(Math.max(0,1-Math.pow(1-edge,2)));
        const strength=dot*falloff;
        const color=Math.min(255,255*strength);
        shine.data[offset]=color;shine.data[offset+1]=color;shine.data[offset+2]=color;
        shine.data[offset+3]=Math.min(255,color*strength*opacity);
      }
    }
    const dc=document.createElement("canvas");dc.width=w;dc.height=h;dc.getContext("2d").putImageData(disp,0,0);
    const sc=document.createElement("canvas");sc.width=w;sc.height=h;sc.getContext("2d").putImageData(shine,0,0);
    return {displacement:dc.toDataURL("image/png"),shine:sc.toDataURL("image/png"),width:w,height:h,maxDisplacement};
  }

  function setMap(imageId,shineId,scaleId,maps,filterScale,targetWidth,targetHeight){
    const image=$(imageId),shine=$(shineId);
    image.setAttribute("href",maps.displacement);
    image.setAttribute("width",String(targetWidth));image.setAttribute("height",String(targetHeight));
    shine.setAttribute("href",maps.shine);
    shine.setAttribute("width",String(targetWidth));shine.setAttribute("height",String(targetHeight));
    if(scaleId)$(scaleId).setAttribute("scale",String(filterScale));
  }

  let renderFrame=0;
  function renderGlass(){
    if(renderFrame)cancelAnimationFrame(renderFrame);
    renderFrame=requestAnimationFrame(()=>{
      renderFrame=0;
      const width=Math.max(180,Math.round(root.clientWidth));
      const height=Math.max(170,Math.round(root.clientHeight));
      const profile=displacementProfile();
      const main=makeMaps(width,height,profile,state.radius,state.bezelWidth,.36);
      const maxDisp=Math.max(...profile.map(Math.abs))*state.refractionScale;
      setMap("cg-main-map","cg-main-specular","cg-main-displacement",main,maxDisp,width,height);
      $("cg-main-blur").setAttribute("stdDeviation",String(state.blur));
      $("cg-main-specular-alpha").setAttribute("slope",String(state.specular?state.specularOpacity:0));

      const control=makeMaps(160,56,profile,28,Math.min(14,state.bezelWidth),.7);
      setMap("cg-control-map","cg-control-shine","cg-control-displacement",control,Math.min(34,control.maxDisplacement*state.refractionScale*.22),160,56);
      const sw=makeMaps(52,52,profile,26,Math.min(13,state.bezelWidth),.8);
      $("cg-switch-map").setAttribute("href",sw.displacement);
      $("cg-switch-map").setAttribute("width","52");$("cg-switch-map").setAttribute("height","52");
      $("cg-switch-shine").setAttribute("href",sw.shine);
      $("cg-switch-shine").setAttribute("width","52");$("cg-switch-shine").setAttribute("height","52");
      $("cg-switch-displacement").setAttribute("scale",String(Math.min(22,sw.maxDisplacement*state.refractionScale*.25)));

      root.classList.toggle("lg-native",nativeSupport&&state.liquid);
      root.classList.toggle("lg-hide-controls",!state.glassControls);
      root.classList.toggle("lg-liquid-off",!state.liquid);
      updateAppearance();
      $("lg-status-text").textContent=state.liquid?(nativeSupport?"Live SVG refraction":"Glass styling · blur fallback"):"Liquid refraction off";
      $("lg-render-status").textContent=nativeSupport
        ?(state.liquid?"Liquid filter is attached to the floating surface, custom slider lenses, buttons and switch knobs.":"Refraction is disabled; the glass styling remains.")
        :"This Chromium build does not expose SVG backdrop-filter to CSS. Liquid styling is active, but live background bending falls back to blur.";
    });
  }

  function updateAppearance(){
    root.style.setProperty("--lg-fallback-blur",state.uiBlur+"px");
    root.style.setProperty("--lg-panel-bg",state.theme==="dark"?"rgba(30,30,40,"+(state.opacity/100)+")":"rgba(255,255,255,"+(state.opacity/100)+")");
    root.style.setProperty("--lg-radius",state.radius+"px");
    root.classList.toggle("lg-dark",state.theme==="dark");
    root.classList.toggle("lg-light",state.theme==="light");
    $("lg-root").style.borderRadius=state.radius+"px";
    $("lg-backdrop").style.borderRadius=state.radius+"px";
  }

  const rangeConfig={
    bezelWidth:{id:"range-bezel",output:"value-bezel",digits:0,suffix:""},
    glassThickness:{id:"range-thickness",output:"value-thickness",digits:0,suffix:""},
    refractiveIndex:{id:"range-index",output:"value-index",digits:2,suffix:""},
    refractionScale:{id:"range-refraction",output:"value-refraction",digits:2,suffix:""},
    specularOpacity:{id:"range-specular",output:"value-specular",digits:2,suffix:""},
    blur:{id:"range-blur",output:"value-blur",digits:1,suffix:""},
    uiBlur:{id:"range-ui-blur",output:"value-ui-blur",digits:0,suffix:""},
    opacity:{id:"range-opacity",output:"value-opacity",digits:0,suffix:"%"},
    radius:{id:"range-radius",output:"value-radius",digits:0,suffix:""}
  };

  function rangeValue(el){return Number(el.dataset.value);}
  function renderRange(el){
    const min=Number(el.dataset.min),max=Number(el.dataset.max),value=rangeValue(el);
    const pct=(value-min)/(max-min);
    const thumb=el.querySelector(".lg-range-thumb");
    const fill=el.querySelector(".lg-range-fill");
    const usable=Math.max(0,el.clientWidth-thumb.offsetWidth);
    thumb.style.left=(thumb.offsetWidth/2+pct*usable)+"px";
    fill.style.width=(pct*100)+"%";
    el.setAttribute("aria-valuemin",String(min));el.setAttribute("aria-valuemax",String(max));
    el.setAttribute("aria-valuenow",String(value));
    const cfg=rangeConfig[el.dataset.key];
    const output=$(cfg.output);
    output.textContent=(cfg.digits===0?String(value):value.toFixed(cfg.digits))+cfg.suffix;
  }

  function setRange(el,rawValue,shouldRender=true){
    const key=el.dataset.key,min=Number(el.dataset.min),max=Number(el.dataset.max),step=Number(el.dataset.step);
    const value=clamp(Math.round((rawValue-min)/step)*step+min,min,max);
    if(value===rangeValue(el))return;
    el.dataset.value=String(Number(value.toFixed(4)));
    state[key]=Number(el.dataset.value);
    if(key==="uiBlur"||key==="opacity")updateAppearance();
    renderRange(el);
    if(shouldRender)renderGlass();
  }

  function valueFromPointer(el,clientX){
    const rect=el.getBoundingClientRect(),min=Number(el.dataset.min),max=Number(el.dataset.max);
    const thumb=el.querySelector(".lg-range-thumb");
    const usable=Math.max(1,rect.width-thumb.offsetWidth);
    const x=clamp(clientX-rect.left-thumb.offsetWidth/2,0,usable);
    setRange(el,min+(x/usable)*(max-min));
  }

  const ranges=[...shadow.querySelectorAll(".lg-range")];
  ranges.forEach(el=>{
    state[el.dataset.key]=rangeValue(el);
    renderRange(el);
    let active=false;
    el.addEventListener("pointerdown",event=>{
      active=true;el.setPointerCapture(event.pointerId);valueFromPointer(el,event.clientX);
    });
    el.addEventListener("pointermove",event=>{if(active)valueFromPointer(el,event.clientX);});
    const stop=()=>{active=false;};
    el.addEventListener("pointerup",stop);el.addEventListener("pointercancel",stop);
    el.addEventListener("keydown",event=>{
      const step=Number(el.dataset.step),v=rangeValue(el);
      if(event.key==="ArrowRight"||event.key==="ArrowUp"){event.preventDefault();setRange(el,v+step);}
      else if(event.key==="ArrowLeft"||event.key==="ArrowDown"){event.preventDefault();setRange(el,v-step);}
      else if(event.key==="Home"){event.preventDefault();setRange(el,Number(el.dataset.min));}
      else if(event.key==="End"){event.preventDefault();setRange(el,Number(el.dataset.max));}
    });
  });

  function setSwitch(id,on){
    const el=$(id);
    el.setAttribute("aria-checked",String(!!on));
    if(id==="toggle-liquid")state.liquid=!!on;
    if(id==="toggle-specular")state.specular=!!on;
    if(id==="toggle-controls")state.glassControls=!!on;
    renderGlass();
  }
  ["toggle-liquid","toggle-specular","toggle-controls"].forEach(id=>{
    const el=$(id);
    let startX=0,dragged=false,suppressClick=false;
    el.addEventListener("pointerdown",event=>{
      startX=event.clientX;dragged=false;el.setPointerCapture(event.pointerId);
    });
    el.addEventListener("pointermove",event=>{
      if(Math.abs(event.clientX-startX)>4)dragged=true;
    });
    el.addEventListener("pointerup",event=>{
      if(!dragged)return;
      const rect=el.getBoundingClientRect();
      setSwitch(id,event.clientX>rect.left+rect.width/2);
      suppressClick=true;
    });
    el.addEventListener("click",event=>{
      if(suppressClick){suppressClick=false;event.preventDefault();return;}
      setSwitch(id,el.getAttribute("aria-checked")!=="true");
    });
    el.addEventListener("keydown",event=>{
      if(event.key===" "||event.key==="Enter"){event.preventDefault();setSwitch(id,el.getAttribute("aria-checked")!=="true");}
    });
  });

  shadow.querySelectorAll("[data-surface]").forEach(button=>button.addEventListener("click",()=>{
    shadow.querySelectorAll("[data-surface]").forEach(item=>item.classList.toggle("active",item===button));
    state.surfaceType=button.dataset.surface;renderGlass();
  }));

  function setTheme(theme){
    state.theme=theme;
    $("lg-dark").classList.toggle("active",theme==="dark");
    $("lg-light").classList.toggle("active",theme==="light");
    renderGlass();
  }
  $("lg-dark").onclick=()=>setTheme("dark");
  $("lg-light").onclick=()=>setTheme("light");

  function showPage(name){
    $("lg-page-material").hidden=name!=="material";
    $("lg-page-appearance").hidden=name!=="appearance";
    shadow.querySelectorAll("[data-page]").forEach(tab=>tab.classList.toggle("active",tab.dataset.page===name));
  }
  shadow.querySelectorAll("[data-page]").forEach(tab=>tab.addEventListener("click",()=>showPage(tab.dataset.page)));

  $("lg-min").onclick=()=>{
    const collapsed=root.classList.toggle("lg-collapsed");
    $("lg-min").querySelector("span").textContent=collapsed?"+":"−";
    requestAnimationFrame(renderGlass);
  };
  let observer=null;
  $("lg-close").onclick=()=>{if(observer)observer.disconnect();host.remove();};

  function resetOptical(){
    const defaults={bezelWidth:10,glassThickness:150,refractiveIndex:1.5,refractionScale:1.5,specularOpacity:.7,blur:.5};
    Object.keys(defaults).forEach(key=>{
      const cfg=rangeConfig[key],el=$(cfg.id);
      el.dataset.value=String(defaults[key]);state[key]=defaults[key];renderRange(el);
    });
    state.surfaceType="convex_squircle";
    shadow.querySelectorAll("[data-surface]").forEach(b=>b.classList.toggle("active",b.dataset.surface==="convex_squircle"));
    renderGlass();
  }
  $("lg-reset-optical").onclick=resetOptical;
  $("lg-render").onclick=()=>renderGlass();
  $("lg-reset-all").onclick=()=>{
    resetOptical();
    const defaults={uiBlur:18,opacity:18,radius:24};
    Object.keys(defaults).forEach(key=>{const el=$(rangeConfig[key].id);el.dataset.value=String(defaults[key]);state[key]=defaults[key];renderRange(el);});
    setSwitch("toggle-liquid",true);setSwitch("toggle-specular",true);setSwitch("toggle-controls",true);setTheme("dark");renderGlass();
  };
  $("lg-center").onclick=()=>{host.style.left="";host.style.top="22px";host.style.right="22px";host.style.bottom="auto";};

  let moving=false,dragX=0,dragY=0;
  $("lg-drag").addEventListener("pointerdown",event=>{
    if(event.target.closest("button"))return;
    const rect=host.getBoundingClientRect();moving=true;dragX=event.clientX-rect.left;dragY=event.clientY-rect.top;
    $("lg-drag").setPointerCapture(event.pointerId);
  });
  $("lg-drag").addEventListener("pointermove",event=>{
    if(!moving)return;
    host.style.left=clamp(event.clientX-dragX,0,innerWidth-host.offsetWidth)+"px";
    host.style.top=clamp(event.clientY-dragY,0,innerHeight-host.offsetHeight)+"px";
    host.style.right="auto";host.style.bottom="auto";
  });
  $("lg-drag").addEventListener("pointerup",()=>moving=false);
  $("lg-drag").addEventListener("pointercancel",()=>moving=false);

  const probe=document.createElement("div");
  probe.style.backdropFilter="url(#cg-liquid-filter)";
  const nativeSupport=!!window.chrome&&probe.style.backdropFilter.includes("url");
  if(nativeSupport)root.classList.add("lg-native");
  else $("lg-status-text").textContent="CSS glass mode";

  let resizeTimer=0;
  observer=new ResizeObserver(()=>{
    if(resizeTimer)cancelAnimationFrame(resizeTimer);
    resizeTimer=requestAnimationFrame(()=>{
      ranges.forEach(renderRange);
      renderGlass();
    });
  });
  observer.observe(root);
  window.addEventListener("resize",()=>{
    const r=host.getBoundingClientRect();
    if(r.right>innerWidth)host.style.left=Math.max(0,innerWidth-host.offsetWidth)+"px";
    if(r.bottom>innerHeight)host.style.top=Math.max(0,innerHeight-host.offsetHeight)+"px";
    ranges.forEach(renderRange);
    renderGlass();
  });

  updateAppearance();
  renderGlass();
  console.info("ConeUI Liquid Glass loaded. Separate float.css; draggable liquid slider thumbs; glass buttons and draggable switches.");
})();