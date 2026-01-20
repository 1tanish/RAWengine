export class Vector {
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

export class Color {
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

export class Matrix {
  constructor(i = { x: 1, y: 0, z: 0 }, j = { x: 0, y: 1, z: 0 }, k = { x: 0, y: 0, z: 1 }) {
    (this.m00 = i.x), (this.m01 = j.x), (this.m02 = k.x), (this.m10 = i.y), (this.m11 = j.y), (this.m12 = k.y), (this.m20 = i.z), (this.m21 = j.z), (this.m22 = k.z);
  }
  transform(v) {
    //can linearly transform matrix v
    return new Vector(
      this.m00 * v.x + this.m01 * v.y + this.m02 * v.z, 
      this.m10 * v.x + this.m11 * v.y + this.m12 * v.z, 
      this.m20 * v.x + this.m21 * v.y + this.m22 * v.z
    );
  }

  det2(a, b, c, d) {
    return a * d - b * c;
  }
  det() {
    // calculates the determinant
    return this.m00 * this.det2(this.m11, this.m12, this.m21, this.m22) - this.m01 * this.det2(this.m10, this.m12, this.m20, this.m22) + this.m02 * this.det2(this.m10, this.m11, this.m20, this.m21);
  }
}
// const i = new Vector(0, 1, 0); // basis vector i
// const j = new Vector(-1, 0, 0); // basis vector j
// const k = new Vector(0, 0, 1); // basis vector k

// // {
// //   const M12 = new Matrix(i, j, k);
// //   const v = new Vector(2, 2, 2);

// //   console.log(M12.transform(v));

// //   const i = new Vector(2, 0, 0); // basis vector i
// //   const j = new Vector(0, 4, 0); // basis vector j
// //   const k = new Vector(0, 0, 5); // basis vector k}

// const u = new Vector(4,0);
// const v = new Vector(0,-5);

// const M = new Matrix(u,v); // transformed matrix

// console.log(i.cross(j));



