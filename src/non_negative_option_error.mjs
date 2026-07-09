export class NonNegativeOptionError extends Error {
  /**
   * @param {string} option
   * @param {number} value
   */
  constructor(option, value) {
    super(
      `Layout option ${option} must be greater than or equal to zero, got ${value}`,
    );

    /** @type {string} */
    this.name = "NonNegativeOptionError";
    /** @type {string} */
    this.option = option;
    /** @type {number} */
    this.value = value;
  }
}
