export class MultipleRootsError extends Error {
  /**
   * @param {ReadonlyArray<string>} rootIds
   */
  constructor(rootIds) {
    super(`Graph has more than one root: ${rootIds.join(", ")}`);

    /** @type {string} */
    this.name = "MultipleRootsError";
    /** @type {ReadonlyArray<string>} */
    this.rootIds = rootIds;
  }
}
