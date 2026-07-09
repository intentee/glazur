import { parentPort } from "node:worker_threads";

import { RadialLayout } from "../src/index.mjs";

parentPort.on("message", function (graph) {
  parentPort.postMessage(new RadialLayout(graph).compute());
});
