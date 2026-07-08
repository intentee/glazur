import assert from "node:assert/strict";
import { test } from "node:test";

import { helloWorld } from "../src/index.mjs";

test("helloWorld returns the greeting", function () {
  assert.equal(helloWorld(), "Hello, world!");
});
