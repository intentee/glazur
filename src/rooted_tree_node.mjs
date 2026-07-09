import { LayoutNode } from "./layout_node.mjs";

export class RootedTreeNode {
  /**
   * @param {object} treeNode
   * @param {LayoutNode} treeNode.node
   * @param {ReadonlyArray<RootedTreeNode>} treeNode.children
   */
  constructor({ node, children }) {
    /** @type {LayoutNode} */
    this.node = node;
    /** @type {ReadonlyArray<RootedTreeNode>} */
    this.children = children;
  }

  /**
   * @returns {boolean}
   */
  isLeaf() {
    return this.children.length === 0;
  }
}
