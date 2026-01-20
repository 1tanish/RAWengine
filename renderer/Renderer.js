import { Vector, Color, Matrix } from "../math/Position & Color Vectors, Matrices.js";
import { Camera } from "./Camera.js";

const BACKGROUND = new Color(48, 48, 48);

console.log(game);
const aspectRatio = 1 / 1;
game.width = window.innerWidth;
game.height = window.innerHeight;
// game.height = game.width / aspectRatio;
game.style.background = BACKGROUND;
// const O = new Vector(0, 0, 0);
const inf = Infinity;
const Cw = game.width;
const Ch = game.height;
const Vw = 1;
const Vh = 1;
const d = 1;

const ctx = game.getContext("2d");
console.log(ctx);

function putPixelBuffer(x, y, color) {
  const index = 4 * (y * Cw + x);
  buffer[index] = color.r;
  buffer[index + 1] = color.g;
  buffer[index + 2] = color.b;
  buffer[index + 3] = 255;
}

// function screen(v) {
//   return new Vector(((1 + v.x) * game.width) / 2, ((1 - v.y) * game.height) / 2);
// }

// function project(v) {
//   return new Vector(v.x / v.z, v.y / v.z);
// }

function reflectedRay(R, N) {
  return N.multiK(2 * N.dot(R.unit())).sub(R.unit());
}

function CanvasToViewport(x, y) {
  return new Vector((x * Vw) / Cw, (y * Vh) / Ch, d);
}

