function _1(md){return(
md`# Vec2 Utils

Some utils that add to [glmatrix](https://glmatrix.net/)'s \`vec2\` subpackage.
We also export glmatrix's subpackages \`vec3\`, \`mat2\`, \`mat2d\` and \`mat3\` as a convenience.`
)}

function _vec2(glmatrix)
{
  let vec2 = Object.assign({}, glmatrix.vec2);
  let mat3 = glmatrix.mat3;

  //
  // Orientation between 3 points
  //
  vec2.orient = function (a, b, c) {
    return Math.sign(
      mat3.determinant([1, a[0], a[1], 1, b[0], b[1], 1, c[0], c[1]])
    );
  };

  //
  // Returns true iff line segments a-b and c-d intersect.
  //
  vec2.segmentsIntersect = function (a, b, c, d) {
    return (
      vec2.orient(a, b, c) != vec2.orient(a, b, d) &&
      vec2.orient(c, d, a) != vec2.orient(c, d, b)
    );
  };

  //
  // Line intersection. Sets 'out' to
  // the intersection point between lines [x1,y1]-[x2,y2] and [x3,y3]-[x4,y4].
  //
  vec2.lineIntersection = function (
    out,
    [x1, y1],
    [x2, y2],
    [x3, y3],
    [x4, y4]
  ) {
    const D = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    const a = x1 * y2 - y1 * x2,
      b = x3 * y4 - y3 * x4;

    out[0] = (a * (x3 - x4) - (x1 - x2) * b) / D;
    out[1] = (a * (y3 - y4) - (y1 - y2) * b) / D;
    return out;
  };

  //
  // Vector projection. Sets 'out' to the orthogonal projection of vector 'u' onto
  // vetor 'v'. In other words sets 'out' to a vector that has the same direction as 'v'
  // but length that is |u| cos (t), where t is the angle between u and v.
  //
  vec2.orthoProj = function (out, u, v) {
    const vnorm = vec2.normalize([], v);
    return vec2.scale([], vnorm, vec2.dot(vnorm, u));
  };

  //
  // Distance from point to line segment. Returns the distance between p and
  // line segment a-b.
  //
  vec2.distSegment = function (p, a, b) {
    const v = vec2.sub([], b, a);
    const u = vec2.sub([], p, a);
    const vlen = vec2.len(v);
    const vnorm = vec2.scale([], v, 1 / vlen);
    const projSize = vec2.dot(vnorm, u);
    if (projSize > vlen) return vec2.dist(p, b);
    if (projSize < 0) return vec2.dist(p, a);
    return vec2.len(vec2.sub([], p, vec2.lerp([], a, b, projSize / vlen)));
  };

  return vec2;
}


function _3(md){return(
md`## Tests`
)}

function _4(vec2){return(
vec2.orient([0, 0], [1, 0], [0.5, 0]) == 0
)}

function _5(vec2){return(
vec2.orient([0, 0], [1, 0], [0, 1]) > 0
)}

function _6(vec2){return(
vec2.orient([0, 0], [1, 0], [0, -1]) < 0
)}

function _7(vec2){return(
vec2.segmentsIntersect([0, 0], [1, 1], [1, 0], [0, 1])
)}

function _8(vec2){return(
vec2.segmentsIntersect([0, 0], [1, 1], [1, 1], [0, 1])
)}

function _9(vec2){return(
!vec2.segmentsIntersect([0, 0], [1, 1], [1, 1.0001], [0, 1])
)}

function _10(vec2){return(
!vec2.segmentsIntersect([0, 0], [1, 1], [1, 0.999], [1, 0])
)}

function _11(vec2){return(
vec2.dist(vec2.lineIntersection([], [0, 0], [1, 1], [1, 0], [0, 1]), [
  0.5,
  0.5
]) == 0
)}

function _12(vec2){return(
vec2.orthoProj([], [1, 1], [0, 2])
)}

function _13(vec2){return(
vec2.distSegment([1, 1], [2, 0], [3, 0])
)}

function _14(vec2){return(
vec2.distSegment([1, 1], [4, 0], [0, 0])
)}

function _15(vec2){return(
vec2.distSegment([1, 1], [0, 0], [0.5, 0])
)}

function _16(md){return(
md`## Imports`
)}

function _glmatrix(){return(
import('https://unpkg.com/gl-matrix@3.3.0/esm/index.js?module')
)}

function _vec3(glmatrix){return(
glmatrix.vec3
)}

function _mat2(glmatrix){return(
glmatrix.mat2
)}

function _mat2d(glmatrix){return(
glmatrix.mat2d
)}

function _mat3(glmatrix){return(
glmatrix.mat3
)}

function _mat4(glmatrix){return(
glmatrix.mat4
)}

function _vec4(glmatrix){return(
glmatrix.vec4
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("vec2")).define("vec2", ["glmatrix"], _vec2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer()).define(["vec2"], _4);
  main.variable(observer()).define(["vec2"], _5);
  main.variable(observer()).define(["vec2"], _6);
  main.variable(observer()).define(["vec2"], _7);
  main.variable(observer()).define(["vec2"], _8);
  main.variable(observer()).define(["vec2"], _9);
  main.variable(observer()).define(["vec2"], _10);
  main.variable(observer()).define(["vec2"], _11);
  main.variable(observer()).define(["vec2"], _12);
  main.variable(observer()).define(["vec2"], _13);
  main.variable(observer()).define(["vec2"], _14);
  main.variable(observer()).define(["vec2"], _15);
  main.variable(observer()).define(["md"], _16);
  main.variable(observer("glmatrix")).define("glmatrix", _glmatrix);
  main.variable(observer("vec3")).define("vec3", ["glmatrix"], _vec3);
  main.variable(observer("mat2")).define("mat2", ["glmatrix"], _mat2);
  main.variable(observer("mat2d")).define("mat2d", ["glmatrix"], _mat2d);
  main.variable(observer("mat3")).define("mat3", ["glmatrix"], _mat3);
  main.variable(observer("mat4")).define("mat4", ["glmatrix"], _mat4);
  main.variable(observer("vec4")).define("vec4", ["glmatrix"], _vec4);
  return main;
}
