import assert from "node:assert/strict";
import { test } from "node:test";

import { PositionedNode } from "../src/positioned_node.mjs";

function nodeAtOrigin() {
  return new PositionedNode({ id: "n", width: 10, height: 6, x: 0, y: 0 });
}

test("border point toward a horizontal target lands on the vertical edge", function () {
  const point = nodeAtOrigin().borderPointToward({ x: 10, y: 0 });

  assert.equal(point.x, 5);
  assert.equal(point.y, 0);
});

test("border point toward a vertical target lands on the horizontal edge", function () {
  const point = nodeAtOrigin().borderPointToward({ x: 0, y: 6 });

  assert.equal(point.x, 0);
  assert.equal(point.y, 3);
});

test("border point toward a diagonal target lands on the nearer edge", function () {
  const point = nodeAtOrigin().borderPointToward({ x: 10, y: 3 });

  assert.equal(point.x, 5);
  assert.equal(point.y, 1.5);
});

test("border point toward the center returns the center", function () {
  const point = nodeAtOrigin().borderPointToward({ x: 0, y: 0 });

  assert.equal(point.x, 0);
  assert.equal(point.y, 0);
});
