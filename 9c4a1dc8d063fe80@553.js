import define1 from "./a01396c4fb4e9672@83.js";
import define2 from "./8d271c22db968ab0@160.js";

function _1(md){return(
md`# Palette from triangle on a gradient`
)}

function _2(paletteDisplay,palette){return(
paletteDisplay(palette)
)}

function _palette(DOM,rgb,colorInterpolationImgData,mode,htl,Event,triangleInteraction)
{
  const width = 500,
    height = 500;
  const ctx = DOM.context2d(width, height, 1);
  ctx.fillRect(0, 0, width, height);
  const imgData = ctx.getImageData(0, 0, width, height);
  const setImgData = () => {
    const colors = rgb.value;
    colorInterpolationImgData(
      imgData,
      colors.c1,
      colors.c2,
      colors.c3,
      colors.c4,
      mode.value
    );
  };
  setImgData();
  let vertices = [
    [width * 0.2, height * 0.25],
    [width * 0.8, height * 0.25],
    [width * 0.5, height * 0.76]
  ];
  let points;

  const container = htl.html`<div>`;
  container.append(ctx.canvas);
  container.value = null;

  let change = (ctx, pts) => {
    points = pts;
    ctx.putImageData(imgData, 0, 0);
    ctx.strokeStyle = "white";
    ctx.setLineDash([1, 0]);
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    for (let p of pts.slice(0, 3)) ctx.lineTo(...p);
    ctx.closePath();
    ctx.stroke();
    for (let [i, j] of [
      [0, 4],
      [1, 5],
      [2, 6]
    ]) {
      ctx.beginPath();
      ctx.lineTo(...pts[i]);
      ctx.lineTo(...pts[j]);
      ctx.stroke();
    }

    ctx.setLineDash([]);

    for (let p of pts.slice(0, 4)) {
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
    for (let [x, y] of pts) {
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


function _rgb(form,html){return(
form(html`<form>
<input name="c1" type='color' value='#ffffff'/>
<input name="c2" type='color' value='#ffbb00'/>
<br/>
<input name="c3" type='color' value='#00bbff'/>
<input name="c4" type='color' value='#3200ff'/>
</form>`)
)}

function _mode(Inputs){return(
Inputs.select(["lrgb", "rgb"], { label: "Interpolation" })
)}

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

function _12(barycentricToCartesian,cartesianToBarycentric)
{
  const vertices = [
    [0, 0],
    [2, 0],
    [1, 1]
  ];
  const bary = barycentricToCartesian([1 / 3, 1 / 3, 1 / 3], ...vertices);
  return cartesianToBarycentric(bary, ...vertices);
}


function _paletteDisplay(DOM){return(
function paletteDisplay(palette, options = {}) {
  const { width = 500, height = 100 } = options;
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

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["paletteDisplay","palette"], _2);
  main.variable(observer("viewof palette")).define("viewof palette", ["DOM","rgb","colorInterpolationImgData","mode","htl","Event","triangleInteraction"], _palette);
  main.variable(observer("palette")).define("palette", ["Generators", "viewof palette"], (G, _) => G.input(_));
  main.variable(observer("rgb")).define("rgb", ["form","html"], _rgb);
  main.variable(observer("mode")).define("mode", ["Inputs"], _mode);
  main.variable(observer("colorInterpolationImgData")).define("colorInterpolationImgData", ["culori"], _colorInterpolationImgData);
  main.variable(observer("curveInteraction")).define("curveInteraction", ["vec2"], _curveInteraction);
  main.variable(observer("triangleInteraction")).define("triangleInteraction", ["barycentricToCartesian","vec2","cartesianToBarycentric"], _triangleInteraction);
  main.variable(observer("triangleArea")).define("triangleArea", ["vec2"], _triangleArea);
  main.variable(observer("cartesianToBarycentric")).define("cartesianToBarycentric", ["triangleArea"], _cartesianToBarycentric);
  main.variable(observer("barycentricToCartesian")).define("barycentricToCartesian", ["vec2"], _barycentricToCartesian);
  main.variable(observer()).define(["barycentricToCartesian","cartesianToBarycentric"], _12);
  main.variable(observer("paletteDisplay")).define("paletteDisplay", ["DOM"], _paletteDisplay);
  const child1 = runtime.module(define1);
  main.import("vec2", child1);
  main.import("lr", child1);
  main.import("lr4", child1);
  main.import("fourPoint", child1);
  const child2 = runtime.module(define2);
  main.import("form", child2);
  main.variable(observer("culori")).define("culori", _culori);
  return main;
}
