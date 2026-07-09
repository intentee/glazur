export class Point {
  /**
   * @param {object} point
   * @param {number} point.x
   * @param {number} point.y
   */
  constructor({ x, y }) {
    /** @type {number} */
    this.x = x;
    /** @type {number} */
    this.y = y;
  }
}
