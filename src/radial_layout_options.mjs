import { NonFiniteOptionError } from "./non_finite_option_error.mjs";
import { NonNegativeOptionError } from "./non_negative_option_error.mjs";

const DEFAULT_SPACING = 20;

/**
 * @param {string} option
 * @param {number} value
 */
function assertFinite(option, value) {
  if (!Number.isFinite(value)) {
    throw new NonFiniteOptionError(option, value);
  }
}

/**
 * @param {string} option
 * @param {number} value
 */
function assertNonNegative(option, value) {
  if (value < 0) {
    throw new NonNegativeOptionError(option, value);
  }
}

export class RadialLayoutOptions {
  /**
   * @param {object} [overrides]
   * @param {number} [overrides.spacing]
   */
  constructor({ spacing = DEFAULT_SPACING } = {}) {
    assertFinite("spacing", spacing);
    assertNonNegative("spacing", spacing);

    /** @type {number} */
    this.spacing = spacing;
  }
}
