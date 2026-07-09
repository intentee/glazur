import assert from "node:assert/strict";
import { test } from "node:test";

import { LayoutScene, parseLayout } from "../src/index.mjs";

test("scene view box tightly bounds every node", function () {
  const scene = new LayoutScene(
    parseLayout({
      nodes: [
        { id: "a", width: 10, height: 6, x: 0, y: 0 },
        { id: "b", width: 4, height: 4, x: 20, y: 10 },
      ],
      edges: [],
    }),
  );
  const viewBox = scene.viewBox();

  assert.equal(viewBox.minX, -5);
  assert.equal(viewBox.minY, -3);
  assert.equal(viewBox.width, 27);
  assert.equal(viewBox.height, 15);
  assert.equal(scene.nodes.length, 2);
});

test("scene clips each edge to the node borders", function () {
  const scene = new LayoutScene(
    parseLayout({
      nodes: [
        { id: "a", width: 10, height: 6, x: 0, y: 0 },
        { id: "b", width: 10, height: 6, x: 20, y: 0 },
      ],
      edges: [
        { source: "a", target: "b", from: { x: 0, y: 0 }, to: { x: 20, y: 0 } },
      ],
    }),
  );
  const segments = scene.edgeSegments();

  assert.equal(segments.length, 1);
  assert.equal(segments[0].source, "a");
  assert.equal(segments[0].target, "b");
  assert.equal(segments[0].start.x, 5);
  assert.equal(segments[0].start.y, 0);
  assert.equal(segments[0].end.x, 15);
  assert.equal(segments[0].end.y, 0);
});
