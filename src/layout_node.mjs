export class LayoutNode {
  /**
   * @param {object} node
   * @param {string} node.id
   * @param {number} node.width
   * @param {number} node.height
   */
  constructor({ id, width, height }) {
    /** @type {string} */
    this.id = id;
    /** @type {number} */
    this.width = width;
    /** @type {number} */
    this.height = height;
  }

  /**
   * @returns {number}
   */
  boundingRadius() {
    return Math.sqrt(this.width * this.width + this.height * this.height) / 2;
  }
}
