export class DuplicateNodeIdError extends Error {
  /**
   * @param {string} nodeId
   */
  constructor(nodeId) {
    super(`Duplicate node id: ${nodeId}`);

    /** @type {string} */
    this.name = "DuplicateNodeIdError";
    /** @type {string} */
    this.nodeId = nodeId;
  }
}
