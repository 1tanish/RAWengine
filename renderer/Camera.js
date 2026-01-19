import { Vector, Color, Matrix } from "../math/Position & Color Vectors, Matrices.js";

function lookAt() {}

export class Camera {
  constructor(C, T, up = new Vector(0, 1, 0)) {
    this.position = C;
    this.target = T;
    this.up = up;
    this.offset = this.position.sub(this.target)
    this.radius = this.offset.mag()
    this.yaw = Math.atan2(this.offset.x, this.offset.z);
    this.pitch = Math.asin(this.offset.y / this.radius);
  }
  rotationM() {
    const forward = this.target.sub(this.position).unit();
    const right = forward.cross(this.up).unit();
    const trueUp = right.cross(forward).unit();

    return new Matrix(right, trueUp, forward);
  }
  calcYaw(){
    return Math.atan2(this.offset.x, this.offset.z)
  }
  calcPitch(){
    return Math.asin(this.offset.y / this.radius);
  }
  calcR(){
    return this.position.sub(this.target).mag()
  }
}
