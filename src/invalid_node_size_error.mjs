export class InvalidNodeSizeError extends Error {
  /**
   * @param {string} nodeId
   * @param {number} width
   * @param {number} height
   */
  constructor(nodeId, width, height) {
    super(
      `Node ${nodeId} must have finite non-negative width and height, got width ${width} and height ${height}`,
    );

    /** @type {string} */
    this.name = "InvalidNodeSizeError";
    /** @type {string} */
    this.nodeId = nodeId;
    /** @type {number} */
    this.width = width;
    /** @type {number} */
    this.height = height;
  }
}
