import assert from "node:assert/strict";
import { test } from "node:test";

import {
  InvalidLayoutEdgeError,
  InvalidLayoutNodeError,
  LayoutDocument,
  MalformedLayoutError,
  parseLayout,
} from "../src/index.mjs";

function validLayout() {
  return {
    nodes: [
      { id: "root", width: 10, height: 10, x: 0, y: 0 },
      { id: "a", width: 8, height: 6, x: 30, y: 0 },
    ],
    edges: [
      {
        source: "root",
        target: "a",
        from: { x: 0, y: 0 },
        to: { x: 30, y: 0 },
      },
    ],
  };
}

test("parsing a valid layout builds a layout document", function () {
  const document = parseLayout(validLayout());

  assert.ok(document instanceof LayoutDocument);
  assert.equal(document.nodes.length, 2);
  assert.equal(document.nodes[0].id, "root");
  assert.equal(document.nodes[0].width, 10);
  assert.equal(document.edges.length, 1);
  assert.equal(document.edges[0].source, "root");
  assert.equal(document.edges[0].target, "a");
  assert.equal(document.edges[0].from.x, 0);
  assert.equal(document.edges[0].to.x, 30);
});

test("parsing rejects a non-object layout", function () {
  assert.throws(() => parseLayout(42), MalformedLayoutError);
});

test("parsing rejects non-array nodes", function () {
  assert.throws(
    () => parseLayout({ nodes: {}, edges: [] }),
    MalformedLayoutError,
  );
});

test("parsing rejects non-array edges", function () {
  assert.throws(
    () => parseLayout({ nodes: [], edges: {} }),
    MalformedLayoutError,
  );
});

test("parsing rejects a layout with no nodes", function () {
  assert.throws(
    () => parseLayout({ nodes: [], edges: [] }),
    MalformedLayoutError,
  );
});

test("parsing rejects a non-object node", function () {
  assert.throws(
    () => parseLayout({ nodes: [42], edges: [] }),
    InvalidLayoutNodeError,
  );
});

test("parsing rejects a node with a non-string id", function () {
  assert.throws(
    () =>
      parseLayout({
        nodes: [{ id: 1, width: 1, height: 1, x: 0, y: 0 }],
        edges: [],
      }),
    InvalidLayoutNodeError,
  );
});

test("parsing rejects a node with a non-finite dimension", function () {
  assert.throws(
    () =>
      parseLayout({
        nodes: [{ id: "n", width: Number.NaN, height: 1, x: 0, y: 0 }],
        edges: [],
      }),
    InvalidLayoutNodeError,
  );
});

test("parsing rejects a non-object edge", function () {
  const layout = validLayout();
  layout.edges = [42];

  assert.throws(() => parseLayout(layout), InvalidLayoutEdgeError);
});

test("parsing rejects an edge with a non-string source", function () {
  const layout = validLayout();
  layout.edges[0].source = 7;

  assert.throws(() => parseLayout(layout), InvalidLayoutEdgeError);
});

test("parsing rejects an edge with a non-string target", function () {
  const layout = validLayout();
  layout.edges[0].target = 7;

  assert.throws(() => parseLayout(layout), InvalidLayoutEdgeError);
});

test("parsing rejects an edge whose source is not a node", function () {
  const layout = validLayout();
  layout.edges[0].source = "ghost";

  assert.throws(() => parseLayout(layout), InvalidLayoutEdgeError);
});

test("parsing rejects an edge whose target is not a node", function () {
  const layout = validLayout();
  layout.edges[0].target = "ghost";

  assert.throws(() => parseLayout(layout), InvalidLayoutEdgeError);
});

test("parsing rejects an edge with a non-object endpoint", function () {
  const layout = validLayout();
  layout.edges[0].from = null;

  assert.throws(() => parseLayout(layout), InvalidLayoutEdgeError);
});

test("parsing rejects an edge endpoint with a non-finite coordinate", function () {
  const layout = validLayout();
  layout.edges[0].to = { x: 0, y: Number.POSITIVE_INFINITY };

  assert.throws(() => parseLayout(layout), InvalidLayoutEdgeError);
});
