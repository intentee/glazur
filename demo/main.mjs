import { LayoutScene, parseLayout } from "../src/index.mjs";

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

const site = {
  id: "Home",
  width: 100,
  height: 46,
  children: [
    {
      id: "Search",
      width: 84,
      height: 34,
      children: [
        { id: "Results", width: 74, height: 26 },
        { id: "Filters", width: 68, height: 26 },
        { id: "Suggestions", width: 100, height: 26 },
      ],
    },
    {
      id: "Shop",
      width: 72,
      height: 40,
      children: [
        {
          id: "Electronics",
          width: 96,
          height: 30,
          children: [
            {
              id: "Phones",
              width: 68,
              height: 28,
              children: [{ id: "Product", width: 92, height: 46 }],
            },
            { id: "Laptops", width: 74, height: 28 },
            { id: "Audio", width: 62, height: 28 },
          ],
        },
        {
          id: "Fashion",
          width: 76,
          height: 30,
          children: [
            { id: "Men", width: 50, height: 26 },
            { id: "Women", width: 62, height: 26 },
            { id: "Kids", width: 50, height: 26 },
          ],
        },
        { id: "Home Goods", width: 96, height: 28 },
        { id: "Grocery", width: 76, height: 28 },
      ],
    },
    {
      id: "Account",
      width: 82,
      height: 34,
      children: [
        { id: "Profile", width: 66, height: 26 },
        { id: "Addresses", width: 84, height: 26 },
        { id: "Payments", width: 80, height: 26 },
        { id: "Security", width: 74, height: 26 },
      ],
    },
    {
      id: "Cart",
      width: 64,
      height: 38,
      children: [{ id: "Saved Items", width: 92, height: 26 }],
    },
    {
      id: "Checkout",
      width: 96,
      height: 44,
      children: [
        { id: "Shipping", width: 76, height: 28 },
        { id: "Payment", width: 74, height: 28 },
        { id: "Confirm", width: 70, height: 28 },
      ],
    },
    {
      id: "Orders",
      width: 76,
      height: 32,
      children: [
        { id: "History", width: 66, height: 26 },
        { id: "Tracking", width: 76, height: 26 },
        { id: "Returns", width: 68, height: 26 },
      ],
    },
    {
      id: "Sell",
      width: 60,
      height: 32,
      children: [
        { id: "Dashboard", width: 86, height: 28 },
        { id: "Listings", width: 72, height: 26 },
      ],
    },
    {
      id: "Help",
      width: 60,
      height: 30,
      children: [
        { id: "FAQ", width: 50, height: 26 },
        { id: "Contact", width: 72, height: 26 },
      ],
    },
  ],
};

const options = { spacing: 24 };

function flattenSite(page, parentId, nodes, edges) {
  const { id, width, height, children } = page;

  nodes.push({ id, width, height });

  if (parentId !== null) {
    edges.push({ sources: [parentId], targets: [id] });
  }

  for (const child of children ?? []) {
    flattenSite(child, id, nodes, edges);
  }
}

function siteGraph() {
  const nodes = [];
  const edges = [];

  flattenSite(site, null, nodes, edges);

  return { nodes, edges };
}

const canvas = document.getElementById("canvas");

function renderScene(scene) {
  const viewBox = scene.viewBox();

  canvas.setAttribute(
    "viewBox",
    `${viewBox.minX} ${viewBox.minY} ${viewBox.width} ${viewBox.height}`,
  );

  for (const segment of scene.edgeSegments()) {
    const line = document.createElementNS(SVG_NAMESPACE, "line");

    line.setAttribute("class", "glazur-edge");
    line.setAttribute("x1", String(segment.start.x));
    line.setAttribute("y1", String(segment.start.y));
    line.setAttribute("x2", String(segment.end.x));
    line.setAttribute("y2", String(segment.end.y));
    canvas.appendChild(line);
  }

  for (const node of scene.nodes) {
    const rectangle = document.createElementNS(SVG_NAMESPACE, "rect");

    rectangle.setAttribute("class", "glazur-node");
    rectangle.setAttribute("x", String(node.x - node.width / 2));
    rectangle.setAttribute("y", String(node.y - node.height / 2));
    rectangle.setAttribute("width", String(node.width));
    rectangle.setAttribute("height", String(node.height));
    canvas.appendChild(rectangle);

    const label = document.createElementNS(SVG_NAMESPACE, "text");

    label.setAttribute("class", "glazur-label");
    label.setAttribute("x", String(node.x));
    label.setAttribute("y", String(node.y));
    label.textContent = node.id;
    canvas.appendChild(label);
  }
}

const worker = new Worker(new URL("./worker.mjs", import.meta.url), {
  type: "module",
});

worker.addEventListener("message", function (event) {
  const layoutDocument = parseLayout(event.data);

  renderScene(new LayoutScene(layoutDocument));
});

worker.postMessage({ graph: siteGraph(), options });
