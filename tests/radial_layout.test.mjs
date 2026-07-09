import assert from "node:assert/strict";
import { test } from "node:test";

import { RadialLayout } from "../src/index.mjs";
import { assertAlmostEqual } from "./almost_equal.mjs";
import { square } from "./fixture_nodes.mjs";

// For 10x10 nodes with spacing 20 the ring step is radialNeed = 2*(diagonal/2) + spacing
// = sqrt(200) + 20 = 34.14213562373095.
const RING_STEP = Math.sqrt(200) + 20;

function positionsById(result) {
  return new Map(result.nodes.map((node) => [node.id, node]));
}

test("radial layout places a single node at the origin without edges", function () {
  const result = new RadialLayout({
    nodes: [square("only")],
    edges: [],
  }).compute();

  assert.equal(result.nodes.length, 1);
  assertAlmostEqual(result.nodes[0].x, 0);
  assertAlmostEqual(result.nodes[0].y, 0);
  assert.deepEqual(result.edges, []);
});

test("radial layout places a lone child one ring step from the centered root", function () {
  const result = new RadialLayout({
    nodes: [square("root"), square("child")],
    edges: [{ sources: ["root"], targets: ["child"] }],
  }).compute();
  const nodes = positionsById(result);

  assertAlmostEqual(nodes.get("root").x, 0);
  assertAlmostEqual(nodes.get("root").y, 0);
  assertAlmostEqual(nodes.get("child").x, -RING_STEP);
  assertAlmostEqual(nodes.get("child").y, 0);
});

test("radial layout spreads equal children evenly on one ring", function () {
  const result = new RadialLayout({
    nodes: [square("root"), square("a"), square("b"), square("c"), square("d")],
    edges: [
      { sources: ["root"], targets: ["a"] },
      { sources: ["root"], targets: ["b"] },
      { sources: ["root"], targets: ["c"] },
      { sources: ["root"], targets: ["d"] },
    ],
  }).compute();
  const nodes = positionsById(result);
  const diagonal = RING_STEP / Math.sqrt(2);

  for (const id of ["a", "b", "c", "d"]) {
    assertAlmostEqual(Math.hypot(nodes.get(id).x, nodes.get(id).y), RING_STEP);
  }
  assertAlmostEqual(nodes.get("a").x, diagonal);
  assertAlmostEqual(nodes.get("a").y, diagonal);
  assertAlmostEqual(nodes.get("c").x, -diagonal);
  assertAlmostEqual(nodes.get("c").y, -diagonal);
});

test("radial layout gives a heavier subtree a wider angular wedge", function () {
  const result = new RadialLayout({
    nodes: [
      square("root"),
      square("a"),
      square("b"),
      square("a1"),
      square("a2"),
    ],
    edges: [
      { sources: ["root"], targets: ["a"] },
      { sources: ["root"], targets: ["b"] },
      { sources: ["a"], targets: ["a1"] },
      { sources: ["a"], targets: ["a2"] },
    ],
  }).compute();
  const nodes = positionsById(result);

  // a holds 2 of the 3 leaves -> its wedge centre is at 2pi/3; b (1 leaf) at 5pi/3.
  assertAlmostEqual(
    Math.atan2(nodes.get("a").y, nodes.get("a").x),
    (2 * Math.PI) / 3,
  );
  assertAlmostEqual(
    Math.atan2(nodes.get("b").y, nodes.get("b").x),
    -Math.PI / 3,
  );
});

test("radial layout never overlaps across mixed sizes and depths", function () {
  const result = new RadialLayout({
    nodes: [
      { id: "root", width: 30, height: 30 },
      { id: "A", width: 20, height: 200 },
      { id: "B", width: 20, height: 20 },
      { id: "a1", width: 40, height: 20 },
      { id: "a2", width: 40, height: 20 },
      { id: "b1", width: 40, height: 20 },
      { id: "b2", width: 40, height: 20 },
    ],
    edges: [
      { sources: ["root"], targets: ["A"] },
      { sources: ["root"], targets: ["B"] },
      { sources: ["A"], targets: ["a1"] },
      { sources: ["A"], targets: ["a2"] },
      { sources: ["B"], targets: ["b1"] },
      { sources: ["B"], targets: ["b2"] },
    ],
  }).compute();

  for (let index = 0; index < result.nodes.length; index += 1) {
    for (let other = index + 1; other < result.nodes.length; other += 1) {
      const first = result.nodes[index];
      const second = result.nodes[other];
      const penetrationX =
        first.width / 2 + second.width / 2 - Math.abs(first.x - second.x);
      const penetrationY =
        first.height / 2 + second.height / 2 - Math.abs(first.y - second.y);

      assert.ok(
        penetrationX <= 1e-9 || penetrationY <= 1e-9,
        `${first.id} overlaps ${second.id}`,
      );
    }
  }
});

test("radial layout produces identical output for identical input", function () {
  const graph = {
    nodes: [square("root"), square("a"), square("b")],
    edges: [
      { sources: ["root"], targets: ["a"] },
      { sources: ["a"], targets: ["b"] },
    ],
  };

  const first = new RadialLayout(graph).compute();
  const second = new RadialLayout(graph).compute();

  assert.deepEqual(first, second);
});

test("radial layout routes each edge from parent center to child center", function () {
  const result = new RadialLayout({
    nodes: [square("root"), square("a")],
    edges: [{ sources: ["root"], targets: ["a"] }],
  }).compute();
  const nodes = positionsById(result);
  const [edge] = result.edges;

  assert.equal(result.edges.length, 1);
  assert.equal(edge.source, "root");
  assert.equal(edge.target, "a");
  assertAlmostEqual(edge.from.x, nodes.get("root").x);
  assertAlmostEqual(edge.from.y, nodes.get("root").y);
  assertAlmostEqual(edge.to.x, nodes.get("a").x);
  assertAlmostEqual(edge.to.y, nodes.get("a").y);
});
