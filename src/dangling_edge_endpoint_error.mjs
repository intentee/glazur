export class DanglingEdgeEndpointError extends Error {
  /**
   * @param {string} endpointId
   */
  constructor(endpointId) {
    super(`Edge references unknown node id: ${endpointId}`);

    /** @type {string} */
    this.name = "DanglingEdgeEndpointError";
    /** @type {string} */
    this.endpointId = endpointId;
  }
}
