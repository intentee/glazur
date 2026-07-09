import assert from "node:assert/strict";
import { test } from "node:test";

import {
  NonFiniteOptionError,
  NonNegativeOptionError,
  RadialLayoutOptions,
} from "../src/index.mjs";

test("radial layout options fall back to the grounded default spacing", function () {
  assert.equal(new RadialLayoutOptions().spacing, 20);
});

test("radial layout options accept a spacing override", function () {
  assert.equal(new RadialLayoutOptions({ spacing: 40 }).spacing, 40);
});

test("radial layout options reject a non-finite spacing", function () {
  assert.throws(
    () => new RadialLayoutOptions({ spacing: Number.NaN }),
    NonFiniteOptionError,
  );
});

test("radial layout options reject a negative spacing", function () {
  assert.throws(
    () => new RadialLayoutOptions({ spacing: -1 }),
    NonNegativeOptionError,
  );
});
