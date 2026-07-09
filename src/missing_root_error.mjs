export class MissingRootError extends Error {
  constructor() {
    super("Graph has no root: every node has a parent");

    /** @type {string} */
    this.name = "MissingRootError";
  }
}
