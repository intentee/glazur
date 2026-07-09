import { RadialLayout, RadialLayoutOptions } from "../src/index.mjs";

self.onmessage = function (event) {
  const { graph, options } = event.data;
  const layout = new RadialLayout(
    graph,
    new RadialLayoutOptions(options),
  ).compute();

  self.postMessage(layout);
};
