import assert from "node:assert/strict";
import { test } from "node:test";
import { Worker } from "node:worker_threads";

import { parseLayout, RadialLayout } from "../src/index.mjs";
import { square } from "./fixture_nodes.mjs";

test("radial layout computes inside a worker and returns a matching layout", async function () {
  const graph = {
    nodes: [square("root"), square("a"), square("b")],
    edges: [
      { sources: ["root"], targets: ["a"] },
      { sources: ["root"], targets: ["b"] },
    ],
  };

  const worker = new Worker(
    new URL("./radial_layout_worker.mjs", import.meta.url),
  );

  const message = await new Promise(function (resolve, reject) {
    worker.once("message", resolve);
    worker.once("error", reject);
    worker.postMessage(graph);
  });

  await worker.terminate();

  assert.deepEqual(parseLayout(message), new RadialLayout(graph).compute());
});
