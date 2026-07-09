import { Point } from "./point.mjs";

export class EdgeSegment {
  /**
   * @param {object} edgeSegment
   * @param {string} edgeSegment.source
   * @param {string} edgeSegment.target
   * @param {Point} edgeSegment.start
   * @param {Point} edgeSegment.end
   */
  constructor({ source, target, start, end }) {
    /** @type {string} */
    this.source = source;
    /** @type {string} */
    this.target = target;
    /** @type {Point} */
    this.start = start;
    /** @type {Point} */
    this.end = end;
  }
}
