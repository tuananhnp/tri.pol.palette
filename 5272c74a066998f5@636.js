import define1 from "./a01396c4fb4e9672@83.js";
import define2 from "./8d271c22db968ab0@160.js";

function _1(md){return(
md`# TriPol Palette Tool`
)}

function _svgFile(Inputs){return(
Inputs.file({ label: "Upload SVG:", accept: ".svg" })
)}

function _3(paletteDisplay,palette){return(
paletteDisplay(palette)
)}

function _display(htl,$0,testimg)
{
  let panel = htl.html`<div>`;
  let pane1 = $0;
  let pane2 = testimg;
  Object.assign(pane1.style, {
    display: "inline-block",
    verticalAlign: "middle"
  });
  Object.assign(pane2.style, {
    display: "inline-block",
    verticalAlign: "middle",
    paddingLeft: "20px",
    width: "520"
  });
  panel.append(pane1, pane2);
  return panel;
}


function _shuffle(htl,d3,$0)
{
  let button = htl.html`<button>Shuffle Colors in SVG`;
  button.onclick = () => {
    d3.shuffle($0.value);
    $0.value = $0.value; // trigger update
  };
  return button;
}


function _rgb(form,html){return(
form(html`<form>
<input name="c1" type='color' value='#FF6600'/>
<input name="c2" type='color' value='#FFD500'/>
<br/>
<input name="c3" type='color' value='#00AAFF'/>
<input name="c4" type='color' value='#FFFFFF'/>
</form>`)
)}

function _gradientType(Inputs){return(
Inputs.select(["Triangle - 3 colors", "Regtangle - 4 colors"], {
  label: "Gradient Geometry"
})
)}

function _mode(Inputs){return(
Inputs.select(["lrgb", "rgb"], { label: "Color Space" })
)}

function _9(htl,display,XMLSerializer)
{
  const save = htl.html`<button>Save SVG`;
  save.onclick = () => {
    var link = document.createElement("a");
    link.download = "example.svg";

    const svg = display.children[1];
    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svg);

    if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
      source = source.replace(
        /^<svg/,
        '<svg xmlns="http://www.w3.org/2000/svg"'
      );
    }
    if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
      source = source.replace(
        /^<svg/,
        '<svg xmlns:xlink="http://www.w3.org/1999/xlink"'
      );
    }

    source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

    const url =
      "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
    link.href = url;
    link.click();
  };
  return save;
}


function _10(htl,$0)
{
  const save = htl.html`<button>Save Gradient as PNG`;
  save.onclick = () => {
    var link = document.createElement("a");
    link.download = "image.png";
    const canvas = $0.children[0];
    canvas.drawImageData();
    link.href = canvas.toDataURL("image/png");
    canvas.drawInteractionWidgets();
    link.click();
  };
  return save;
}


function _11(md){return(
md`<hr>`
)}

