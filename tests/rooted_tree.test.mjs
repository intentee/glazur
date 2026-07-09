import assert from "node:assert/strict";
import { test } from "node:test";

import {
  CycleDetectedError,
  DanglingEdgeEndpointError,
  DuplicateNodeIdError,
  InvalidEdgeEndpointsError,
  InvalidNodeSizeError,
  MissingRootError,
  MultipleParentsError,
  MultipleRootsError,
} from "../src/index.mjs";
import { RootedTree } from "../src/rooted_tree.mjs";
import { square } from "./fixture_nodes.mjs";

test("rooted tree builds an ordered hierarchy from a valid graph", function () {
  const tree = new RootedTree({
    nodes: [square("root"), square("a"), square("b"), square("a1")],
    edges: [
      { sources: ["root"], targets: ["a"] },
      { sources: ["root"], targets: ["b"] },
      { sources: ["a"], targets: ["a1"] },
    ],
  });

  assert.equal(tree.root.node.id, "root");
  assert.deepEqual(
    tree.root.children.map((child) => child.node.id),
    ["a", "b"],
  );
  assert.equal(tree.root.children[0].children[0].node.id, "a1");
  assert.equal(tree.root.children[1].isLeaf(), true);
  assert.equal(tree.root.isLeaf(), false);
});

test("rooted tree rejects an edge without exactly one source and target", function () {
  assert.throws(
    () =>
      new RootedTree({
        nodes: [square("root"), square("a")],
        edges: [{ sources: ["root"], targets: ["root", "a"] }],
      }),
    InvalidEdgeEndpointsError,
  );
});

test("rooted tree rejects duplicate node ids", function () {
  assert.throws(
    () =>
      new RootedTree({ nodes: [square("root"), square("root")], edges: [] }),
    DuplicateNodeIdError,
  );
});

test("rooted tree rejects an edge with an unknown source", function () {
  assert.throws(
    () =>
      new RootedTree({
        nodes: [square("root")],
        edges: [{ sources: ["ghost"], targets: ["root"] }],
      }),
    DanglingEdgeEndpointError,
  );
});

test("rooted tree rejects an edge with an unknown target", function () {
  assert.throws(
    () =>
      new RootedTree({
        nodes: [square("root")],
        edges: [{ sources: ["root"], targets: ["ghost"] }],
      }),
    DanglingEdgeEndpointError,
  );
});

test("rooted tree rejects a node with more than one parent", function () {
  assert.throws(
    () =>
      new RootedTree({
        nodes: [square("root"), square("a"), square("b")],
        edges: [
          { sources: ["root"], targets: ["b"] },
          { sources: ["a"], targets: ["b"] },
        ],
      }),
    MultipleParentsError,
  );
});

test("rooted tree rejects a graph with no root", function () {
  assert.throws(
    () =>
      new RootedTree({
        nodes: [square("a"), square("b")],
        edges: [
          { sources: ["a"], targets: ["b"] },
          { sources: ["b"], targets: ["a"] },
        ],
      }),
    MissingRootError,
  );
});

test("rooted tree rejects a graph with more than one root", function () {
  assert.throws(
    () =>
      new RootedTree({
        nodes: [square("a"), square("b"), square("c")],
        edges: [{ sources: ["a"], targets: ["c"] }],
      }),
    MultipleRootsError,
  );
});

test("rooted tree rejects a graph with a cycle", function () {
  assert.throws(
    () =>
      new RootedTree({
        nodes: [square("root"), square("a"), square("b"), square("c")],
        edges: [
          { sources: ["root"], targets: ["a"] },
          { sources: ["b"], targets: ["c"] },
          { sources: ["c"], targets: ["b"] },
        ],
      }),
    CycleDetectedError,
  );
});

test("rooted tree rejects a node with a negative dimension", function () {
  assert.throws(
    () =>
      new RootedTree({
        nodes: [{ id: "root", width: -1, height: 10 }],
        edges: [],
      }),
    InvalidNodeSizeError,
  );
});
