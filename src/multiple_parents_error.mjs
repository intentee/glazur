export class MultipleParentsError extends Error {
  /**
   * @param {string} nodeId
   */
  constructor(nodeId) {
    super(`Node has more than one parent: ${nodeId}`);

    /** @type {string} */
    this.name = "MultipleParentsError";
    /** @type {string} */
    this.nodeId = nodeId;
  }
}
