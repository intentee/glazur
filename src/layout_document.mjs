import { EdgeRoute } from "./edge_route.mjs";
import { PositionedNode } from "./positioned_node.mjs";

export class LayoutDocument {
  /**
   * @param {object} layoutDocument
   * @param {ReadonlyArray<PositionedNode>} layoutDocument.nodes
   * @param {ReadonlyArray<EdgeRoute>} layoutDocument.edges
   */
  constructor({ nodes, edges }) {
    /** @type {ReadonlyArray<PositionedNode>} */
    this.nodes = nodes;
    /** @type {ReadonlyArray<EdgeRoute>} */
    this.edges = edges;
  }
}
