import { Point } from "./point.mjs";

export class PositionedNode {
  /**
   * @param {object} positionedNode
   * @param {string} positionedNode.id
   * @param {number} positionedNode.width
   * @param {number} positionedNode.height
   * @param {number} positionedNode.x
   * @param {number} positionedNode.y
   */
  constructor({ id, width, height, x, y }) {
    /** @type {string} */
    this.id = id;
    /** @type {number} */
    this.width = width;
    /** @type {number} */
    this.height = height;
    /** @type {number} */
    this.x = x;
    /** @type {number} */
    this.y = y;
  }

  /**
   * @param {Point} target
   * @returns {Point}
   */
  borderPointToward(target) {
    const deltaX = target.x - this.x;
    const deltaY = target.y - this.y;

    if (deltaX === 0 && deltaY === 0) {
      return new Point({ x: this.x, y: this.y });
    }

    const horizontalScale =
      deltaX === 0 ? Infinity : this.width / 2 / Math.abs(deltaX);
    const verticalScale =
      deltaY === 0 ? Infinity : this.height / 2 / Math.abs(deltaY);
    const scale = Math.min(horizontalScale, verticalScale);

    return new Point({
      x: this.x + deltaX * scale,
      y: this.y + deltaY * scale,
    });
  }
}
