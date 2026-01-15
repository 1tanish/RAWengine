import { Vector, Color, Matrix } from "../math/Position & Color Vectors, Matrices.js";

function lookAt() {}

export class Camera {
  constructor(C, T, up = new Vector(0, 1, 0)) {
    this.position = C;
    this.target = T;
    this.up = up
  }
  rotationM() {
    const forward = this.target.sub(this.position).unit();
    const right = forward.cross(this.up).unit();
    const trueUp = right.cross(forward).unit();

    return new Matrix(right, trueUp, forward);
  }
}
