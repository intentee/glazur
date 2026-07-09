export class InvalidLayoutNodeError extends Error {
  /**
   * @param {number} index
   * @param {string} field
   */
  constructor(index, field) {
    super(`Invalid layout node at index ${index}: field ${field}`);

    /** @type {string} */
    this.name = "InvalidLayoutNodeError";
    /** @type {number} */
    this.index = index;
    /** @type {string} */
    this.field = field;
  }
}
