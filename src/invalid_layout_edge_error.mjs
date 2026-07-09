export class InvalidLayoutEdgeError extends Error {
  /**
   * @param {number} index
   * @param {string} field
   */
  constructor(index, field) {
    super(`Invalid layout edge at index ${index}: field ${field}`);

    /** @type {string} */
    this.name = "InvalidLayoutEdgeError";
    /** @type {number} */
    this.index = index;
    /** @type {string} */
    this.field = field;
  }
}
