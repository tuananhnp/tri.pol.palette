import define1 from "./cb746286157517f2@119.js";

function _1(md){return(
md`# Lane-Riesenfeld subdivision

The Lane-Riesenfeld (LR) curve subdivision algorithm is a generalization of the Chaikin subdivision which generates splines with variable continuity. The 4-point (Dyn-Levin-Gregory) refinement is a variant that interpolates the control points. A combination of LR and 4-point refinement can be used to reduce contraction.

See https://tiborstanko.sk/teaching/geo-num-2017/tp5.html`
)}

function _config(Inputs){return(
Inputs.form({
  scheme: Inputs.select(["LR", "4 points", "LR+4 points"], {
    label: "Scheme",
    value: "LR"
  }),
  degree: Inputs.range([1, 10], { label: "Degree", value: 2, step: 1 }),
  subdiv: Inputs.range([1, 8], { label: "Subdivisions", value: 4, step: 1 }),
  w: Inputs.range([0, 0.15], { label: "w", value: 0.0625, step: 0.0005 }),
  closed: Inputs.toggle({ label: "closed", value: true })
})
)}

function _3(polygonDemo,points,config,lr,fourPoint,lr4){return(
polygonDemo(points, {
  change: function (ctx, points) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.strokeStyle = "black";
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    for (let p of points) {
      ctx.lineTo(...p);
    }
    ctx.closePath();
    ctx.stroke();
    let pts = points;
    let f =
      config.scheme == "LR"
        ? (pts) => lr(pts, config.degree, config.closed)
        : config.scheme == "4 points"
        ? (pts) => fourPoint(pts, config.closed)
        : (pts) => lr4(pts, config.degree, config.closed, config.w);
    for (let i = 0; i < config.subdiv; i++) pts = f(pts);
    ctx.setLineDash([]);
    ctx.strokeStyle = "blue";
    ctx.fillStyle = "rgba(0,0,255,0.2)";
    ctx.beginPath();
    for (let p of pts) {
      ctx.lineTo(...p);
    }
    if (config.closed) ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "black";
    for (let p of points) {
      ctx.beginPath();
      ctx.arc(...p, 4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = "red";
    for (let p of pts) {
      ctx.beginPath();
      ctx.arc(...p, 5, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
})
)}

function _points(){return(
[
  [100, 100],
  [400, 100],
  [400, 400],
  [250, 250],
  [100, 400]
]
)}

function _polygonDemo(htl,vec2){return(
function polygonDemo(points, options = {}) {
  const {
    width = 800,
    height = 600,
    change = (ctx, points, i) => {},
    doubleClick = (ctx, points, i) => {}
  } = options;

  const canvas = htl.html`<canvas width=${width} height=${height}>`;
  const ctx = canvas.getContext("2d");
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
    if (selected < 0) {
      // new point
      const n = points.length;
      if (n > 2) {
        // Find closest line segment where to insert
        let minDist = Infinity;
        let closest = -1;
        for (let i = 0; i < n; i++) {
          const p = points[(i - 1 + n) % n];
          const q = points[i];
          const d = vec2.distSegment(mouse, p, q);
          if (d < minDist) {
            [minDist, closest] = [d, i];
          }
        }
        points.splice(closest, 0, mouse);
        change(ctx, points, closest);
      } else {
        points.push(mouse);
        change(ctx, points, n);
      }
    } else {
      moved = false;
    }
  };
  canvas.onmousemove = function (event) {
    moved = true;
    if (selected < 0) return;
    let newMouse = [event.offsetX, event.offsetY];
    let v = vec2.sub([], newMouse, mouse);
    vec2.add(points[selected], points[selected], v);
    mouse = newMouse;
    change(ctx, points, selected);
  };
  canvas.onmouseup = function (event) {
    if (!moved && selected != -1 && points.length > 1) {
      // click on point
      points.splice(selected, 1);
      change(ctx, points, selected);
    }
    selected = -1;
  };
  return canvas;
}
)}

function _fourPoint(config){return(
function fourPoint(points, closed = true, w = config.w) {
  // refine
  let n = points.length;
  const next = closed ? (i) => (i + 1) % n : (i) => Math.min(n - 1, i + 1);
  const next2 = closed ? (i) => (i + 2) % n : (i) => Math.min(n - 1, i + 2);
  const prev = closed ? (i) => (i + n - 1) % n : (i) => Math.max(0, i - 1);
  let v = [];
  for (let i = 0; i < n; i++) {
    const p = [points[prev(i)], points[i], points[next(i)], points[next2(i)]];
    let q = [0, 0];
    for (let j of [0, 1])
      q[j] =
        -w * p[0][j] + (0.5 + w) * p[1][j] + (0.5 + w) * p[2][j] - w * p[3][j];
    v.push(points[i], q);
  }
  if (!closed) v.pop();
  return v;
}
)}

function _lr(){return(
function lr(points, degree = 2, closed = true) {
  // duplicate
  let v = [];
  if (!closed) for (let i = 1; i < degree; i++) v.push(points[0]);
  for (let p of points) v.push(p, p);
  const n = v.length;
  const next = closed ? (i) => (i + 1) % n : (i) => Math.min(n - 1, i + 1);
  // average
  for (let d = 1; d <= degree; d++) {
    let u = [];
    for (let i = 0; i < n; i++) {
      let p = v[i];
      let q = v[next(i)];
      u.push([(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]);
    }
    v = u;
  }
  return v;
}
)}

function _lr4(config,fourPoint){return(
function lr4(points, degree = 2, closed = true, w = config.w) {
  // refine
  let v;
  if (true) {
    //closed) {
    v = points;
  } else {
    let [first, last] = [points[0], points[points.length - 1]];
    let [prefix, suffix] = [[], []];
    for (let i = 0; i < degree; i++) {
      prefix.push(first);
      suffix.push(last);
    }
    v = [...prefix, ...points, ...suffix];
  }
  v = fourPoint(v, closed, w);
  //return lr(v, degree, closed);
  // average
  let n = v.length;
  const next = closed ? (i) => (i + 1) % n : (i) => Math.min(n - 1, i + 1);
  const next2 = closed ? (i) => (i + 2) % n : (i) => Math.min(n - 2, i + 2);
  const prev = closed ? (i) => (i + n - 1) % n : (i) => Math.max(0, i - 1);
  for (let d = 1; d < degree; d++) {
    let u = [];
    for (let i = 0; i < n; i++) {
      const p = [v[prev(i)], v[i], v[next(i)], v[next2(i)]];
      let q = [0, 0];
      for (let j of [0, 1])
        q[j] =
          -w * p[0][j] +
          (0.5 + w) * p[1][j] +
          (0.5 + w) * p[2][j] -
          w * p[3][j];
      u.push(q);
    }
    if (closed) v = u;
    else {
      v = [v[0], ...u.slice(0, -1), v[v.length - 1]];
    }
  }
  return v;
}
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof config")).define("viewof config", ["Inputs"], _config);
  main.variable(observer("config")).define("config", ["Generators", "viewof config"], (G, _) => G.input(_));
  main.variable(observer()).define(["polygonDemo","points","config","lr","fourPoint","lr4"], _3);
  main.variable(observer("points")).define("points", _points);
  main.variable(observer("polygonDemo")).define("polygonDemo", ["htl","vec2"], _polygonDemo);
  main.variable(observer("fourPoint")).define("fourPoint", ["config"], _fourPoint);
  main.variable(observer("lr")).define("lr", _lr);
  main.variable(observer("lr4")).define("lr4", ["config","fourPoint"], _lr4);
  const child1 = runtime.module(define1);
  main.import("vec2", child1);
  return main;
}
