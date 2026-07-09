import assert from "node:assert/strict";

const COORDINATE_TOLERANCE = 1e-9;

export function assertAlmostEqual(actual, expected) {
  assert.ok(
    Math.abs(actual - expected) < COORDINATE_TOLERANCE,
    `Expected ${actual} to be within ${COORDINATE_TOLERANCE} of ${expected}`,
  );
}
