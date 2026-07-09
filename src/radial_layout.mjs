import { EdgeRouter } from "./edge_router.mjs";
import { LayoutDocument } from "./layout_document.mjs";
import { Point } from "./point.mjs";
import { PositionedNode } from "./positioned_node.mjs";
import { RadialLayoutOptions } from "./radial_layout_options.mjs";
import { RootedTree } from "./rooted_tree.mjs";
import { RootedTreeNode } from "./rooted_tree_node.mjs";

const TWO_PI = 2 * Math.PI;

/**
 * @typedef {object} RingMember
 * @property {number} angle
 * @property {number} boundingRadius
 */

export class RadialLayout {
  /**
   * @param {import("./rooted_tree.mjs").GraphInput} graphInput
   * @param {RadialLayoutOptions} [options]
   */
  constructor(graphInput, options = new RadialLayoutOptions()) {
    /** @type {RootedTree} */
    this.tree = new RootedTree(graphInput);
    /** @type {RadialLayoutOptions} */
    this.options = options;
  }

  /**
   * @returns {LayoutDocument}
   */
  compute() {
    /** @type {Map<string, number>} */
    const leavesById = new Map();

    RadialLayout.#computeLeaves(this.tree.root, leavesById);

    /** @type {Map<string, number>} */
    const depthById = new Map();
    /** @type {Map<string, number>} */
    const angleById = new Map();

    RadialLayout.#assign(
      this.tree.root,
      0,
      0,
      TWO_PI,
      leavesById,
      depthById,
      angleById,
    );

    const ringSpacing = this.#ringSpacing(depthById, angleById);

    /** @type {Map<string, Point>} */
    const positionsById = new Map();

