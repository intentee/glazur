export class CycleDetectedError extends Error {
  /**
   * @param {ReadonlyArray<string>} unreachableIds
   */
  constructor(unreachableIds) {
    super(
      `Graph contains a cycle; nodes unreachable from the root: ${unreachableIds.join(", ")}`,
    );

    /** @type {string} */
    this.name = "CycleDetectedError";
    /** @type {ReadonlyArray<string>} */
    this.unreachableIds = unreachableIds;
  }
}
