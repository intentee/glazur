import { EdgeRoute } from "./edge_route.mjs";
import { InvalidLayoutEdgeError } from "./invalid_layout_edge_error.mjs";
import { InvalidLayoutNodeError } from "./invalid_layout_node_error.mjs";
import { LayoutDocument } from "./layout_document.mjs";
import { MalformedLayoutError } from "./malformed_layout_error.mjs";
import { Point } from "./point.mjs";
import { PositionedNode } from "./positioned_node.mjs";

/**
 * @param {unknown} value
 * @returns {value is ReadonlyArray<unknown>}
 */
function isUnknownArray(value) {
  return Array.isArray(value);
}

/**
 * @param {unknown} value
 * @param {() => Error} makeError
 * @returns {Record<string, unknown>}
 */
function requireRecord(value, makeError) {
  if (typeof value !== "object" || value === null || isUnknownArray(value)) {
    throw makeError();
  }

  return /** @type {Record<string, unknown>} */ (value);
}

/**
 * @param {Record<string, unknown>} record
 * @param {string} key
 * @returns {boolean}
 */
function hasString(record, key) {
  return typeof record[key] === "string";
}

/**
 * @param {Record<string, unknown>} record
 * @param {string} key
 * @returns {boolean}
 */
function hasFiniteNumber(record, key) {
  const value = record[key];

  return typeof value === "number" && Number.isFinite(value);
}

/**
 * @param {unknown} value
 * @param {number} index
 * @returns {PositionedNode}
 */
function parseNode(value, index) {
  const record = requireRecord(
    value,
    () => new InvalidLayoutNodeError(index, "node"),
  );

  if (!hasString(record, "id")) {
    throw new InvalidLayoutNodeError(index, "id");
  }

  for (const field of ["width", "height", "x", "y"]) {
    if (!hasFiniteNumber(record, field)) {
      throw new InvalidLayoutNodeError(index, field);
    }
  }

  return new PositionedNode({
    id: /** @type {string} */ (record.id),
    width: /** @type {number} */ (record.width),
    height: /** @type {number} */ (record.height),
    x: /** @type {number} */ (record.x),
    y: /** @type {number} */ (record.y),
  });
}

/**
 * @param {unknown} value
 * @param {number} index
 * @param {string} field
 * @returns {Point}
 */
function parsePoint(value, index, field) {
  const record = requireRecord(
    value,
    () => new InvalidLayoutEdgeError(index, field),
  );

  if (!hasFiniteNumber(record, "x") || !hasFiniteNumber(record, "y")) {
    throw new InvalidLayoutEdgeError(index, field);
  }

  return new Point({
    x: /** @type {number} */ (record.x),
    y: /** @type {number} */ (record.y),
  });
}

/**
 * @param {unknown} value
 * @param {number} index
 * @param {ReadonlySet<string>} nodeIds
 * @returns {EdgeRoute}
 */
function parseEdge(value, index, nodeIds) {
  const record = requireRecord(
    value,
    () => new InvalidLayoutEdgeError(index, "edge"),
  );

  if (!hasString(record, "source")) {
    throw new InvalidLayoutEdgeError(index, "source");
  }

  if (!hasString(record, "target")) {
    throw new InvalidLayoutEdgeError(index, "target");
  }

  const source = /** @type {string} */ (record.source);
  const target = /** @type {string} */ (record.target);

  if (!nodeIds.has(source)) {
    throw new InvalidLayoutEdgeError(index, "source");
  }

  if (!nodeIds.has(target)) {
    throw new InvalidLayoutEdgeError(index, "target");
  }

  return new EdgeRoute({
    source,
    target,
    from: parsePoint(record.from, index, "from"),
    to: parsePoint(record.to, index, "to"),
  });
}

/**
 * @param {unknown} value
 * @returns {LayoutDocument}
 */
export function parseLayout(value) {
  const record = requireRecord(
    value,
    () => new MalformedLayoutError("layout must be an object"),
  );

  if (!isUnknownArray(record.nodes)) {
    throw new MalformedLayoutError("layout nodes must be an array");
  }

  if (!isUnknownArray(record.edges)) {
    throw new MalformedLayoutError("layout edges must be an array");
  }

  if (record.nodes.length === 0) {
    throw new MalformedLayoutError("layout must have at least one node");
  }

  const nodes = record.nodes.map((nodeValue, index) =>
    parseNode(nodeValue, index),
  );
  const nodeIds = new Set(nodes.map((node) => node.id));
  const edges = record.edges.map((edgeValue, index) =>
    parseEdge(edgeValue, index, nodeIds),
  );

  return new LayoutDocument({ nodes, edges });
}
