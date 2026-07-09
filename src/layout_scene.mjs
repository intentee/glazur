import { EdgeSegment } from "./edge_segment.mjs";
import { LayoutDocument } from "./layout_document.mjs";
import { PositionedNode } from "./positioned_node.mjs";
import { ViewBox } from "./view_box.mjs";

export class LayoutScene {
  /**
   * @param {LayoutDocument} document
   */
  constructor(document) {
    /** @type {LayoutDocument} */
    this.document = document;

    /** @type {Map<string, PositionedNode>} */
    this.#nodesById = new Map(document.nodes.map((node) => [node.id, node]));
  }

  /** @type {Map<string, PositionedNode>} */
  #nodesById;

  /**
   * @returns {ReadonlyArray<PositionedNode>}
   */
  get nodes() {
    return this.document.nodes;
  }

  /**
   * @returns {ViewBox}
   */
  viewBox() {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const node of this.document.nodes) {
      minX = Math.min(minX, node.x - node.width / 2);
      minY = Math.min(minY, node.y - node.height / 2);
      maxX = Math.max(maxX, node.x + node.width / 2);
      maxY = Math.max(maxY, node.y + node.height / 2);
    }

    return new ViewBox({
      minX,
      minY,
      width: maxX - minX,
      height: maxY - minY,
    });
  }

  /**
   * @returns {Array<EdgeSegment>}
   */
  edgeSegments() {
    return this.document.edges.map((edge) => {
      const sourceNode = /** @type {PositionedNode} */ (
        this.#nodesById.get(edge.source)
      );
      const targetNode = /** @type {PositionedNode} */ (
        this.#nodesById.get(edge.target)
      );

      return new EdgeSegment({
        source: edge.source,
        target: edge.target,
        start: sourceNode.borderPointToward(edge.to),
        end: targetNode.borderPointToward(edge.from),
      });
    });
  }
}