function closestIntersection(O, D, t_min, t_max) {
  let t_closest = Infinity;
  let closestSphere = null;
  for (const sphere of scene.objects.spheres) {
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
  const [closestSphere, t_closest] = closestIntersection(O, D, t_min, t_max);
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
  return localColor.multiK(1 - r).add(reflected_color.multiK(r));
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
  const t1 = (-b + Math.sqrt(discriminant)) / (2 * a);
  const t2 = (-b - Math.sqrt(discriminant)) / (2 * a);
  return [t1, t2];
}

function computeIntensity(P, N, V, s) {
  let i = 0;

  for (const light of scene.objects.lights) {
    if (light.type === "ambient") {
      i += light.intensity;
    } else {
      let L, t_max;

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

function rotate_xz(v, dTheta) {
  const cos = Math.cos(dTheta);
  const sin = Math.sin(dTheta);

  const x = v.x;
  const z = v.z;

  v.x = x * cos - z * sin;
  v.z = x * sin + z * cos;
}

function smoothstep(t) {
  return t * t * (3 - 2 * t);
}

const scene = {
  activeCam: "main",
  // wideAngleCam: "wide",
  cameras: {
    main: new Camera(new Vector(0, 1, -5), new Vector(0, -0.5, 3)),
    // wide: new Camera(new Vector(30, 5, 0), new Vector(0, 0, 0)),
  },
  objects: {
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
        specular: 1500,
        reflective: 0.1,
      },
      {
        center: new Vector(-2, 0, 6),
        radius: 1,
        color: new Color(0, 255, 0), //green
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
  },
};

let Cam = scene.cameras[scene.activeCam];
let rotationM = new Matrix(getCameraBasis(Cam).right, getCameraBasis(Cam).up, getCameraBasis(Cam).forward);

let targetSelection = false;
document.addEventListener("keydown", (e) => (e.key == "1" ? (targetSelection = true) : ""));
document.addEventListener("keyup", (e) => (targetSelection = false));
let PanningEnabled = false;
document.addEventListener("keydown", (e) => (e.key == "Shift" && targetSelection == false ? (PanningEnabled = true) : ""));
document.addEventListener("keyup", (e) => (e.key == "Shift" ? (PanningEnabled = false) : ""));
document.addEventListener("mousedown", (e) => (e.button == 1 && targetSelection == false ? (PanningEnabled = true) : ""));
document.addEventListener("mouseup", (e) => (PanningEnabled = false));

function getCameraBasis(cam) {
  const forward = cam.target.sub(cam.position).unit();
  const right = forward.cross(new Vector(0, 1, 0)).unit();
  const up = right.cross(forward);

  return { forward, right, up };
}
function getMouseCanvasPos(e) {
  const rect = game.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
}
function mouseToViewport(mx, my) {
  return new Vector(((mx - Cw / 2) * Vw) / Cw, ((Ch / 2 - my) * Vh) / Ch, d);
}
function getMouseRay(e) {
  const { x, y } = getMouseCanvasPos(e);
  const Dv = mouseToViewport(x, y);

  const { forward, right, up } = getCameraBasis(Cam);

  const Dw = forward.add(right.multiK(Dv.x)).add(up.multiK(Dv.y)).unit();

  return Dw;
}
function pickObject(e) {
  const rayDir = getMouseRay(e);
  const [obj, t] = closestIntersection(Cam.position, rayDir, 0.001, inf);

  if (!obj) return null;
  return obj;
}
function MouseInp() {
  let lastX = null;
  let lastY = null;
  // let clickedX = null;
  let clickedY = null;
  let dragging = false;

  document.addEventListener("mousedown", (e) => {
    game.style.cursor = "grabbing";
    if (targetSelection) {
      if (e.button !== 0) return;

      const picked = pickObject(e);
      if (!picked) return;

      // Cam.target = picked.center;
      // Cam.radius = Cam.calcR();
      // updateCameraPosition(Cam);
      camTransition.active = true;
      camTransition.startTarget = Cam.target;
      camTransition.endTarget = picked.center;

      camTransition.startRadius = Cam.radius;
      camTransition.endRadius = Cam.position.sub(picked.center).mag();

      camTransition.startTime = performance.now();
    }
    if ((e.button === 1 || e.button === 0) && targetSelection === false) {
      dragging = true;
      // clickedX = e.clientX;
      clickedY = e.clientY;
      lastX = e.clientX;
      lastY = e.clientY;
    }
  });
  document.addEventListener("mouseup", () => {
    dragging = false;
    game.style.cursor = "grab";
  });

  document.addEventListener("mousemove", (e) => {
    if (camTransition.active) return;
    if (!dragging) return;

    let dx = e.clientX - lastX;
    let dy = -e.clientY + lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    if (PanningEnabled) {
      const panSpeed = sensitivity * Cam.radius;

      const { right, up } = getCameraBasis(Cam);

      Cam.target = Cam.target.sub(right.multiK(dx * panSpeed)).sub(up.multiK(dy * panSpeed));

      updateCameraPosition(Cam);
      return;
    }
    Cam.pitch = window.innerHeight / 2 - clickedY > Cam.target.y ? Cam.pitch + dy * sensitivity : Cam.pitch - dy * sensitivity;
    Cam.yaw = window.innerHeight / 2 - clickedY > Cam.target.y ? Cam.yaw + dx * sensitivity : Cam.yaw - dx * sensitivity;

    const limit = Math.PI / 2 - 0.01;
    Cam.pitch = Math.max(-limit, Math.min(limit, Cam.pitch));
    updateCameraPosition(Cam);
  });

  game.addEventListener("wheel", (e) => {
    e.preventDefault();

    Cam.radius *= 1 + e.deltaY * sensitivity;
    Cam.radius = Math.max(2, Math.min(Cam.radius, inf));
    updateCameraPosition(Cam);
  });
}
MouseInp();

function updateCameraPosition(cam) {
  const { forward, right, up } = getCameraBasis(Cam);
  if (!isFinite(cam.radius)) return;
  const cp = Math.cos(cam.pitch);
  const sp = Math.sin(cam.pitch);
  const cy = Math.cos(cam.yaw);
  const sy = Math.sin(cam.yaw);

  cam.position.x = cam.target.x + cam.radius * cp * sy;
  cam.position.y = cam.target.y + cam.radius * sp;
  cam.position.z = cam.target.z + cam.radius * cp * cy;
}

function pauseAnimation() {
  document.addEventListener("keydown", (e) => {
    if (e.code == "Space") {
      paused = !paused;
    }
  });
}
pauseAnimation();

const SCALE = 1 / 4;

const imageData = ctx.createImageData(Cw, Ch);
const buffer = imageData.data;
const STEP = 1 / SCALE;
let dx = 0.5;
let theta = 0;
const angularspeed = Math.PI / 4;
const reflections = 1;
let paused = true;
const sensitivity = 0.002;
let camTransition = {
  active: false,
  startTarget: null,
  endTarget: null,
  startRadius: 0,
  endRadius: 0,
  startTime: 0,
  duration: 0.4
};

let lastTime = performance.now();
function frame() {
  if (camTransition.active) {
    const now = performance.now();
    let t = (now - camTransition.startTime) / (camTransition.duration * 1000);
    t = Math.min(t, 1);

    const k = smoothstep(t);

    ////// interpolation
    Cam.target = camTransition.startTarget.multiK(1 - k).add(camTransition.endTarget.multiK(k));
    Cam.radius = camTransition.startRadius * (1 - k) + camTransition.endRadius * k;
    updateCameraPosition(Cam);

    if (t === 1) {
      camTransition.active = false;
    }
  }
  const now = performance.now();
  let dt = (now - lastTime) / 1000;
  dt = Math.min(dt, 0.05);
  lastTime = now;

  if (!paused) {
    const dTheta = angularspeed * dt;
    theta += dTheta;
    rotate_xz(scene.objects.lights[1].direction, dt);
  }

  rotationM = new Matrix(getCameraBasis(Cam).right, getCameraBasis(Cam).up, getCameraBasis(Cam).forward);
  //////////////////////// rendering
  for (let x = -Cw / 2; x < Cw / 2; x += STEP) {
    for (let y = -Ch / 2; y < Ch / 2; y += STEP) {
      const D = rotationM.transform(CanvasToViewport(x, y)).unit();
      const pixelColor = TraceRay(Cam.position, D, 1, inf, reflections);

      const sx = Math.floor(x + Cw / 2);
      const sy = Math.floor(Ch / 2 - y);
      //////////////////// subsampling
      if (SCALE < 1 && sx >= 0 && sx < Cw && sy >= 0 && sy < Ch) {
        for (let dx = 0; dx < STEP; dx++) {
          for (let dy = 0; dy < STEP; dy++) {
            putPixelBuffer(sx + dx, sy + dy, pixelColor);
          }
        }
      } else {
        putPixelBuffer(sx, sy, pixelColor);
      }
    }
  }
  ctx.putImageData(imageData, 0, 0);
  requestAnimationFrame(frame);
}

frame();