function _palette(DOM,rgb,gradientType,colorInterpolationImgDataTriangle,mode,colorInterpolationImgData,htl,Event,triangleInteraction)
{
  const width = 500,
    height = 500;
  const ctx = DOM.context2d(width, height, 1);
  const imgData = ctx.getImageData(0, 0, width, height);
  const setImgData = () => {
    const colors = rgb.value;
    if (gradientType == "Triangle - 3 colors") {
      colorInterpolationImgDataTriangle(
        imgData,
        colors.c3,
        colors.c4,
        colors.c1,
        mode.value
      );
    } else {
      colorInterpolationImgData(
        imgData,
        colors.c1,
        colors.c2,
        colors.c3,
        colors.c4,
        mode.value
      );
    }
  };
  setImgData();
  let vertices = [
    [width * 0.1, height * 0.94],
    [width * 0.9, height * 0.94],
    [width * 0.5, height * 0.14]
  ];
  let points;

  const container = htl.html`<div>`;
  Object.assign(container.style, {
    maxWidth: width + "px",
    background: "gray",
    padding: "10px"
  });
  container.append(ctx.canvas);
  container.value = null;

  const drawImageData = () => ctx.putImageData(imgData, 0, 0);
  ctx.canvas.drawImageData = drawImageData;

  const drawInteractionWidgets = () => {
    ctx.strokeStyle = "white";
    ctx.setLineDash([1, 0]);
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    for (let p of points.slice(0, 3)) ctx.lineTo(...p);
    ctx.closePath();
    ctx.stroke();
    for (let [i, j] of [
      [0, 4],
      [1, 5],
      [2, 6]
    ]) {
      ctx.beginPath();
      ctx.lineTo(...points[i]);
      ctx.lineTo(...points[j]);
      ctx.stroke();
    }

    ctx.setLineDash([]);

    for (let p of points.slice(0, 4)) {
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(...p, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(...p, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    const palette = [];
    for (let [x, y] of points) {
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.stroke();
      const index = (Math.round(x) + Math.round(y) * width) * 4;
      let [r, g, b] = imgData.data.slice(index, index + 3);
      palette.push(`rgb(${r},${g},${b})`);
    }
    container.value = palette;
  };
  ctx.canvas.drawInteractionWidgets = drawInteractionWidgets;

  const change = (ctx, pts) => {
    points = pts;
    drawImageData();
    drawInteractionWidgets();
    container.dispatchEvent(new Event("input", { bubbles: true }));
  };

  triangleInteraction(ctx, vertices, change);
  const gradientChangeCallback = () => {
    setImgData();
    change(ctx, points);
  };
  rgb.addEventListener("input", gradientChangeCallback);
  mode.addEventListener("input", gradientChangeCallback);
  const curveParmCallback = () => {
    change(ctx, points);
  };
  return container;
}


function _colorInterpolationImgData(culori){return(
function colorInterpolationImgData(imgData, c00, c10, c01, c11, mode = "rgb") {
  const { data, width, height } = imgData;
  const rgb = culori.converter("rgb");
  const nx = width - 1;
  const ny = height - 1;
  const interpolatorLeft = culori.interpolate([c00, c01], mode);
  const interpolatorRight = culori.interpolate([c10, c11], mode);
  for (let j = 0; j < height; j++) {
    const u = j / ny;
    const interpolator = culori.interpolate(
      [interpolatorLeft(u), interpolatorRight(u)],
      mode
    );
    for (let i = 0; i < width; i++) {
      const v = i / nx;
      const color = interpolator(v);
      const { r, g, b } = rgb(color);
      const idx = (i + j * width) * 4;
      data[idx] = r * 255;
      data[idx + 1] = g * 255;
      data[idx + 2] = b * 255;
      data[idx + 3] = 255;
    }
  }
}
)}

function _colorInterpolationImgDataTriangle(culori){return(
function colorInterpolationImgDataTriangle(
  imgData,
  cleft,
  cright,
  ctop,
  mode = "rgb"
) {
  const { data, width, height } = imgData;
  const rgb = culori.converter("rgb");
  const nx = width - 1;
  const ny = height - 1;
  const interpolatorLeft = culori.interpolate([ctop, cleft], mode);
  const interpolatorRight = culori.interpolate([ctop, cright], mode);
  for (let j = 0; j < height; j++) {
    const u = j / ny;
    const interpolator = culori.interpolate(
      [interpolatorLeft(u), interpolatorRight(u)],
      mode
    );
    const ileft = Math.floor(width / 2 - (j * width) / 2 / height);
    const iright = Math.ceil(width / 2 + (j * width) / 2 / height);
    const segLen = iright - ileft - 1;
    for (let i = 0; i <= nx; i++) {
      const idx = (i + j * width) * 4;
      data[idx] = 0;
      data[idx + 1] = 0;
      data[idx + 2] = 0;
      data[idx + 3] = 0;
    }
    for (let i = ileft; i < iright; i++) {
      const v = (i - ileft) / segLen;
      const color = interpolator(v);
      const { r, g, b } = rgb(color);
      const idx = (i + j * width) * 4;
      data[idx] = r * 255;
      data[idx + 1] = g * 255;
      data[idx + 2] = b * 255;
      data[idx + 3] = 255;
    }
  }
}
)}

function _curveInteraction(vec2){return(
function curveInteraction(ctx, points, change) {
  const canvas = ctx.canvas,
    width = canvas.width,
    height = canvas.height;

  let selected = -1;
  let moved = false;
  let mouse;
  change(ctx, points, -1);

  // Disable context menu
  canvas.oncontextmenu = () => {
    return false;
  };

  canvas.onmousedown = function (event) {
    mouse = [event.offsetX, event.offsetY];
    selected = -1;
    let i = 0;
    for (let p of points) {
      if (vec2.dist(mouse, p) < 8) {
        selected = i;
        break;
      }
      i++;
    }
  };
  canvas.onmousemove = function (event) {
    if (selected < 0) return;
    let newMouse = [event.offsetX, event.offsetY];
    let v = vec2.sub([], newMouse, mouse);
    vec2.add(points[selected], points[selected], v);
    mouse = newMouse;
    change(ctx, points, selected);
  };
  canvas.onmouseup = function (event) {
    selected = -1;
  };
}
)}

function _triangleInteraction(barycentricToCartesian,vec2,cartesianToBarycentric){return(
function triangleInteraction(ctx, vertices, change) {
  const canvas = ctx.canvas,
    width = canvas.width,
    height = canvas.height;

  let baryCoords = [1 / 3, 1 / 3, 1 / 3];
  let center = barycentricToCartesian(baryCoords, ...vertices);
  let points;
  const callChange = () => {
    const edgePoints = [
      vec2.lineIntersection([], vertices[0], center, vertices[1], vertices[2]),
      vec2.lineIntersection([], vertices[1], center, vertices[2], vertices[0]),
      vec2.lineIntersection([], vertices[2], center, vertices[0], vertices[1])
    ];
    points = [...vertices, center, ...edgePoints];
    change(ctx, points);
  };
  callChange();

  let selected = -1;
  let mouse;

  // Disable context menu
  canvas.oncontextmenu = () => {
    return false;
  };

  canvas.onmousedown = function (event) {
    mouse = [event.offsetX, event.offsetY];
    selected = -1;
    let i = 0;
    for (let p of [...vertices, center]) {
      if (vec2.dist(mouse, p) < 8) {
        selected = i;
        break;
      }
      i++;
    }
  };
  canvas.onmousemove = function (event) {
    if (selected < 0) return;
    let newMouse = [event.offsetX, event.offsetY];
    let v = vec2.sub([], newMouse, mouse);
    if (selected == 3) {
      vec2.add(center, center, v);
      baryCoords = cartesianToBarycentric(center, ...vertices);
    } else {
      vec2.add(vertices[selected], vertices[selected], v);
      center = barycentricToCartesian(baryCoords, ...vertices);
    }
    mouse = newMouse;
    callChange();
  };
  canvas.onmouseup = function (event) {
    selected = -1;
  };
}
)}

function _triangleArea(vec2){return(
(p, q, r) => {
  const u = vec2.sub([], q, p);
  const v = vec2.sub([], r, p);
  const proj = vec2.orthoProj([], u, v);
  return (vec2.len(vec2.sub([], u, proj)) * vec2.dist(p, r)) / 2;
}
)}

function _cartesianToBarycentric(triangleArea){return(
(p, a, b, c) => {
  const A = triangleArea(a, b, c);
  return [
    triangleArea(b, c, p) / A,
    triangleArea(a, c, p) / A,
    triangleArea(a, b, p) / A
  ];
}
)}

function _barycentricToCartesian(vec2){return(
(bary, p, q, r) => {
  const [a, b, c] = bary;
  const sum = a + b + c;
  const center = [0, 0];
  vec2.scaleAndAdd(center, center, p, a / sum);
  vec2.scaleAndAdd(center, center, q, b / sum);
  vec2.scaleAndAdd(center, center, r, c / sum);
  return center;
}
)}

function _paletteDisplay(DOM){return(
function paletteDisplay(palette, options = {}) {
  const { width = 520, height = 50 } = options;
  const ctx = DOM.context2d(width, height, 1);
  const n = palette.length;
  const w = width / n;
  for (let i = 0; i < n; i++) {
    ctx.fillStyle = palette[i];
    ctx.fillRect(i * w, 0, w, height);
  }
  return ctx.canvas;
}
)}

function _culori(){return(
import("https://unpkg.com/culori@4.0.1?module")
)}

async function _loadSvg($0,svgFile)
{
  $0.value = await svgFile.text();
}


async function _svgtext(FileAttachment){return(
await FileAttachment("testimg.svg").text()
)}

function _testimg(html,svgtext){return(
html`${svgtext}`
)}

function _imgclasses(d3,testimg)
{
  let classes = new Set([]);
  d3.select(testimg)
    .selectAll("path")
    .each(function () {
      classes.add(d3.select(this).attr("fill"));
    });
  return classes;
}


function _color_order(){return(
[3, 4, 5, 6, 0, 1, 2]
)}

function _set_testimg_palette(palette,imgclasses,color_order,d3,testimg)
{
  let color = {};
  let n = palette.length;
  let pal = [...palette];
  let i = 0;
  for (let c of imgclasses) {
    color[c] = pal[color_order[i]];
    i = (i + 1) % n;
  }
  d3.select(testimg)
    .selectAll("path")
    .each(function () {
      let path = d3.select(this);
      path.style("fill", color[path.attr("fill")]);
      //console.log(path.attr("class"), path.attr("fill"));
    });
}


export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["testimg.svg", {url: new URL("./files/01a0cab4016f7879953a0f3af8bb52f8925f61491ccc8395efbfe893530cec2d4ded0a2e39f4caa74acb420892d164011e9174bf79fb84e69195e7ecd782cbd5.svg", import.meta.url), mimeType: "image/svg+xml", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof svgFile")).define("viewof svgFile", ["Inputs"], _svgFile);
  main.variable(observer("svgFile")).define("svgFile", ["Generators", "viewof svgFile"], (G, _) => G.input(_));
  main.variable(observer()).define(["paletteDisplay","palette"], _3);
  main.variable(observer("display")).define("display", ["htl","viewof palette","testimg"], _display);
  main.variable(observer("shuffle")).define("shuffle", ["htl","d3","mutable color_order"], _shuffle);
  main.variable(observer("rgb")).define("rgb", ["form","html"], _rgb);
  main.variable(observer("viewof gradientType")).define("viewof gradientType", ["Inputs"], _gradientType);
  main.variable(observer("gradientType")).define("gradientType", ["Generators", "viewof gradientType"], (G, _) => G.input(_));
  main.variable(observer("mode")).define("mode", ["Inputs"], _mode);
  main.variable(observer()).define(["htl","display","XMLSerializer"], _9);
  main.variable(observer()).define(["htl","viewof palette"], _10);
  main.variable(observer()).define(["md"], _11);
  main.variable(observer("viewof palette")).define("viewof palette", ["DOM","rgb","gradientType","colorInterpolationImgDataTriangle","mode","colorInterpolationImgData","htl","Event","triangleInteraction"], _palette);
  main.variable(observer("palette")).define("palette", ["Generators", "viewof palette"], (G, _) => G.input(_));
  main.variable(observer("colorInterpolationImgData")).define("colorInterpolationImgData", ["culori"], _colorInterpolationImgData);
  main.variable(observer("colorInterpolationImgDataTriangle")).define("colorInterpolationImgDataTriangle", ["culori"], _colorInterpolationImgDataTriangle);
  main.variable(observer("curveInteraction")).define("curveInteraction", ["vec2"], _curveInteraction);
  main.variable(observer("triangleInteraction")).define("triangleInteraction", ["barycentricToCartesian","vec2","cartesianToBarycentric"], _triangleInteraction);
  main.variable(observer("triangleArea")).define("triangleArea", ["vec2"], _triangleArea);
  main.variable(observer("cartesianToBarycentric")).define("cartesianToBarycentric", ["triangleArea"], _cartesianToBarycentric);
  main.variable(observer("barycentricToCartesian")).define("barycentricToCartesian", ["vec2"], _barycentricToCartesian);
  main.variable(observer("paletteDisplay")).define("paletteDisplay", ["DOM"], _paletteDisplay);
  const child1 = runtime.module(define1);
  main.import("vec2", child1);
  main.import("lr", child1);
  main.import("lr4", child1);
  main.import("fourPoint", child1);
  const child2 = runtime.module(define2);
  main.import("form", child2);
  main.variable(observer("culori")).define("culori", _culori);
  main.variable(observer("loadSvg")).define("loadSvg", ["mutable svgtext","svgFile"], _loadSvg);
  main.define("initial svgtext", ["FileAttachment"], _svgtext);
  main.variable(observer("mutable svgtext")).define("mutable svgtext", ["Mutable", "initial svgtext"], (M, _) => new M(_));
  main.variable(observer("svgtext")).define("svgtext", ["mutable svgtext"], _ => _.generator);
  main.variable(observer("testimg")).define("testimg", ["html","svgtext"], _testimg);
  main.variable(observer("imgclasses")).define("imgclasses", ["d3","testimg"], _imgclasses);
  main.define("initial color_order", _color_order);
  main.variable(observer("mutable color_order")).define("mutable color_order", ["Mutable", "initial color_order"], (M, _) => new M(_));
  main.variable(observer("color_order")).define("color_order", ["mutable color_order"], _ => _.generator);
  main.variable(observer("set_testimg_palette")).define("set_testimg_palette", ["palette","imgclasses","color_order","d3","testimg"], _set_testimg_palette);
  return main;
}
