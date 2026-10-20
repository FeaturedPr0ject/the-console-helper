(() => {
  const ID = "coneui-liquid-glass-float";
  document.getElementById(ID)?.remove();

  const host = document.createElement("div");
  host.id = ID;
  host.style.cssText = "all:initial;position:fixed;right:24px;top:24px;z-index:2147483647;pointer-events:none;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;color:#f0f0f5;";

  const style = document.createElement("style");
  style.textContent = [
    "#" + ID + " .cg-panel{--cg-bg:#1b1b22;--cg-bg2:#0f0f14;--cg-text:#f0f0f5;--cg-muted:rgba(255,255,255,.68);--cg-border:rgba(255,255,255,.13);--cg-panel:rgba(30,30,40,.76);--cg-accent:#8276e8;--cg-fallback-blur:18px;--cg-radius:24px;position:relative;isolation:auto;width:440px;max-width:calc(100vw - 24px);max-height:calc(100vh - 32px);display:flex;flex-direction:column;overflow:hidden;border:1px solid var(--cg-border);border-radius:var(--cg-radius);color:var(--cg-text);background:transparent;box-shadow:0 24px 85px rgba(0,0,0,.35),inset 0 1px rgba(255,255,255,.10);pointer-events:auto}",
    "#" + ID + " .cg-surface{position:absolute;inset:0;z-index:0;border-radius:inherit;pointer-events:none;background:var(--cg-panel);border:1px solid rgba(255,255,255,.12);backdrop-filter:blur(var(--cg-fallback-blur)) saturate(1.35);-webkit-backdrop-filter:blur(var(--cg-fallback-blur)) saturate(1.35)}",
    "#" + ID + " .cg-panel.cg-native .cg-surface{backdrop-filter:url(#coneui-liquid-filter);-webkit-backdrop-filter:url(#coneui-liquid-filter)}",
    "#" + ID + " .cg-stack{position:relative;z-index:1;display:flex;flex-direction:column;min-height:0;max-height:calc(100vh - 34px)}",
    "#" + ID + " .cg-head{height:58px;flex-shrink:0;display:flex;align-items:center;gap:11px;padding:0 15px;border-bottom:1px solid var(--cg-border);background:linear-gradient(120deg,rgba(255,255,255,.09),transparent 72%);cursor:move;user-select:none}",
    "#" + ID + " .cg-logo{width:31px;height:31px;display:grid;place-items:center;border-radius:11px;border:1px solid rgba(255,255,255,.25);background:linear-gradient(145deg,rgba(255,255,255,.30),rgba(255,255,255,.035));box-shadow:inset 0 1px rgba(255,255,255,.35);font-size:16px}",
    "#" + ID + " .cg-title{font-size:14px;font-weight:750;letter-spacing:-.2px}",
    "#" + ID + " .cg-subtitle{font-size:10px;color:var(--cg-muted);margin-top:2px}",
    "#" + ID + " .cg-spacer{flex:1}",
    "#" + ID + " button{font:inherit;color:inherit;cursor:pointer}",
    "#" + ID + " .cg-icon{width:29px;height:29px;display:grid;place-items:center;border-radius:9px;border:1px solid var(--cg-border);background:rgba(255,255,255,.055);font-size:16px}",
    "#" + ID + " .cg-icon:hover, " + "#" + ID + " .cg-btn:hover{background:rgba(255,255,255,.15)}",
    "#" + ID + " .cg-tabs{display:flex;gap:4px;padding:10px 14px 0;flex-shrink:0}",
    "#" + ID + " .cg-tab{border:1px solid transparent;background:transparent;color:var(--cg-muted);border-radius:9px;padding:8px 13px;font-size:11px}",
    "#" + ID + " .cg-tab.cg-active{color:var(--cg-text);background:rgba(255,255,255,.10);border-color:var(--cg-border)}",
    "#" + ID + " .cg-main{overflow:auto;min-height:0;max-height:calc(100vh - 145px);padding:15px}",
    "#" + ID + " .cg-page[hidden]{display:none}",
    "#" + ID + " .cg-overline{font-size:10px;text-transform:uppercase;letter-spacing:.16em;color:var(--cg-muted);margin:0 0 13px;font-weight:700}",
    "#" + ID + " .cg-section{display:flex;gap:10px;align-items:center;font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:var(--cg-muted);margin:17px 0 12px}",
    "#" + ID + " .cg-rule{height:1px;background:var(--cg-border);flex:1}",
    "#" + ID + " .cg-control{display:grid;grid-template-columns:142px 1fr 48px;gap:9px;align-items:center;margin:16px 0}",
    "#" + ID + " .cg-control label{font-size:11px;color:var(--cg-text)}",
    "#" + ID + " .cg-value{font:10px ui-monospace,SFMono-Regular,Consolas,monospace;text-align:right;color:var(--cg-muted);font-variant-numeric:tabular-nums}",
    "#" + ID + " input[type=range]{width:100%;min-width:35px;appearance:none;-webkit-appearance:none;height:3px;border-radius:99px;background:rgba(128,128,128,.35);outline:none;accent-color:var(--cg-accent)}",
    "#" + ID + " input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:13px;height:13px;border:1px solid rgba(255,255,255,.65);border-radius:50%;background:linear-gradient(145deg,#b2a7ff,#7669d7);box-shadow:0 1px 6px #0004;cursor:pointer}",
    "#" + ID + " input[type=range]::-moz-range-thumb{width:13px;height:13px;border:1px solid rgba(255,255,255,.65);border-radius:50%;background:#8e82ec;cursor:pointer}",
    "#" + ID + " .cg-grid{display:grid;grid-template-columns:1fr 1fr;gap:7px}",
    "#" + ID + " .cg-btn{border:1px solid var(--cg-border);border-radius:9px;background:rgba(255,255,255,.045);padding:9px 10px;text-align:center;font-size:10px;transition:background .15s,border-color .15s}",
    "#" + ID + " .cg-btn.cg-active{color:#fff;border-color:rgba(159,148,255,.75);background:linear-gradient(135deg,rgba(102,126,234,.9),rgba(118,75,162,.92))}",
    "#" + ID + " .cg-note{border:1px solid var(--cg-border);background:rgba(255,255,255,.045);border-radius:10px;padding:10px 11px;font-size:10px;line-height:1.5;color:var(--cg-muted);margin-top:14px}",
    "#" + ID + " .cg-footer{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 15px;border-top:1px solid var(--cg-border);font-size:9px;color:var(--cg-muted);flex-shrink:0}",
    "#" + ID + " .cg-status{display:flex;align-items:center;gap:6px}",
    "#" + ID + " .cg-dot{height:6px;width:6px;border-radius:50%;background:#76ddb1;box-shadow:0 0 8px #76ddb177}",
    "#" + ID + " .cg-hidden{display:none!important}",
    "#" + ID + " .cg-filter-defs{position:absolute;width:0;height:0;overflow:hidden;pointer-events:none}",
    "#" + ID + ".cg-light .cg-panel{--cg-bg:#f8fafc;--cg-bg2:#e7eeef;--cg-text:#1a1a2e;--cg-muted:rgba(0,0,0,.65);--cg-border:rgba(0,0,0,.13);--cg-panel:rgba(255,255,255,.66)}",
    "#" + ID + ".cg-light .cg-head{background:linear-gradient(120deg,rgba(255,255,255,.55),transparent 72%)}",
    "#" + ID + ".cg-light .cg-btn, " + "#" + ID + ".cg-light .cg-icon{background:rgba(255,255,255,.22)}",
    "#" + ID + ".cg-light .cg-surface{border-color:rgba(255,255,255,.65)}",
    "@media(max-width:500px){#" + ID + " .cg-panel{width:calc(100vw - 16px);max-width:calc(100vw - 16px)}#" + ID + " .cg-control{grid-template-columns:112px 1fr 43px}#" + ID + " .cg-main{padding:13px}}",
    "@media(prefers-reduced-motion:reduce){#" + ID + " *{scroll-behavior:auto!important;transition:none!important}}"
  ].join("\\n");

  host.appendChild(style);
  host.innerHTML += [
    '<section class="cg-panel" id="cg-panel">',
    '<div class="cg-surface" id="cg-surface"></div>',
    '<svg class="cg-filter-defs" aria-hidden="true"><defs>',
    '<filter id="coneui-liquid-filter" x="-15%" y="-15%" width="130%" height="130%" color-interpolation-filters="sRGB">',
    '<feGaussianBlur id="cg-filter-blur" in="SourceGraphic" stdDeviation="0.5" result="cg-blurred"/>',
    '<feImage id="cg-displacement-image" href="" x="0" y="0" width="440" height="520" result="cg-displacement-map" preserveAspectRatio="none"/>',
    '<feDisplacementMap id="cg-displacement-map-filter" in="cg-blurred" in2="cg-displacement-map" scale="80" xChannelSelector="R" yChannelSelector="G" result="cg-displaced"/>',
    '<feColorMatrix in="cg-displaced" type="saturate" values="1.3" result="cg-saturated"/>',
    '<feImage id="cg-specular-image" href="" x="0" y="0" width="440" height="520" result="cg-specular-layer" preserveAspectRatio="none"/>',
    '<feComponentTransfer in="cg-specular-layer" result="cg-specular-faded"><feFuncA id="cg-specular-alpha" type="linear" slope="0.7"/></feComponentTransfer>',
    '<feBlend in="cg-specular-faded" in2="cg-saturated" mode="screen"/>',
    '</filter></defs></svg>',
    '<div class="cg-stack" id="cg-stack">',
    '<header class="cg-head" id="cg-drag"><div class="cg-logo">◈</div><div><div class="cg-title">ConeUI Liquid Glass</div><div class="cg-subtitle">Optical material settings</div></div><div class="cg-spacer"></div><button class="cg-icon" id="cg-min" title="Minimize">−</button><button class="cg-icon" id="cg-close" title="Close">×</button></header>',
    '<nav class="cg-tabs"><button class="cg-tab cg-active" data-page="material">Liquid Glass</button><button class="cg-tab" data-page="appearance">Appearance</button></nav>',
    '<main class="cg-main" id="cg-main">',
    '<section class="cg-page" id="cg-page-material">',
    '<p class="cg-overline">Optical surface · live panel</p>',
    '<div class="cg-note" style="margin-top:0">These controls change the glass material applied to this floating panel itself. The page behind it is the refraction source when Chrome supports SVG backdrop filters.</div>',
    '<div class="cg-section">Surface profile <span class="cg-rule"></span></div>',
    '<div class="cg-grid">',
    '<button class="cg-btn cg-active" data-surface="convex_squircle">Convex Squircle</button>',
    '<button class="cg-btn" data-surface="convex_circle">Convex Circle</button>',
    '<button class="cg-btn" data-surface="concave">Concave</button>',
    '<button class="cg-btn" data-surface="lip">Soft Lip</button>',
    '</div>',
    '<div class="cg-section">Optical parameters <span class="cg-rule"></span></div>',
    '<div class="cg-control"><label for="cg-bezel">Bezel width</label><input id="cg-bezel" type="range" min="3" max="18" value="10" step="1"><output class="cg-value" id="cg-bezel-value">10 px</output></div>',
    '<div class="cg-control"><label for="cg-thickness">Glass thickness</label><input id="cg-thickness" type="range" min="20" max="240" value="150" step="5"><output class="cg-value" id="cg-thickness-value">150</output></div>',
    '<div class="cg-control"><label for="cg-index">Refractive index</label><input id="cg-index" type="range" min="1.1" max="2.2" value="1.5" step="0.05"><output class="cg-value" id="cg-index-value">1.50</output></div>',
    '<div class="cg-control"><label for="cg-refraction">Refraction strength</label><input id="cg-refraction" type="range" min="0.2" max="3.5" value="1.5" step="0.1"><output class="cg-value" id="cg-refraction-value">1.50</output></div>',
    '<div class="cg-control"><label for="cg-specular">Edge highlight</label><input id="cg-specular" type="range" min="0" max="1.5" value="0.7" step="0.05"><output class="cg-value" id="cg-specular-value">0.70</output></div>',
    '<div class="cg-control"><label for="cg-blur">Optical softness</label><input id="cg-blur" type="range" min="0" max="3" value="0.5" step="0.1"><output class="cg-value" id="cg-blur-value">0.5 px</output></div>',
    '<div class="cg-section">Actions <span class="cg-rule"></span></div>',
    '<div class="cg-grid"><button class="cg-btn" id="cg-reset-optical">Reset optical settings</button><button class="cg-btn" id="cg-rebuild">Re-render glass</button></div>',
    '</section>',
    '<section class="cg-page" id="cg-page-appearance" hidden>',
    '<p class="cg-overline">Panel appearance</p>',
    '<div class="cg-control"><label for="cg-ui-blur">Fallback background blur</label><input id="cg-ui-blur" type="range" min="0" max="36" value="18" step="1"><output class="cg-value" id="cg-ui-blur-value">18 px</output></div>',
    '<div class="cg-control"><label for="cg-opacity">Glass tint opacity</label><input id="cg-opacity" type="range" min="4" max="55" value="18" step="1"><output class="cg-value" id="cg-opacity-value">18%</output></div>',
    '<div class="cg-control"><label for="cg-radius">Corner radius</label><input id="cg-radius" type="range" min="14" max="42" value="24" step="1"><output class="cg-value" id="cg-radius-value">24 px</output></div>',
    '<div class="cg-section">Color scheme <span class="cg-rule"></span></div>',
    '<div class="cg-grid"><button class="cg-btn" id="cg-dark">Dark glass</button><button class="cg-btn" id="cg-light">Light glass</button></div>',
    '<div class="cg-note" id="cg-render-status">Preparing liquid glass renderer…</div>',
    '<div class="cg-grid" style="margin-top:12px"><button class="cg-btn" id="cg-reset-all">Reset all settings</button><button class="cg-btn" id="cg-center">Restore position</button></div>',
    '</section>',
    '</main>',
    '<footer class="cg-footer"><span class="cg-status"><i class="cg-dot"></i><span id="cg-status-text">SVG glass renderer</span></span><span>Inspired by winaviation/liquid-glass-demo</span></footer>',
    '</div></section>'
  ].join("");

  document.documentElement.appendChild(host);

  const $ = id => host.querySelector("#" + id);
  const panel = $("cg-panel");
  const surface = $("cg-surface");
  const state = {
    surfaceType: "convex_squircle",
    bezelWidth: 10,
    glassThickness: 150,
    refractiveIndex: 1.5,
    refractionScale: 1.5,
    specularOpacity: 0.7,
    blur: 0.5,
    uiBlur: 18,
    opacity: 18,
    radius: 24,
    theme: "dark"
  };

  const clamp = (n, low, high) => Math.max(low, Math.min(high, n));
  const SurfaceEquations = {
    convex_circle: x => Math.sqrt(Math.max(0, 1 - Math.pow(1 - x, 2))),
    convex_squircle: x => Math.pow(Math.max(0, 1 - Math.pow(1 - x, 4)), 0.25),
    concave: x => 1 - Math.sqrt(Math.max(0, 1 - x * x)),
    lip: x => {
      const convex = Math.pow(Math.max(0, 1 - Math.pow(1 - Math.min(x * 2, 1), 4)), 0.25);
      const concave = 1 - Math.sqrt(Math.max(0, 1 - Math.pow(1 - x, 2))) + 0.1;
      const smootherstep = 6 * Math.pow(x, 5) - 15 * Math.pow(x, 4) + 10 * Math.pow(x, 3);
      return convex * (1 - smootherstep) + concave * smootherstep;
    }
  };

  function calculateDisplacement1D() {
    const eta = 1 / state.refractiveIndex;
    const result = [];
    const samples = 128;
    for (let i = 0; i < samples; i++) {
      const x = i / samples;
      const y = SurfaceEquations[state.surfaceType](x);
      const dx = x < 1 ? 0.0001 : -0.0001;
      const x2 = clamp(x + dx, 0, 1);
      const derivative = (SurfaceEquations[state.surfaceType](x2) - y) / (x2 - x || dx);
      const magnitude = Math.sqrt(derivative * derivative + 1);
      const normalX = -derivative / magnitude;
      const normalY = -1 / magnitude;
      const dot = normalY;
      const k = 1 - eta * eta * (1 - dot * dot);
      if (k < 0) {
        result.push(0);
        continue;
      }
      const root = Math.sqrt(k);
      const refractedX = -(eta * dot + root) * normalX;
      const refractedY = eta - (eta * dot + root) * normalY;
      if (!Number.isFinite(refractedX) || !Number.isFinite(refractedY) || Math.abs(refractedY) < 0.00001) {
        result.push(0);
        continue;
      }
      const remainingHeight = y * state.bezelWidth + state.glassThickness;
      result.push(clamp(refractedX * (remainingHeight / refractedY), -1000, 1000));
    }
    return result;
  }

  function imageDataToURL(imageData) {
    const canvas = document.createElement("canvas");
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    const context = canvas.getContext("2d");
    context.putImageData(imageData, 0, 0);
    return canvas.toDataURL("image/png");
  }

  function calculateDisplacementMap(width, height, precomputed) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    const image = context.createImageData(width, height);
    for (let i = 0; i < image.data.length; i += 4) {
      image.data[i] = 128;
      image.data[i + 1] = 128;
      image.data[i + 2] = 0;
      image.data[i + 3] = 255;
    }

    const radius = Math.min(state.radius, height / 2, width / 2);
    const maxDisplacement = Math.max(1, ...precomputed.map(Math.abs));
    const radiusSquared = radius * radius;
    const plusSquared = (radius + 1) * (radius + 1);
    const innerSquared = Math.max(0, (radius - state.bezelWidth) * (radius - state.bezelWidth));
    const widthBetween = width - radius * 2;
    const heightBetween = height - radius * 2;

    for (let y1 = 0; y1 < height; y1++) {
      for (let x1 = 0; x1 < width; x1++) {
        const left = x1 < radius;
        const right = x1 >= width - radius;
        const top = y1 < radius;
        const bottom = y1 >= height - radius;
        const x = left ? x1 - radius : right ? x1 - radius - widthBetween : 0;
        const y = top ? y1 - radius : bottom ? y1 - radius - heightBetween : 0;
        const distanceSquared = x * x + y * y;
        if (distanceSquared > plusSquared || distanceSquared < innerSquared) continue;

        const distance = Math.sqrt(distanceSquared);
        const opacity = distanceSquared < radiusSquared ? 1 : 1 - (distance - radius) / (Math.sqrt(plusSquared) - radius);
        const distanceFromSide = radius - distance;
        const ratio = clamp(distanceFromSide / state.bezelWidth, 0, 1);
        const mapIndex = clamp(Math.floor(ratio * precomputed.length), 0, precomputed.length - 1);
        const displacement = precomputed[mapIndex] || 0;
        const dx = -(distance > 0 ? x / distance : 0) * displacement / maxDisplacement;
        const dy = -(distance > 0 ? y / distance : 0) * displacement / maxDisplacement;
        const offset = (y1 * width + x1) * 4;
        image.data[offset] = clamp(128 + dx * 127 * opacity, 0, 255);
        image.data[offset + 1] = clamp(128 + dy * 127 * opacity, 0, 255);
      }
    }
    return image;
  }

  function calculateSpecularHighlight(width, height) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    const image = context.createImageData(width, height);
    const radius = Math.min(state.radius, height / 2, width / 2);
    const specularThickness = 1.5;
    const radiusSquared = radius * radius;
    const plusSquared = (radius + 1) * (radius + 1);
    const innerSquared = Math.max(0, (radius - specularThickness) * (radius - specularThickness));
    const widthBetween = width - radius * 2;
    const heightBetween = height - radius * 2;
    const vectorX = Math.cos(Math.PI / 3);
    const vectorY = Math.sin(Math.PI / 3);

    for (let y1 = 0; y1 < height; y1++) {
      for (let x1 = 0; x1 < width; x1++) {
        const left = x1 < radius;
        const right = x1 >= width - radius;
        const top = y1 < radius;
        const bottom = y1 >= height - radius;
        const x = left ? x1 - radius : right ? x1 - radius - widthBetween : 0;
        const y = top ? y1 - radius : bottom ? y1 - radius - heightBetween : 0;
        const distanceSquared = x * x + y * y;
        if (distanceSquared > plusSquared || distanceSquared < innerSquared) continue;

        const distance = Math.sqrt(distanceSquared);
        const opacity = distanceSquared < radiusSquared ? 1 : 1 - (distance - radius) / (Math.sqrt(plusSquared) - radius);
        const cos = distance > 0 ? x / distance : 0;
        const sin = distance > 0 ? -y / distance : 0;
        const dot = Math.abs(cos * vectorX + sin * vectorY);
        const edgeRatio = clamp((radius - distance) / specularThickness, 0, 1);
        const falloff = Math.sqrt(Math.max(0, 1 - Math.pow(1 - edgeRatio, 2)));
        const coefficient = dot * falloff;
        const color = Math.min(255, 255 * coefficient);
        const alpha = Math.min(255, color * coefficient * opacity);
        const offset = (y1 * width + x1) * 4;
        image.data[offset] = color;
        image.data[offset + 1] = color;
        image.data[offset + 2] = color;
        image.data[offset + 3] = alpha;
      }
    }
    return image;
  }

  let renderFrame = 0;
  let lastWidth = 0;
  let lastHeight = 0;
  function renderLiquidGlass(force) {
    if (renderFrame) cancelAnimationFrame(renderFrame);
    renderFrame = requestAnimationFrame(() => {
      renderFrame = 0;
      const rect = panel.getBoundingClientRect();
      const width = Math.round(rect.width);
      const height = Math.round(rect.height);
      if (width < 20 || height < 20) return;
      if (!force && width === lastWidth && height === lastHeight) {
        updateFilterParameters();
        return;
      }
      lastWidth = width;
      lastHeight = height;
      state.radius = Math.min(state.radius, Math.round(height / 2), Math.round(width / 2));
      const profile = calculateDisplacement1D();
      const displacement = calculateDisplacementMap(width, height, profile);
      const specular = calculateSpecularHighlight(width, height);
      const displacementImage = $("cg-displacement-image");
      const specularImage = $("cg-specular-image");
      [displacementImage, specularImage].forEach(image => {
        image.setAttribute("x", "0");
        image.setAttribute("y", "0");
        image.setAttribute("width", String(width));
        image.setAttribute("height", String(height));
      });
      displacementImage.setAttribute("href", imageDataToURL(displacement));
      specularImage.setAttribute("href", imageDataToURL(specular));
      $("cg-displacement-map-filter").setAttribute("scale", String(Math.max(...profile.map(Math.abs)) * state.refractionScale));
      updateFilterParameters();
    });
  }

  function updateFilterParameters() {
    $("cg-filter-blur").setAttribute("stdDeviation", String(state.blur));
    $("cg-specular-alpha").setAttribute("slope", String(state.specularOpacity));
    $("cg-panel").style.setProperty("--cg-fallback-blur", state.uiBlur + "px");
    $("cg-panel").style.setProperty("--cg-radius", state.radius + "px");
    $("cg-panel").style.setProperty("--cg-panel", state.theme === "dark" ? "rgba(30,30,40," + (state.opacity / 100) + ")" : "rgba(255,255,255," + (state.opacity / 100) + ")");
    $("cg-displacement-map-filter").setAttribute("scale", String(Math.max(...calculateDisplacement1D().map(Math.abs)) * state.refractionScale));
  }

  function updateValue(id, suffix, digits) {
    const value = Number($(id).value);
    $(id + "-value").textContent = (digits === undefined ? String(value) : value.toFixed(digits)) + suffix;
  }

  const opticalControls = [
    ["cg-bezel", " px", 0, "bezelWidth"],
    ["cg-thickness", "", 0, "glassThickness"],
    ["cg-index", "", 2, "refractiveIndex"],
    ["cg-refraction", "", 2, "refractionScale"],
    ["cg-specular", "", 2, "specularOpacity"],
    ["cg-blur", " px", 1, "blur"]
  ];
  opticalControls.forEach(([id, suffix, digits, key]) => {
    $(id).addEventListener("input", () => {
      state[key] = Number($(id).value);
      updateValue(id, suffix, digits);
      if (key === "bezelWidth") state.bezelWidth = clamp(state.bezelWidth, 1, state.radius - 1);
      renderLiquidGlass(true);
    });
  });

  $("cg-ui-blur").addEventListener("input", () => {
    state.uiBlur = Number($("cg-ui-blur").value);
    updateValue("cg-ui-blur", " px", 0);
    updateFilterParameters();
  });
  $("cg-opacity").addEventListener("input", () => {
    state.opacity = Number($("cg-opacity").value);
    updateValue("cg-opacity", "%", 0);
    updateFilterParameters();
  });
  $("cg-radius").addEventListener("input", () => {
    state.radius = Number($("cg-radius").value);
    state.bezelWidth = Math.min(state.bezelWidth, state.radius - 1);
    $("cg-bezel").value = String(state.bezelWidth);
    updateValue("cg-bezel", " px", 0);
    updateValue("cg-radius", " px", 0);
    updateFilterParameters();
    renderLiquidGlass(true);
  });

  host.querySelectorAll("[data-surface]").forEach(button => {
    button.addEventListener("click", () => {
      host.querySelectorAll("[data-surface]").forEach(item => item.classList.toggle("cg-active", item === button));
      state.surfaceType = button.dataset.surface;
      renderLiquidGlass(true);
    });
  });

  function setTheme(theme) {
    state.theme = theme;
    host.classList.toggle("cg-light", theme === "light");
    $("cg-dark").classList.toggle("cg-active", theme === "dark");
    $("cg-light").classList.toggle("cg-active", theme === "light");
    updateFilterParameters();
  }
  $("cg-dark").onclick = () => setTheme("dark");
  $("cg-light").onclick = () => setTheme("light");

  function showPage(page) {
    $("cg-page-material").hidden = page !== "material";
    $("cg-page-appearance").hidden = page !== "appearance";
    host.querySelectorAll("[data-page]").forEach(tab => tab.classList.toggle("cg-active", tab.dataset.page === page));
  }
  host.querySelectorAll("[data-page]").forEach(tab => tab.addEventListener("click", () => showPage(tab.dataset.page)));

  $("cg-min").onclick = () => {
    const collapsed = $("cg-stack").classList.toggle("cg-collapsed");
    $("cg-main").classList.toggle("cg-hidden", collapsed);
    host.querySelector(".cg-tabs").classList.toggle("cg-hidden", collapsed);
    $("cg-min").textContent = collapsed ? "+" : "−";
    requestAnimationFrame(() => renderLiquidGlass(true));
  };
  $("cg-close").onclick = () => host.remove();

  function resetOptical() {
    const defaults = { "cg-bezel":10, "cg-thickness":150, "cg-index":1.5, "cg-refraction":1.5, "cg-specular":0.7, "cg-blur":0.5 };
    opticalControls.forEach(([id, suffix, digits, key]) => {
      $(id).value = String(defaults[id]);
      state[key] = defaults[id];
      updateValue(id, suffix, digits);
    });
    state.surfaceType = "convex_squircle";
    host.querySelectorAll("[data-surface]").forEach(button => button.classList.toggle("cg-active", button.dataset.surface === state.surfaceType));
    renderLiquidGlass(true);
  }
  $("cg-reset-optical").onclick = resetOptical;

  function resetAll() {
    resetOptical();
    $("cg-ui-blur").value = "18";
    $("cg-opacity").value = "18";
    $("cg-radius").value = "24";
    state.uiBlur = 18;
    state.opacity = 18;
    state.radius = 24;
    state.bezelWidth = 10;
    updateValue("cg-ui-blur", " px", 0);
    updateValue("cg-opacity", "%", 0);
    updateValue("cg-radius", " px", 0);
    setTheme("dark");
    updateFilterParameters();
    renderLiquidGlass(true);
  }
  $("cg-reset-all").onclick = resetAll;
  $("cg-center").onclick = () => {
    host.style.left = "";
    host.style.top = "24px";
    host.style.right = "24px";
  };

  let dragging = false;
  let dragX = 0;
  let dragY = 0;
  $("cg-drag").addEventListener("pointerdown", event => {
    if (event.target.closest("button")) return;
    const rect = host.getBoundingClientRect();
    dragging = true;
    dragX = event.clientX - rect.left;
    dragY = event.clientY - rect.top;
    $("cg-drag").setPointerCapture(event.pointerId);
  });
  $("cg-drag").addEventListener("pointermove", event => {
    if (!dragging) return;
    host.style.left = clamp(event.clientX - dragX, 0, innerWidth - panel.offsetWidth) + "px";
    host.style.top = clamp(event.clientY - dragY, 0, innerHeight - 44) + "px";
    host.style.right = "auto";
  });
  $("cg-drag").addEventListener("pointerup", () => { dragging = false; });
  $("cg-drag").addEventListener("pointercancel", () => { dragging = false; });

  const supportsSVGBackdrop = !!(window.CSS && CSS.supports && CSS.supports("backdrop-filter", "url(#coneui-liquid-filter)"));
  if (supportsSVGBackdrop) {
    panel.classList.add("cg-native");
    $("cg-render-status").textContent = "This browser accepts SVG backdrop-filter syntax. If refraction does not render, Chrome may not support SVG backdrop filters on this build; the panel will still use the blur fallback.";
    $("cg-status-text").textContent = "SVG liquid filter attached";
  } else {
    $("cg-render-status").textContent = "This browser does not accept SVG backdrop-filter syntax. The UI is using its CSS blur fallback; the refraction maps are still generated.";
    $("cg-status-text").textContent = "CSS blur fallback";
  }

  const observer = new ResizeObserver(() => renderLiquidGlass(true));
  observer.observe(panel);
  setTheme("dark");
  renderLiquidGlass(true);
  console.info("ConeUI: Liquid Glass is now rendered on the floating panel itself; no demo page or iframe is embedded.");
})();