export class NonFiniteOptionError extends Error {
  /**
   * @param {string} option
   * @param {number} value
   */
  constructor(option, value) {
    super(`Layout option ${option} must be a finite number, got ${value}`);

    /** @type {string} */
    this.name = "NonFiniteOptionError";
    /** @type {string} */
    this.option = option;
    /** @type {number} */
    this.value = value;
  }
}