    RadialLayout.#placeNodes(
      this.tree.root,
      ringSpacing,
      depthById,
      angleById,
      positionsById,
    );

    /** @type {Array<PositionedNode>} */
    const nodes = [];

    RadialLayout.#collectPositionedNodes(this.tree.root, positionsById, nodes);

    const edges = new EdgeRouter({
      root: this.tree.root,
      positionsById,
    }).routes();

    return new LayoutDocument({ nodes, edges });
  }

  /**
   * @param {RootedTreeNode} treeNode
   * @param {Map<string, number>} leavesById
   * @returns {number}
   */
  static #computeLeaves(treeNode, leavesById) {
    if (treeNode.children.length === 0) {
      leavesById.set(treeNode.node.id, 1);

      return 1;
    }

    let leaves = 0;

    for (const child of treeNode.children) {
      leaves += RadialLayout.#computeLeaves(child, leavesById);
    }

    leavesById.set(treeNode.node.id, leaves);

    return leaves;
  }

  /**
   * @param {RootedTreeNode} treeNode
   * @param {number} depth
   * @param {number} wedgeStart
   * @param {number} wedgeEnd
   * @param {Map<string, number>} leavesById
   * @param {Map<string, number>} depthById
   * @param {Map<string, number>} angleById
   */
  static #assign(
    treeNode,
    depth,
    wedgeStart,
    wedgeEnd,
    leavesById,
    depthById,
    angleById,
  ) {
    depthById.set(treeNode.node.id, depth);
    angleById.set(treeNode.node.id, (wedgeStart + wedgeEnd) / 2);

    const totalLeaves = /** @type {number} */ (
      leavesById.get(treeNode.node.id)
    );

    let start = wedgeStart;

    for (const child of treeNode.children) {
      const childLeaves = /** @type {number} */ (leavesById.get(child.node.id));
      const end = start + ((wedgeEnd - wedgeStart) * childLeaves) / totalLeaves;

      RadialLayout.#assign(
        child,
        depth + 1,
        start,
        end,
        leavesById,
        depthById,
        angleById,
      );

      start = end;
    }
  }

  /**
   * @param {Map<string, number>} depthById
   * @param {Map<string, number>} angleById
   * @returns {number}
   */
  #ringSpacing(depthById, angleById) {
    /** @type {Map<number, Array<RingMember>>} */
    const ringsByDepth = new Map();
    /** @type {Map<number, number>} */
    const maxBoundingRadiusByDepth = new Map();

    RadialLayout.#collectRings(
      this.tree.root,
      depthById,
      angleById,
      ringsByDepth,
      maxBoundingRadiusByDepth,
    );

    const spacing = this.options.spacing;
    const maxDepth = Math.max(...ringsByDepth.keys());

    let ringSpacing = 0;

    for (let depth = 1; depth <= maxDepth; depth += 1) {
      const innerRadius = /** @type {number} */ (
        maxBoundingRadiusByDepth.get(depth - 1)
      );
      const outerRadius = /** @type {number} */ (
        maxBoundingRadiusByDepth.get(depth)
      );

      ringSpacing = Math.max(ringSpacing, innerRadius + spacing + outerRadius);

      const ring = /** @type {Array<RingMember>} */ (ringsByDepth.get(depth));
      const sorted = [...ring].sort(
        (first, second) => first.angle - second.angle,
      );

      if (sorted.length < 2) {
        continue;
      }

      for (let index = 0; index < sorted.length; index += 1) {
        const current = sorted[index];
        const next = sorted[(index + 1) % sorted.length];
        const forwardGap =
          next.angle -
          current.angle +
          (index + 1 === sorted.length ? TWO_PI : 0);
        const separation =
          current.boundingRadius + next.boundingRadius + spacing;
        const fitRadius = separation / (2 * Math.sin(forwardGap / 2));

        ringSpacing = Math.max(ringSpacing, fitRadius / depth);
      }
    }

    return ringSpacing;
  }

  /**
   * @param {RootedTreeNode} treeNode
   * @param {Map<string, number>} depthById
   * @param {Map<string, number>} angleById
   * @param {Map<number, Array<RingMember>>} ringsByDepth
   * @param {Map<number, number>} maxBoundingRadiusByDepth
   */
  static #collectRings(
    treeNode,
    depthById,
    angleById,
    ringsByDepth,
    maxBoundingRadiusByDepth,
  ) {
    const depth = /** @type {number} */ (depthById.get(treeNode.node.id));
    const angle = /** @type {number} */ (angleById.get(treeNode.node.id));
    const boundingRadius = treeNode.node.boundingRadius();

    const ring = ringsByDepth.get(depth);

    if (ring === undefined) {
      ringsByDepth.set(depth, [{ angle, boundingRadius }]);
    } else {
      ring.push({ angle, boundingRadius });
    }

    const widest = maxBoundingRadiusByDepth.get(depth) ?? 0;

    maxBoundingRadiusByDepth.set(depth, Math.max(widest, boundingRadius));

    for (const child of treeNode.children) {
      RadialLayout.#collectRings(
        child,
        depthById,
        angleById,
        ringsByDepth,
        maxBoundingRadiusByDepth,
      );
    }
  }

  /**
   * @param {RootedTreeNode} treeNode
   * @param {number} ringSpacing
   * @param {Map<string, number>} depthById
   * @param {Map<string, number>} angleById
   * @param {Map<string, Point>} positionsById
   */
  static #placeNodes(
    treeNode,
    ringSpacing,
    depthById,
    angleById,
    positionsById,
  ) {
    const depth = /** @type {number} */ (depthById.get(treeNode.node.id));
    const angle = /** @type {number} */ (angleById.get(treeNode.node.id));
    const radius = depth * ringSpacing;

    positionsById.set(
      treeNode.node.id,
      new Point({ x: radius * Math.cos(angle), y: radius * Math.sin(angle) }),
    );

    for (const child of treeNode.children) {
      RadialLayout.#placeNodes(
        child,
        ringSpacing,
        depthById,
        angleById,
        positionsById,
      );
    }
  }

  /**
   * @param {RootedTreeNode} treeNode
   * @param {Map<string, Point>} positionsById
   * @param {Array<PositionedNode>} nodes
   */
  static #collectPositionedNodes(treeNode, positionsById, nodes) {
    const position = /** @type {Point} */ (positionsById.get(treeNode.node.id));

    nodes.push(
      new PositionedNode({
        id: treeNode.node.id,
        width: treeNode.node.width,
        height: treeNode.node.height,
        x: position.x,
        y: position.y,
      }),
    );

    for (const child of treeNode.children) {
      RadialLayout.#collectPositionedNodes(child, positionsById, nodes);
    }
  }
}
