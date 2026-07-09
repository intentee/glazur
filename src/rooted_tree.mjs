import { CycleDetectedError } from "./cycle_detected_error.mjs";
import { DanglingEdgeEndpointError } from "./dangling_edge_endpoint_error.mjs";
import { DuplicateNodeIdError } from "./duplicate_node_id_error.mjs";
import { InvalidEdgeEndpointsError } from "./invalid_edge_endpoints_error.mjs";
import { InvalidNodeSizeError } from "./invalid_node_size_error.mjs";
import { LayoutNode } from "./layout_node.mjs";
import { MissingRootError } from "./missing_root_error.mjs";
import { MultipleParentsError } from "./multiple_parents_error.mjs";
import { MultipleRootsError } from "./multiple_roots_error.mjs";
import { RootedTreeNode } from "./rooted_tree_node.mjs";

/**
 * @typedef {object} InputNode
 * @property {string} id
 * @property {number} width
 * @property {number} height
 */

/**
 * @typedef {object} InputEdge
 * @property {ReadonlyArray<string>} sources
 * @property {ReadonlyArray<string>} targets
 */

/**
 * @typedef {object} GraphInput
 * @property {ReadonlyArray<InputNode>} nodes
 * @property {ReadonlyArray<InputEdge>} edges
 */

export class RootedTree {
  /**
   * @param {GraphInput} graphInput
   */
  constructor({ nodes, edges }) {
    const nodesById = RootedTree.#buildNodes(nodes);
    const childrenById = RootedTree.#buildChildren(nodesById, edges);
    const rootNode = RootedTree.#findRoot(nodesById, childrenById);

    /** @type {RootedTreeNode} */
    this.#root = RootedTree.#buildTreeNode(rootNode, childrenById);

    RootedTree.#assertFullyReachable(this.#root, nodesById);
  }

  /** @type {RootedTreeNode} */
  #root;

  /**
   * @returns {RootedTreeNode}
   */
  get root() {
    return this.#root;
  }

  /**
   * @param {ReadonlyArray<InputNode>} nodes
   * @returns {Map<string, LayoutNode>}
   */
  static #buildNodes(nodes) {
    /** @type {Map<string, LayoutNode>} */
    const nodesById = new Map();

    for (const { id, width, height } of nodes) {
      if (
        !Number.isFinite(width) ||
        width < 0 ||
        !Number.isFinite(height) ||
        height < 0
      ) {
        throw new InvalidNodeSizeError(id, width, height);
      }

      if (nodesById.has(id)) {
        throw new DuplicateNodeIdError(id);
      }

      nodesById.set(id, new LayoutNode({ id, width, height }));
    }

    return nodesById;
  }

  /**
   * @param {Map<string, LayoutNode>} nodesById
   * @param {ReadonlyArray<InputEdge>} edges
   * @returns {Map<string, Array<LayoutNode>>}
   */
  static #buildChildren(nodesById, edges) {
    /** @type {Map<string, Array<LayoutNode>>} */
    const childrenById = new Map();

    for (const layoutNode of nodesById.values()) {
      childrenById.set(layoutNode.id, []);
    }

    /** @type {Set<string>} */
    const attachedChildIds = new Set();

    for (const { sources, targets } of edges) {
      if (sources.length !== 1 || targets.length !== 1) {
        throw new InvalidEdgeEndpointsError(sources, targets);
      }

      const parentId = sources[0];
      const childId = targets[0];

      if (!nodesById.has(parentId)) {
        throw new DanglingEdgeEndpointError(parentId);
      }

      const childNode = nodesById.get(childId);

      if (childNode === undefined) {
        throw new DanglingEdgeEndpointError(childId);
      }

      if (attachedChildIds.has(childId)) {
        throw new MultipleParentsError(childId);
      }

      attachedChildIds.add(childId);

      const siblings = /** @type {Array<LayoutNode>} */ (
        childrenById.get(parentId)
      );

      siblings.push(childNode);
    }

    return childrenById;
  }

  /**
   * @param {Map<string, LayoutNode>} nodesById
   * @param {Map<string, Array<LayoutNode>>} childrenById
   * @returns {LayoutNode}
   */
  static #findRoot(nodesById, childrenById) {
    /** @type {Set<string>} */
    const childIds = new Set();

    for (const siblings of childrenById.values()) {
      for (const childNode of siblings) {
        childIds.add(childNode.id);
      }
    }

    /** @type {Array<LayoutNode>} */
    const roots = [];

    for (const layoutNode of nodesById.values()) {
      if (!childIds.has(layoutNode.id)) {
        roots.push(layoutNode);
      }
    }

    if (roots.length === 0) {
      throw new MissingRootError();
    }

    if (roots.length > 1) {
      throw new MultipleRootsError(roots.map((rootNode) => rootNode.id));
    }

    return roots[0];
  }

  /**
   * @param {LayoutNode} layoutNode
   * @param {Map<string, Array<LayoutNode>>} childrenById
   * @returns {RootedTreeNode}
   */
  static #buildTreeNode(layoutNode, childrenById) {
    const childNodes = /** @type {Array<LayoutNode>} */ (
      childrenById.get(layoutNode.id)
    );

    const children = childNodes.map((childNode) =>
      RootedTree.#buildTreeNode(childNode, childrenById),
    );

    return new RootedTreeNode({ node: layoutNode, children });
  }

  /**
   * @param {RootedTreeNode} root
   * @param {Map<string, LayoutNode>} nodesById
   */
  static #assertFullyReachable(root, nodesById) {
    /** @type {Set<string>} */
    const reachableIds = new Set();

    RootedTree.#collectReachableIds(root, reachableIds);

    if (reachableIds.size === nodesById.size) {
      return;
    }

    /** @type {Array<string>} */
    const unreachableIds = [];

    for (const id of nodesById.keys()) {
      if (!reachableIds.has(id)) {
        unreachableIds.push(id);
      }
    }

    throw new CycleDetectedError(unreachableIds);
  }

  /**
   * @param {RootedTreeNode} treeNode
   * @param {Set<string>} reachableIds
   */
  static #collectReachableIds(treeNode, reachableIds) {
    reachableIds.add(treeNode.node.id);

    for (const child of treeNode.children) {
      RootedTree.#collectReachableIds(child, reachableIds);
    }
  }
}
