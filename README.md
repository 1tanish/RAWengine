# RAWengine

*A lightweight JavaScript ray-tracing engine built from scratch using HTML5 Canvas.*

RAWengine is a learning focused rendering engine that implements core computer graphics concepts such as ray object intersection, lighting models, reflections, camera control, and subsampling,  without relying on external graphics libraries.

---

## Features

- Ray tracing - based renderer
- Sphere primitives with:
  - Diffuse lighting
  - Specular highlights
  - Reflections
- Ambient, point, and directional lights
- Orbit camera with pan and zoom
- Mouse picking and smooth camera transitions
- Subsampling for performance optimization
- Fully written in vanilla JavaScript

---

## Project Structure

```
RAWengine/
│
├── math/
│   ├── Vectors.js
│   ├── Matrix.js
│
├── renderer/
│   ├── Camera.js
│   ├── Renderer.js
│
├── index.html
└── README.md
```

---

## Getting Started

### Prerequisites

- A modern web browser (Chrome / Firefox recommended)
- A local development server (required for ES modules)

### Running the Engine

1. Clone the repository:
   ```bash
   git clone https://github.com/1tanish/RAWengine.git
   ```

2. Start a local server:
   ```bash
   npx serve
   ```
   or
   ```bash
   python -m http.server
   ```

3. Open the project in your browser.

---

## Scene Description

RAWengine renders a scene defined by **cameras**, **objects**, and **lights**.

### Scene Object

```js
const scene = {
  activeCam: "main",
  cameras: {
    main: new Camera(
      new Vector(0, 1, -5),
      new Vector(0, 0, 0)
    )
  },
  objects: {
    spheres: [],
    lights: []
  }
};
```

---

## Objects

### Sphere Object

```js
{
  center: new Vector(0, 0, 3),
  radius: 1,
  color: new Color(255, 0, 0),
  specular: 500,
  reflective: 0.2
}
```

**Properties**
- `center` – position of the sphere
- `radius` – sphere radius
- `color` – RGB color
- `specular` – shininess factor
- `reflective` – reflection coefficient (0–1)

---

## Lighting

RAWengine supports three light types.

### Ambient Light
```js
{ type: "ambient", intensity: 0.15 }
```

### Directional Light
```js
{
  type: "directional",
  intensity: 0.8,
  direction: new Vector(1, 5, -3)
}
```

### Point Light
```js
{
  type: "point",
  intensity: 0.1,
  position: new Vector(-10, 10, -2)
}
```

---

## Camera Controls

| Action | Input |
|------|------|
| Orbit | Left click + drag |
| Pan | Shift + drag / Middle mouse |
| Zoom | Mouse wheel |
| Select object | Hold `1` + click |
| Pause / Start animation | Space |

---

## Rendering Pipeline (Overview)

1. Convert canvas pixels to viewport space
2. Generate rays from the active camera
3. Compute ray–sphere intersections
4. Calculate lighting:
   - Ambient
   - Diffuse
   - Specular
5. Trace reflections recursively
6. Write pixel colors to `ImageData`
7. Display the frame using `requestAnimationFrame`

---

## Performance Notes

- Subsampling reduces the total number of rays
- Reflection recursion depth is limited
- Rendering runs entirely on the CPU

---

## Known Limitations

- Only sphere primitives are supported
- No acceleration structures (BVH / KD-tree)
- No mesh or texture support

---

## Future Plans

- Cube and plane primitives
- Mesh support
- BVH acceleration
- Web Worker multithreading
- Physically based materials

---

## Learning Reference

Inspired by  
*Computer Graphics from Scratch* — Gabriel Gambetta

---

## Author

**Tanish**  
Engineering Student
