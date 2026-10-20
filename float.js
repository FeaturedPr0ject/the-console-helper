(() => {
  const ID = "coneui-liquid-glass-float";
  document.getElementById(ID)?.remove();

  const host = document.createElement("div");
  host.id = ID;
  host.style.cssText = "all:initial;position:fixed;right:28px;top:24px;z-index:2147483647;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;color:#f0f0f5;";
  const ui = host.attachShadow({mode:"open"});

  ui.innerHTML = `
    <style>
      *{box-sizing:border-box}
      :host{--bg-primary:#1b1b22;--bg-secondary:#0f0f14;--text-primary:#f0f0f5;--text-secondary:rgba(255,255,255,.68);--border-color:rgba(255,255,255,.12);--panel-bg:rgba(30,30,40,.87);--accent:#8276e8;--glass-opacity:.87;--shell-blur:18px}
      .window{width:440px;max-width:calc(100vw - 24px);max-height:calc(100vh - 32px);overflow:hidden;background:var(--panel-bg);color:var(--text-primary);border:1px solid var(--border-color);border-radius:18px;box-shadow:0 24px 85px rgba(0,0,0,.4),inset 0 1px rgba(255,255,255,.1);backdrop-filter:blur(var(--shell-blur)) saturate(145%);-webkit-backdrop-filter:blur(var(--shell-blur)) saturate(145%)}
      .top{height:58px;display:flex;align-items:center;gap:11px;padding:0 15px;border-bottom:1px solid var(--border-color);background:linear-gradient(120deg,rgba(255,255,255,.07),transparent 70%);cursor:move;user-select:none}
      .logo{width:31px;height:31px;display:grid;place-items:center;border-radius:11px;border:1px solid rgba(255,255,255,.22);background:linear-gradient(145deg,rgba(255,255,255,.32),rgba(255,255,255,.04));box-shadow:inset 0 1px rgba(255,255,255,.35);font-size:16px}
      .title{font-size:14px;font-weight:750;letter-spacing:-.2px}.subtitle{font-size:10px;color:var(--text-secondary);margin-top:2px}.spacer{flex:1}
      button{font:inherit;color:inherit;cursor:pointer}
      .icon{width:29px;height:29px;display:grid;place-items:center;border-radius:9px;border:1px solid var(--border-color);background:rgba(255,255,255,.045);font-size:16px}
      .icon:hover,.btn:hover{background:rgba(255,255,255,.12)}
      .tabs{display:flex;gap:4px;padding:10px 14px 0}
      .tab{border:1px solid transparent;background:transparent;color:var(--text-secondary);border-radius:9px;padding:8px 13px;font-size:11px}
      .tab.active{color:var(--text-primary);background:rgba(255,255,255,.09);border-color:var(--border-color)}
      .main{overflow:auto;max-height:calc(100vh - 150px);padding:14px 15px 16px}
      .page[hidden]{display:none}
      .overline{font-size:10px;text-transform:uppercase;letter-spacing:.16em;color:var(--text-secondary);margin:0 0 11px;font-weight:700}
      .stage{height:224px;position:relative;overflow:hidden;border-radius:14px;border:1px solid var(--border-color);background-color:var(--bg-secondary);background-image:linear-gradient(to right,rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,.035) 1px,transparent 1px),radial-gradient(120% 100% at 10% 0%,var(--bg-primary),var(--bg-secondary));background-size:24px 24px,24px 24px,100% 100%;touch-action:none}
      .art{position:absolute;inset:0;display:grid;grid-template-columns:1fr .86fr;gap:13px;padding:18px;pointer-events:none}
      .micro{font-size:9px;letter-spacing:.2em;color:#ee8585;margin:2px 0 10px}
      .headline{font-size:27px;line-height:.98;letter-spacing:-1.2px;font-weight:820;margin:0 0 12px;max-width:220px;color:var(--text-primary)}
      .headline span{opacity:.36}
      .copy{font-size:10px;line-height:1.55;max-width:210px;color:var(--text-secondary)}
      .photo{position:relative;overflow:hidden;border-radius:10px;background:linear-gradient(145deg,#d2c9be 0%,#a0a6a5 20%,#35444d 21%,#788a8b 46%,#e0d3bd 47%,#b8afa0 61%,#303740 62%,#171e27 100%);box-shadow:0 5px 22px rgba(0,0,0,.15)}
      .photo:before{content:"";position:absolute;inset:-35%;background:repeating-linear-gradient(112deg,transparent 0 18px,rgba(255,255,255,.26) 19px 21px,transparent 22px 42px);transform:rotate(7deg)}
      .photo:after{content:"";position:absolute;inset:0;background:linear-gradient(125deg,transparent 30%,rgba(255,255,255,.14) 31%,transparent 33%,transparent 70%,rgba(0,0,0,.18) 71%)}
      .lens{position:absolute;left:32px;top:48px;width:220px;height:130px;border-radius:65px;overflow:hidden;touch-action:none;cursor:grab;isolation:isolate;border:1px solid rgba(255,255,255,.72);background:linear-gradient(135deg,rgba(255,255,255,.16),rgba(255,255,255,.015) 44%,rgba(255,255,255,.11));box-shadow:0 8px 24px rgba(0,0,0,.22),inset 0 1px 3px rgba(255,255,255,.8),inset 0 -8px 19px rgba(255,255,255,.12);will-change:left,top}
      .lens:before{content:"";position:absolute;inset:1px;border:1px solid rgba(255,255,255,.24);border-radius:inherit;pointer-events:none;z-index:4;background:linear-gradient(115deg,rgba(255,255,255,.25),transparent 38%,transparent 70%,rgba(255,255,255,.11))}
      .lens:after{content:"";position:absolute;left:20%;right:20%;top:5px;height:1px;border-radius:50%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.95),transparent);z-index:5;pointer-events:none}
      .cloneView{position:absolute;inset:0;overflow:hidden;border-radius:inherit;filter:url(#liquidGlassFilter);-webkit-filter:url(#liquidGlassFilter)}
      .cloneInner{position:absolute;left:0;top:0;pointer-events:none}
      .lensLabel{position:absolute;z-index:6;bottom:8px;left:12px;color:var(--text-secondary);font-size:8px;letter-spacing:.16em;text-shadow:0 1px 3px #0005;pointer-events:none}
      .hint{font-size:10px;line-height:1.5;color:var(--text-secondary);margin:10px 1px 2px}
      .section{display:flex;gap:10px;align-items:center;font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:var(--text-secondary);margin:3px 0 12px}
      .rule{height:1px;background:var(--border-color);flex:1}
      .control{display:grid;grid-template-columns:145px 1fr 44px;gap:9px;align-items:center;margin:16px 0}
      .control label{font-size:11px;color:var(--text-primary)}
      .value{font:10px ui-monospace,SFMono-Regular,Consolas,monospace;text-align:right;color:var(--text-secondary);font-variant-numeric:tabular-nums}
      input[type=range]{width:100%;min-width:45px;appearance:none;-webkit-appearance:none;height:3px;border-radius:99px;background:rgba(128,128,128,.35);outline:none;accent-color:var(--accent)}
      input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:13px;height:13px;border:1px solid rgba(255,255,255,.6);border-radius:50%;background:linear-gradient(145deg,#b2a7ff,#7669d7);box-shadow:0 1px 6px #0004;cursor:pointer}
      input[type=range]::-moz-range-thumb{width:13px;height:13px;border:1px solid rgba(255,255,255,.6);border-radius:50%;background:#8e82ec;cursor:pointer}
      .surfaceGrid{display:grid;grid-template-columns:1fr 1fr;gap:7px}
      .btn{border:1px solid var(--border-color);border-radius:9px;background:rgba(255,255,255,.035);padding:9px 10px;text-align:center;font-size:10px;transition:background .15s,border-color .15s}
      .btn.active{color:#fff;border-color:rgba(159,148,255,.75);background:linear-gradient(135deg,rgba(102,126,234,.9),rgba(118,75,162,.92))}
      .note{border:1px solid var(--border-color);background:rgba(255,255,255,.035);border-radius:10px;padding:10px 11px;font-size:10px;line-height:1.5;color:var(--text-secondary);margin-top:14px}
      .footer{display:flex;align-items:center;justify-content:space-between;padding:10px 15px;border-top:1px solid var(--border-color);font-size:9px;color:var(--text-secondary)}
      .status{display:flex;align-items:center;gap:6px}.green{height:6px;width:6px;border-radius:50%;background:#76ddb1;box-shadow:0 0 8px #76ddb177}
      .rowButtons{display:flex;gap:7px;margin-top:13px}.rowButtons .btn{flex:1}
      @media(max-width:500px){.window{width:calc(100vw - 16px);max-width:calc(100vw - 16px)}.control{grid-template-columns:118px 1fr 40px}.lens{max-width:calc(100% - 24px)}.headline{font-size:23px}.art{padding:14px;gap:8px}}
      @media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;transition:none!important}}
    </style>
    <section class="window" id="window">
      <header class="top" id="drag">
        <div class="logo">◈</div>
        <div><div class="title">Liquid Glass</div><div class="subtitle">Material Lab · ConeUI</div></div>
        <div class="spacer"></div>
        <button class="icon" id="min" title="Minimize">−</button>
        <button class="icon" id="close" title="Close">×</button>
      </header>
      <nav class="tabs">
        <button class="tab active" data-page="preview">Preview</button>
        <button class="tab" data-page="settings">Liquid Glass Settings</button>
      </nav>
      <main class="main">
        <section class="page" id="page-preview">
          <p class="overline">Interactive optical surface</p>
          <div class="stage" id="stage">
            <div class="art" id="art">
              <div><div class="micro">OPTICS STUDY</div><h2 class="headline">Liquid Glass<br><span>—</span> Precision Lens</h2><div class="copy">Drag the lens over the scene. The SVG displacement map bends the preview below the glass edge.</div></div>
              <div class="photo"></div>
            </div>
            <div class="lens" id="lens">
              <div class="cloneView"><div class="cloneInner" id="cloneInner"></div></div>
              <div class="lensLabel">LIVE REFRACTION</div>
            </div>
            <svg width="0" height="0" style="position:absolute;overflow:hidden" aria-hidden="true">
              <defs>
                <filter id="liquidGlassFilter" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
                  <feGaussianBlur id="filterBlur" in="SourceGraphic" stdDeviation="0.5" result="blurred"/>
                  <feImage id="displacementImage" href="" x="0" y="0" width="220" height="130" result="displacement_map" preserveAspectRatio="none"/>
                  <feDisplacementMap id="displacementMap" in="blurred" in2="displacement_map" scale="35" xChannelSelector="R" yChannelSelector="G" result="displaced"/>
                  <feColorMatrix in="displaced" type="saturate" values="1.3" result="displaced_saturated"/>
                  <feImage id="specularImage" href="" x="0" y="0" width="220" height="130" result="specular_layer" preserveAspectRatio="none"/>
                  <feComponentTransfer in="specular_layer" result="specular_faded"><feFuncA id="specularAlpha" type="linear" slope="0.7"/></feComponentTransfer>
                  <feBlend in="specular_faded" in2="displaced_saturated" mode="screen"/>
                </filter>
              </defs>
            </svg>
          </div>
          <div class="hint">Drag the capsule to move it. Open <b>Liquid Glass Settings</b> to adjust the optical profile, refraction, edge highlight and blur.</div>
          <div class="rowButtons"><button class="btn" id="resetPosition">Center lens</button><button class="btn" id="openSettings">Open settings</button></div>
        </section>
        <section class="page" id="page-settings" hidden>
          <p class="overline">Surface profile</p>
          <div class="surfaceGrid">
            <button class="btn active" data-surface="convex_squircle">Convex Squircle</button>
            <button class="btn" data-surface="convex_circle">Convex Circle</button>
            <button class="btn" data-surface="concave">Concave</button>
            <button class="btn" data-surface="lip">Soft Lip</button>
          </div>
          <div class="section" style="margin-top:20px">Optical parameters <span class="rule"></span></div>
          <div class="control"><label for="bezelWidth">Bezel width</label><input id="bezelWidth" type="range" min="8" max="55" value="30" step="1"><output class="value" id="bezelWidthValue">30 px</output></div>
          <div class="control"><label for="glassThickness">Glass thickness</label><input id="glassThickness" type="range" min="20" max="240" value="150" step="5"><output class="value" id="glassThicknessValue">150</output></div>
          <div class="control"><label for="refractiveIndex">Refractive index</label><input id="refractiveIndex" type="range" min="1.1" max="2.2" value="1.5" step=".05"><output class="value" id="refractiveIndexValue">1.50</output></div>
          <div class="control"><label for="refractionScale">Refraction strength</label><input id="refractionScale" type="range" min=".2" max="3.5" value="1.5" step=".1"><output class="value" id="refractionScaleValue">1.50</output></div>
          <div class="control"><label for="specularOpacity">Edge highlight</label><input id="specularOpacity" type="range" min="0" max="1.5" value=".7" step=".05"><output class="value" id="specularOpacityValue">0.70</output></div>
          <div class="control"><label for="blur">Optical blur</label><input id="blur" type="range" min="0" max="3" value=".5" step=".1"><output class="value" id="blurValue">0.5 px</output></div>
          <div class="section" style="margin-top:22px">Panel appearance <span class="rule"></span></div>
          <div class="control"><label for="shellBlur">UI background blur</label><input id="shellBlur" type="range" min="0" max="32" value="18" step="1"><output class="value" id="shellBlurValue">18 px</output></div>
          <div class="control"><label for="panelOpacity">Panel opacity</label><input id="panelOpacity" type="range" min="45" max="98" value="87" step="1"><output class="value" id="panelOpacityValue">87%</output></div>
          <div class="surfaceGrid"><button class="btn active" id="darkTheme">Dark glass</button><button class="btn" id="lightTheme">Light glass</button></div>
          <div class="rowButtons"><button class="btn" id="resetSettings">Reset settings</button><button class="btn" id="backPreview">Back to preview</button></div>
          <div class="note" id="modeNote">SVG refraction is applied to the local preview clone. Browser security prevents a generic Console script from sampling arbitrary pixels behind the floating panel on every website.</div>
        </section>
      </main>
      <footer class="footer"><span class="status"><i class="green"></i>SVG refraction preview active</span><span>LIQUID GLASS · 01</span></footer>
    </section>`;
  document.documentElement.appendChild(host);

  const $ = id => ui.getElementById(id);
  const state = {
    surfaceType:"convex_squircle",
    bezelWidth:30,
    glassThickness:150,
    refractiveIndex:1.5,
    refractionScale:1.5,
    specularOpacity:.7,
    blur:.5,
    objectWidth:220,
    objectHeight:130,
    radius:65
  };
  const surfaceEquations = {
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

  const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
  function imageDataURL(data){
    const canvas=document.createElement("canvas");
    canvas.width=data.width;canvas.height=data.height;
    const ctx=canvas.getContext("2d",{willReadFrequently:false});
    ctx.putImageData(data,0,0);
    return canvas.toDataURL("image/png");
  }

  function calculateDisplacement1D(){
    const eta=1/state.refractiveIndex;
    const result=[];
    const samples=128;
    for(let i=0;i<samples;i++){
      const x=i/samples;
      const y=surfaceEquations[state.surfaceType](x);
      const x1=clamp(x-.0001,0,1);
      const x2=clamp(x+.0001,0,1);
      const derivative=(surfaceEquations[state.surfaceType](x2)-surfaceEquations[state.surfaceType](x1))/Math.max(.000001,x2-x1);
      const magnitude=Math.sqrt(derivative*derivative+1);
      const normalX=-derivative/magnitude;
      const normalY=-1/magnitude;
      const dot=normalY;
      const k=1-eta*eta*(1-dot*dot);
      if(k<0){result.push(0);continue}
      const root=Math.sqrt(k);
      const refractedX=-(eta*dot+root)*normalX;
      const refractedY=eta-(eta*dot+root)*normalY;
      if(!Number.isFinite(refractedX)||!Number.isFinite(refractedY)||Math.abs(refractedY)<.00001){result.push(0);continue}
      const remaining=y*state.bezelWidth+state.glassThickness;
      result.push(clamp(refractedX*(remaining/refractedY),-1000,1000));
    }
    return result;
  }

  function calculateDisplacementMap(width,height,precomputed){
    const canvas=document.createElement("canvas");
    canvas.width=width;canvas.height=height;
    const ctx=canvas.getContext("2d",{willReadFrequently:true});
    const data=ctx.createImageData(width,height);
    for(let i=0;i<data.data.length;i+=4){data.data[i]=128;data.data[i+1]=128;data.data[i+2]=0;data.data[i+3]=255}
    const radius=Math.min(state.radius,height/2,width/2);
    const maxDisplacement=Math.max(1,...precomputed.map(Math.abs));
    const radiusSquared=radius*radius;
    const plusSquared=(radius+1)*(radius+1);
    const innerSquared=Math.max(0,(radius-state.bezelWidth)*(radius-state.bezelWidth));
    const xGap=width-radius*2;
    const yGap=height-radius*2;
    for(let py=0;py<height;py++){
      for(let px=0;px<width;px++){
        const left=px<radius;
        const right=px>=width-radius;
        const top=py<radius;
        const bottom=py>=height-radius;
        const x=left?px-radius:right?px-radius-xGap:0;
        const y=top?py-radius:bottom?py-radius-yGap:0;
        const d2=x*x+y*y;
        if(d2>plusSquared||d2<innerSquared)continue;
        const dist=Math.sqrt(d2);
        const opacity=d2<radiusSquared?1:1-(dist-radius)/(Math.sqrt(plusSquared)-radius);
        const distFromSide=radius-dist;
        const ratio=clamp(distFromSide/state.bezelWidth,0,1);
        const index=clamp(Math.floor(ratio*precomputed.length),0,precomputed.length-1);
        const displacement=precomputed[index]||0;
        const dx=clamp((-((dist>0)?x/dist:0)*displacement/maxDisplacement),-1,1);
        const dy=clamp((-((dist>0)?y/dist:0)*displacement/maxDisplacement),-1,1);
        const offset=(py*width+px)*4;
        data.data[offset]=clamp(128+dx*127*opacity,0,255);
        data.data[offset+1]=clamp(128+dy*127*opacity,0,255);
      }
    }
    return data;
  }

  function calculateSpecular(width,height){
    const canvas=document.createElement("canvas");
    canvas.width=width;canvas.height=height;
    const ctx=canvas.getContext("2d",{willReadFrequently:true});
    const data=ctx.createImageData(width,height);
    const radius=Math.min(state.radius,height/2,width/2);
    const maxR=(radius+1)*(radius+1);
    const minR=Math.max(0,(radius-1.5)*(radius-1.5));
    const xGap=width-radius*2;
    const yGap=height-radius*2;
    const vx=Math.cos(Math.PI/3),vy=Math.sin(Math.PI/3);
    for(let py=0;py<height;py++){
      for(let px=0;px<width;px++){
        const left=px<radius,right=px>=width-radius,top=py<radius,bottom=py>=height-radius;
        const x=left?px-radius:right?px-radius-xGap:0;
        const y=top?py-radius:bottom?py-radius-yGap:0;
        const d2=x*x+y*y;
        if(d2>maxR||d2<minR)continue;
        const dist=Math.sqrt(d2);
        const opacity=d2<radius*radius?1:1-(dist-radius)/(Math.sqrt(maxR)-radius);
        const cos=dist>0?x/dist:0;
        const sin=dist>0?-y/dist:0;
        const dot=Math.abs(cos*vx+sin*vy);
        const edgeRatio=clamp((radius-dist)/1.5,0,1);
        const falloff=Math.sqrt(Math.max(0,1-Math.pow(1-edgeRatio,2)));
        const coeff=dot*falloff;
        const color=Math.min(255,255*coeff);
        const alpha=Math.min(255,color*coeff*opacity);
        const offset=(py*width+px)*4;
        data.data[offset]=color;data.data[offset+1]=color;data.data[offset+2]=color;data.data[offset+3]=alpha;
      }
    }
    return data;
  }

  let filterFrame=0;
  function updateFilter(){
    if(filterFrame)cancelAnimationFrame(filterFrame);
    filterFrame=requestAnimationFrame(()=>{
      filterFrame=0;
      const lens=$("lens");
      const width=Math.max(80,Math.round(lens.clientWidth));
      const height=Math.max(60,Math.round(lens.clientHeight));
      state.objectWidth=width;state.objectHeight=height;state.radius=Math.min(65,height/2,width/2);
      const displacement=calculateDisplacement1D();
      const map=calculateDisplacementMap(width,height,displacement);
      const highlight=calculateSpecular(width,height);
      $("displacementImage").setAttribute("href",imageDataURL(map));
      $("specularImage").setAttribute("href",imageDataURL(highlight));
      $("displacementImage").setAttribute("width",width);
      $("displacementImage").setAttribute("height",height);
      $("specularImage").setAttribute("width",width);
      $("specularImage").setAttribute("height",height);
      $("displacementMap").setAttribute("scale",String(Math.max(...displacement.map(Math.abs))*state.refractionScale));
      $("specularAlpha").setAttribute("slope",String(state.specularOpacity));
      $("filterBlur").setAttribute("stdDeviation",String(state.blur));
      updateClone();
    });
  }

  function updateClone(){
    const stage=$("stage"),lens=$("lens"),clone=$("cloneInner");
    const art=$("art");
    clone.innerHTML=art.innerHTML;
    clone.style.width=stage.clientWidth+"px";
    clone.style.height=stage.clientHeight+"px";
    clone.style.transform="translate("+(-lens.offsetLeft)+"px,"+(-lens.offsetTop)+"px)";
    clone.style.display="grid";
    clone.style.gridTemplateColumns="1fr .86fr";
    clone.style.gap="13px";
    clone.style.padding="18px";
    clone.style.position="absolute";
    clone.style.left="0";
    clone.style.top="0";
    clone.style.backgroundImage=getComputedStyle(stage).backgroundImage;
    clone.style.backgroundSize=getComputedStyle(stage).backgroundSize;
    clone.style.backgroundColor=getComputedStyle(stage).backgroundColor;
    clone.style.color="var(--text-primary)";
  }

  function refreshValue(id,suffix,decimals){
    const slider=$(id),out=$(id+"Value");
    out.textContent=(decimals===undefined?String(slider.value):Number(slider.value).toFixed(decimals))+suffix;
  }
  const sliderConfig=[
    ["bezelWidth"," px",0,"bezelWidth"],
    ["glassThickness","",0,"glassThickness"],
    ["refractiveIndex","",2,"refractiveIndex"],
    ["refractionScale","",2,"refractionScale"],
    ["specularOpacity","",2,"specularOpacity"],
    ["blur"," px",1,"blur"]
  ];
  sliderConfig.forEach(([id,suffix,decimals,key])=>{
    $(id).addEventListener("input",()=>{
      state[key]=Number($(id).value);
      refreshValue(id,suffix,decimals);
      if(id==="bezelWidth")state.bezelWidth=Math.max(1,state.bezelWidth);
      updateFilter();
    });
  });
  $("shellBlur").addEventListener("input",()=>{
    $("window").style.setProperty("--shell-blur",Number($("shellBlur").value)+"px");
    $("shellBlurValue").textContent=$("shellBlur").value+" px";
  });
  $("panelOpacity").addEventListener("input",()=>{
    $("window").style.background="rgba(30,30,40,"+(Number($("panelOpacity").value)/100)+")";
    $("panelOpacityValue").textContent=$("panelOpacity").value+"%";
  });

  ui.querySelectorAll("[data-surface]").forEach(btn=>btn.addEventListener("click",()=>{
    ui.querySelectorAll("[data-surface]").forEach(b=>b.classList.toggle("active",b===btn));
    state.surfaceType=btn.dataset.surface;
    updateFilter();
  }));

  function setTheme(mode){
    const dark=mode==="dark";
    host.dataset.theme=mode;
    $("window").style.setProperty("--bg-primary",dark?"#1b1b22":"#f8fafc");
    $("window").style.setProperty("--bg-secondary",dark?"#0f0f14":"#e7eeef");
    $("window").style.setProperty("--text-primary",dark?"#f0f0f5":"#1a1a2e");
    $("window").style.setProperty("--text-secondary",dark?"rgba(255,255,255,.68)":"rgba(0,0,0,.68)");
    $("window").style.setProperty("--border-color",dark?"rgba(255,255,255,.12)":"rgba(0,0,0,.12)");
    $("window").style.setProperty("--panel-bg",dark?"rgba(30,30,40,.87)":"rgba(255,255,255,.88)");
    $("darkTheme").classList.toggle("active",dark);
    $("lightTheme").classList.toggle("active",!dark);
  }
  $("darkTheme").onclick=()=>setTheme("dark");
  $("lightTheme").onclick=()=>setTheme("light");

  function showPage(name){
    $("page-preview").hidden=name!=="preview";
    $("page-settings").hidden=name!=="settings";
    ui.querySelectorAll("[data-page]").forEach(tab=>tab.classList.toggle("active",tab.dataset.page===name));
    if(name==="preview")updateClone();
  }
  ui.querySelectorAll("[data-page]").forEach(tab=>tab.onclick=()=>showPage(tab.dataset.page));
  $("openSettings").onclick=()=>showPage("settings");
  $("backPreview").onclick=()=>showPage("preview");
  $("min").onclick=()=>{
    const nav=ui.querySelector(".tabs"),main=ui.querySelector(".main");
    const hidden=main.hidden;
    main.hidden=!hidden;
    nav.hidden=!hidden;
    $("min").textContent=hidden?"−":"+";
  };
  $("close").onclick=()=>host.remove();

  function resetSettings(){
    const defaults={bezelWidth:30,glassThickness:150,refractiveIndex:1.5,refractionScale:1.5,specularOpacity:.7,blur:.5,shellBlur:18,panelOpacity:87};
    for(const [id,value] of Object.entries(defaults)){
      $(id).value=String(value);
      $(id).dispatchEvent(new Event("input"));
    }
    state.surfaceType="convex_squircle";
    ui.querySelectorAll("[data-surface]").forEach(b=>b.classList.toggle("active",b.dataset.surface==="convex_squircle"));
    setTheme("dark");
    updateFilter();
  }
  $("resetSettings").onclick=resetSettings;
  $("resetPosition").onclick=()=>{
    $("lens").style.left="32px";
    $("lens").style.top="48px";
    updateClone();
  };

  let dragging=false,dx=0,dy=0;
  $("drag").addEventListener("pointerdown",e=>{
    if(e.target.closest("button"))return;
    const rect=host.getBoundingClientRect();
    dragging=true;dx=e.clientX-rect.left;dy=e.clientY-rect.top;
    $("drag").setPointerCapture(e.pointerId);
  });
  $("drag").addEventListener("pointermove",e=>{
    if(!dragging)return;
    host.style.left=Math.max(0,Math.min(innerWidth-host.offsetWidth,e.clientX-dx))+"px";
    host.style.top=Math.max(0,Math.min(innerHeight-50,e.clientY-dy))+"px";
    host.style.right="auto";
  });
  $("drag").addEventListener("pointerup",()=>dragging=false);
  $("drag").addEventListener("pointercancel",()=>dragging=false);

  const lens=$("lens"),stage=$("stage");
  let lensDragging=false,lensDX=0,lensDY=0;
  lens.addEventListener("pointerdown",e=>{
    if(e.target.closest("button"))return;
    e.preventDefault();
    const rect=lens.getBoundingClientRect();
    lensDragging=true;lensDX=e.clientX-rect.left;lensDY=e.clientY-rect.top;
    lens.setPointerCapture(e.pointerId);
  });
  lens.addEventListener("pointermove",e=>{
    if(!lensDragging)return;
    const rect=stage.getBoundingClientRect();
    lens.style.left=clamp(e.clientX-rect.left-lensDX,0,stage.clientWidth-lens.offsetWidth)+"px";
    lens.style.top=clamp(e.clientY-rect.top-lensDY,0,stage.clientHeight-lens.offsetHeight)+"px";
    updateClone();
  });
  lens.addEventListener("pointerup",()=>lensDragging=false);
  lens.addEventListener("pointercancel",()=>lensDragging=false);
  window.addEventListener("resize",()=>{if(!document.getElementById(ID))return;updateFilter();updateClone()});

  setTheme("dark");
  updateFilter();
  console.info("ConeUI Liquid Glass loaded with editable optical settings.");
})();