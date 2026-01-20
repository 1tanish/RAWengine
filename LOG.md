

# RAWengine — Changelog

All notable changes to **RAWengine** are documented in this log.  
This project follows a milestone-based and incremental development process.

---

## [Unreleased]
### Planned
- Support for cube and plane primitives
- Axis-aligned bounding boxes (AABB)
- BVH acceleration structure
- Web Worker–based multithreading
- Improved sampling strategies
- Physically based material system

---

## [0.9.0] — Interactive Rendering & Optimization

### Added
- Mouse picking using screen-to-world ray casting
- Camera focus on selected objects
- Pixel subsampling to reduce ray count per frame
- Direct `ImageData`-based rendering pipeline

### Improved
- Rendering performance and frame stability
- Visual quality under reduced sampling

### Fixed
- Camera controls breaking after object selection
- Performance drops caused by repeated canvas draw calls

---

## [0.8.0] — Camera System Enhancements

### Added
- Orbit camera with yaw and pitch control
- Camera zoom using mouse scroll
- Camera panning using Shift + drag

### Fixed
- Sudden 180° camera rotation during interaction
- Scene disappearance when zooming too close to objects

### Changed
- Camera distance clamping to prevent target crossing
- Improved camera state handling and control decoupling

---

## [0.7.0] — Reflection Support

### Added
- Recursive reflection ray tracing
- Per-object reflection coefficient
- Recursion depth limiting

### Fixed
- Infinite recursion issues
- Black screen rendering caused by missing base cases

---

## [0.6.0] — Lighting Model Implementation

### Added
- Ambient lighting
- Diffuse lighting (Lambertian model)
- Specular highlights (Phong model)

### Changed
- Accurate surface normal computation at hit points
- Reflection vector calculation using incoming ray direction

### Fixed
- Incorrect specular reflections due to inverted ray direction

---

## [0.5.0] — Ray–Object Intersection

### Added
- Ray–sphere intersection using quadratic equation
- Nearest-hit selection logic
- Valid intersection range (`t`) filtering

### Fixed
- Objects rendering behind the camera
- Missed intersections caused by incorrect `t` bounds

---

## [0.4.0] — Ray Generation

### Added
- Pixel-to-viewport coordinate mapping
- Primary ray generation from the camera
- Configurable viewport and projection parameters

---

## [0.3.0] — Core Math Utilities

### Added
- Vector operations (addition, subtraction, scaling)
- Dot product and cross product
- Vector normalization

### Fixed
- Coordinate system inconsistencies
- Incorrect cross-product direction assumptions

---

## [0.2.0] — Project Structure

### Added
- Modular separation of math, renderer, and camera logic
- Scene abstraction for cameras, objects, and lights

### Changed
- Improved code readability and maintainability

---

## [0.1.0] — Initial Setup

### Added
- HTML5 Canvas rendering setup
- Basic application bootstrap
- Initial project folder structure

---

## Notes

- Rendering is fully CPU-based
- No external graphics or rendering libraries are used
- Primary goal is conceptual clarity and learning

---

**Project:** RAWengine  
**Author:** Tanish  
**Status:** Actively maintained