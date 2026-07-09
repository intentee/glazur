export class InvalidEdgeEndpointsError extends Error {
  /**
   * @param {ReadonlyArray<string>} sources
   * @param {ReadonlyArray<string>} targets
   */
  constructor(sources, targets) {
    super(
      `Edge must have exactly one source and one target, got ${sources.length} source(s) and ${targets.length} target(s)`,
    );

    /** @type {string} */
    this.name = "InvalidEdgeEndpointsError";
    /** @type {ReadonlyArray<string>} */
    this.sources = sources;
    /** @type {ReadonlyArray<string>} */
    this.targets = targets;
  }
}
