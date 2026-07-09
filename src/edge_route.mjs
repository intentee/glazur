import { Point } from "./point.mjs";

export class EdgeRoute {
  /**
   * @param {object} edgeRoute
   * @param {string} edgeRoute.source
   * @param {string} edgeRoute.target
   * @param {Point} edgeRoute.from
   * @param {Point} edgeRoute.to
   */
  constructor({ source, target, from, to }) {
    /** @type {string} */
    this.source = source;
    /** @type {string} */
    this.target = target;
    /** @type {Point} */
    this.from = from;
    /** @type {Point} */
    this.to = to;
  }
}
