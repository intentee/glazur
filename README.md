# Glazur 🧱

Layouting and tiling engine.

## Installation

```sh
npm install glazur
```

## Radial layout

`RadialLayout` grows a rooted tree outward from its root as an evenly spaced radial burst:
each depth becomes a ring, and every subtree occupies an angular wedge sized by how many
leaves it contains. All rings share a single spacing step, so parent→child edges all have
roughly the same length, node spacing is even in every direction, and — because that step is
sized so every ring clears both radially and angularly (using each node's bounding disk) — no
two node boxes ever overlap.

The layout is fully deterministic (identical input always yields identical output) and
depends only on plain data, so it runs unchanged inside a Web Worker.

```js
import { RadialLayout, RadialLayoutOptions } from "glazur";

const { nodes, edges } = new RadialLayout(
    {
        nodes: [
            { id: "home", width: 80, height: 40 },
            { id: "shop", width: 80, height: 40 },
            { id: "checkout", width: 80, height: 40 },
        ],
        edges: [
            { sources: ["home"], targets: ["shop"] },
            { sources: ["home"], targets: ["checkout"] },
        ],
    },
    new RadialLayoutOptions({ spacing: 24 }),
).compute();

// nodes: [{ id, width, height, x, y }, ...] with x, y at each node's center
// edges: [{ source, target, from: { x, y }, to: { x, y } }, ...]
```

### Options

| Option    | Default | Effect                                       |
| --------- | ------- | -------------------------------------------- |
| `spacing` | `20`    | Minimum gap between neighbouring node boxes. |

The input must describe a single rooted tree: exactly one root, every other node reached
by exactly one edge, and no cycles. Malformed input fails fast with a specific typed error.

## Visualization

In a clone of this repository, `make visualize` starts a small static server and prints a URL. Opening it runs the layout
**inside a Web Worker**, validates the worker's output with `parseLayout`, and renders it with
`LayoutScene` — nodes as boxes and edges clipped to the node borders.

```js
import { LayoutScene, parseLayout } from "glazur";

const document = parseLayout(layoutJson); // validate untrusted layout JSON, or a compute() result
const scene = new LayoutScene(document);
scene.viewBox(); // { minX, minY, width, height }
scene.edgeSegments(); // [{ source, target, start, end }] clipped to node borders
```
