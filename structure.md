# RAWengine — Project Structure Tutorial

This document defines the **complete structure, purpose, and data flow**
of RAWengine — a from-scratch **Simulation + Hardcore Graphics engine**.

#### ***✅ - Implemented***

#### ***❌ - Not implemented yet***

## Root Directory - engine


## engine/core — Engine Backbone ❌ 
Purpose:  
Controls execution order, time management, and orchestration.

Engine.js:
- Initializes subsystems
- Runs fixed-timestep loop
- Calls physics → rendering

Time.js:
- Fixed timestep (dt)
- Accumulator
- Frame timing

Rules:
- Core never draws
- Core never computes physics equations

## engine/math — Pure Mathematics Layer

Purpose:  
Standalone math library, portable to script

### Position & Color Vectors, Matrices

- #### Vector Class: 
    - mag / unit ✅
    - add / subtract / scale ✅
    - dot / cross ✅

- #### Matrix Class:
    - identity (default matrix) ✅
    - vector Transformation ✅
    - determinant ✅
    - translation ❌
    - rotationX / rotationY / rotationZ ❌
    - scale ❌
    - matrix × matrix ❌
- #### Color Class:
    - add / sub / scale ✅
    - change Intensity ✅

Rules:
- No canvas
- No physics logic
- No rendering logic

---

## engine/render — Software Renderer

Purpose:  
Transforms geometry into pixels.

### Renderer.js:
- World → View → Projection ✅
- Triangle rasterization ❌
- Back-face culling ❌
- Z-buffer ❌
- Shading ❌

### Camera.js:
- Position (x, y, z) ✅
- Orientation (yaw, pitch) ✅
- View matrix ❌
- Projection matrix ❌

### Mesh.js: ❌
- Vertex list 
- Triangle index list
- Local transform

Rules:
- Renderer never updates physics
- Renderer never owns simulation state

---

## engine/physics — Simulation Engine ❌

Purpose:  
Computes physical truth independent of visuals.

RigidBody.js:
- Position
- Velocity
- Mass
- Force accumulator

Integrator.js:
- Explicit Euler
- Semi-implicit Euler

Forces.js:
- Gravity
- Friction
- Springs

Collision.js:
- Plane collision
- AABB collision
- Impulse resolution

Rules:
- Physics never draws
- Physics never projects to screen

---

## main.js — Scene Definition  ❌

Purpose:  
Defines experiments and scenes.

Responsibilities:
- Create meshes
- Create rigid bodies
- Attach physics to visuals
- Position camera
- Start engine

---

## Data Flow (Non-Negotiable)

Physics (truth)
=>
Math (transforms)
=>
Renderer (pixels)
=>
Canvas


---

<!-- ## Design Philosophy

- Correctness before performance
- Visualization as debugging
- Systems over demos
- CPU pipeline before GPU
- Strict separation of concerns

---

This structure is intentionally strict.
Breaking boundaries early will slow you down later. -->