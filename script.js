class Vector {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  mag() {
    return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
  }
  unit() {
    return new Vector(this.x / this.mag(), this.y / this.mag(), this.z / this.mag());
  }
  add(v) {
    return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
  }
  sub(v) {
    return new Vector(this.x - v.x, this.y - v.y, this.z - v.z);
  }
  multiK(k) {
    return new Vector(this.x * k, this.y * k, this.z * k);
  }
  dot(v) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }
  cross(v) {
    return new Vector(this.y * v.z - this.z * v.y, -this.x * v.z + this.z * v.x, this.x * v.y - this.y * v.x);
  }
}
class Color {
  constructor(r = 0, g = 0, b = 0) {
    this.r = r;
    this.g = g;
    this.b = b;
  }
  add(v) {
    return new Color(this.r + v.r, this.g + v.g, this.b + v.b);
  }
  sub(v) {
    return new Color(this.r - v.r, this.g - v.g, this.b - v.b);
  }
  multiK(k) {
    return new Color(this.r * k, this.g * k, this.b * k);
  }
  changeColorIntensity(k) {
    return new Color(this.r * k, this.g * k, this.b * k);
  }
}

BACKGROUND = new Color(48, 48, 48);
// add transition to every element
console.log(game);
game.width = 600;
game.height = 600;
game.style.background = BACKGROUND;

ctx = game.getContext("2d");
console.log(ctx);

function putPixel(v, color) {
  const s = 1;
  ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
  ctx.fillRect(v.x - s / 2, v.y - s / 2, s, s);
}

function screen(v) {
  return new Vector(((1 + v.x) * game.width) / 2, ((1 - v.y) * game.height) / 2);
}

function project(v) {
  return new Vector(v.x / v.z, v.y / v.z);
}

function reflectedRay(R, N) {
  return N.multiK(2 * N.dot(R.unit())).sub(R.unit());
}

function CanvasToViewport(x, y) {
  return new Vector((x * Vw) / Cw, (y * Vh) / Ch, d);
}

function closestIntersection(O, D, t_min, t_max) {
  let t_closest = Infinity;
  let closestSphere = null;
  for (sphere of scene.spheres) {
    const [t1, t2] = IntersectionRaySphere(O, D, sphere);
    if (t1 > t_min && t1 < t_max && t1 < t_closest) {
      t_closest = t1;
      closestSphere = sphere;
    }
    if (t2 > t_min && t2 < t_max && t2 < t_closest) {
      t_closest = t2;
      closestSphere = sphere;
    }
  }
  return [closestSphere, t_closest];
}

function TraceRay(O, D, t_min, t_max, recDepth) {
  [closestSphere, t_closest] = closestIntersection(O, D, t_min, t_max);
  if (closestSphere == null) {
    return BACKGROUND;
  }
  const P = O.add(D.multiK(t_closest));
  const N = P.sub(closestSphere.center).unit();

  const localColor = closestSphere.color.changeColorIntensity(computeIntensity(P, N, D.multiK(-1), closestSphere.specular));

  const r = closestSphere.reflective;
  if (recDepth <= 0 || r <= 0) {
    return localColor;
  }
  const R = reflectedRay(D.multiK(-1), N);
  const reflected_color = TraceRay(P, R, 0.001, inf, recDepth - 1);
  return localColor.multiK(1-r).add(reflected_color.multiK(r));
}

function IntersectionRaySphere(O, D, sphere) {
  const CO = new Vector(O.x - sphere.center.x, O.y - sphere.center.y, O.z - sphere.center.z);
  const r = sphere.radius;

  const a = D.dot(D);
  const b = 2 * CO.dot(D);
  const c = CO.dot(CO) - r ** 2;

  const discriminant = b ** 2 - 4 * a * c;
  if (discriminant < 0) {
    return [inf, inf];
  }
  return ([t1, t2] = [(-b + Math.sqrt(discriminant)) / (2 * a), (-b - Math.sqrt(discriminant)) / (2 * a)]);
}

function computeIntensity(P, N, V, s) {
  let i = 0;

  for (const light of scene.lights) {
    if (light.type === "ambient") {
      i += light.intensity;
    } else {
      let L;

      if (light.type === "point") {
        L = light.position.sub(P).unit();
        t_max = 1;
      } else if (light.type === "directional") {
        L = light.direction.unit();
        t_max = inf;
      }

      //shadow check
      const [shadow_sphere, shadow_t] = closestIntersection(P, L, 0.001, t_max);
      if (shadow_sphere) {
        continue;
      }

      // diffused lighting
      const nDotL = N.dot(L);
      if (nDotL > 0) {
        i += light.intensity * nDotL;
      }

      // specular lighting
      if (s) {
        const R = reflectedRay(L, N);
        const rDotv = Math.max(0, R.dot(V));
        i += light.intensity * Math.pow(rDotv, s);
      }
    }
  }
  return i;
}

function translate(v, w) {
  dl = w.sub(v).unit();
  if (v.x != w.x || v.y != w.y || v.z != w.z) {
    v.x = v.x + dl.x;
    v.y = v.y + dl.y;
    v.z = v.z + dl.z;
  } else {
    console.log("stopped");
  }
  // return new Vector(v.x, v.y, v.z);
}

function rotate_xz(v, angle) {
  const x = v.x;
  const z = v.z;
  v.x = x * Math.cos(angle) - z * Math.sin(angle);
  v.z = x * Math.sin(angle) + z * Math.cos(angle);

  const mag = v.mag();
  v.x /= mag;
  v.y /= mag;
  v.z /= mag;
}

const scene = {
  spheres: [
    {
      center: new Vector(0, -5001, 0),
      radius: 5000,
      color: new Color(255, 255, 0), //base yellow
      specular: 500,
      reflective: 0.2,
    },
    {
      center: new Vector(0, -0.5, 3),
      radius: 0.5,
      color: new Color(255, 0, 0), // red
      specular: 500,
      reflective: 0.1,
    },
    {
      center: new Vector(-2, 0, 6),
      radius: 1,
      color: new Color(0, 255, 0),//green
      specular: 500,
      reflective: 0.1,
    },
    {
      center: new Vector(2, 0, 13),
      radius: 1,
      color: new Color(0, 0, 255), // blue
      specular: 500,
      reflective: 0.2,
    },
  ],
  lights: [
    {
      type: "ambient",
      intensity: 0.15,
    },
    {
      type: "directional",
      intensity: 0.8,
      direction: new Vector(1, 5, -3),
    },
    {
      type: "point",
      intensity: 0.1,
      position: new Vector(-10, 10, -2),
    },
  ],
};

const O = new Vector(0, 0, 0);
const inf = Infinity;
const Cw = game.width;
const Ch = game.height;
const Vw = 1;
const Vh = 1;
const d = 1;

const FPS = 60;
const SCALE = 1 / 3;
let dx = 0.5;
let angle = (2 * Math.PI) / FPS;
const reflections = 1
//point light - (-10,0,6)

function frame() {
  rotate_xz(scene.lights[1].direction, angle);
  for (x = -Cw / 2; x < Cw / 2; x += 1 / SCALE) {
    for (let y = -Ch / 2; y < Ch / 2; y += 1 / SCALE) {
      const D = CanvasToViewport(x, y);
      const pixelColor = TraceRay(O, D, 1, inf, reflections);

      const pixel = new Vector((2 * x) / Cw, (2 * y) / Ch);
      putPixel(screen(pixel), pixelColor);
    }
  }
  console.log(scene.lights[1].position);
  const animate = setTimeout(frame, 1000 / FPS);
}

frame();
