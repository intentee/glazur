export class MalformedLayoutError extends Error {
  /**
   * @param {string} detail
   */
  constructor(detail) {
    super(`Malformed layout: ${detail}`);

    /** @type {string} */
    this.name = "MalformedLayoutError";
    /** @type {string} */
    this.detail = detail;
  }
}
