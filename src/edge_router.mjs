import { EdgeRoute } from "./edge_route.mjs";
import { Point } from "./point.mjs";
import { RootedTreeNode } from "./rooted_tree_node.mjs";

export class EdgeRouter {
  /**
   * @param {object} routing
   * @param {RootedTreeNode} routing.root
   * @param {Map<string, Point>} routing.positionsById
   */
  constructor({ root, positionsById }) {
    /** @type {RootedTreeNode} */
    this.root = root;
    /** @type {Map<string, Point>} */
    this.positionsById = positionsById;
  }

  /**
   * @returns {Array<EdgeRoute>}
   */
  routes() {
    /** @type {Array<EdgeRoute>} */
    const routes = [];

    this.#appendRoutes(this.root, routes);

    return routes;
  }

  /**
   * @param {RootedTreeNode} treeNode
   * @param {Array<EdgeRoute>} routes
   */
  #appendRoutes(treeNode, routes) {
    const from = /** @type {Point} */ (
      this.positionsById.get(treeNode.node.id)
    );

    for (const child of treeNode.children) {
      const to = /** @type {Point} */ (this.positionsById.get(child.node.id));

      routes.push(
        new EdgeRoute({
          source: treeNode.node.id,
          target: child.node.id,
          from,
          to,
        }),
      );

      this.#appendRoutes(child, routes);
    }
  }
}
