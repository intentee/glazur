export class ViewBox {
  /**
   * @param {object} viewBox
   * @param {number} viewBox.minX
   * @param {number} viewBox.minY
   * @param {number} viewBox.width
   * @param {number} viewBox.height
   */
  constructor({ minX, minY, width, height }) {
    /** @type {number} */
    this.minX = minX;
    /** @type {number} */
    this.minY = minY;
    /** @type {number} */
    this.width = width;
    /** @type {number} */
    this.height = height;
  }
}
