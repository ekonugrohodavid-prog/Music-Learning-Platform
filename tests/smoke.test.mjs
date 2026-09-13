import test from "node:test";
import assert from "node:assert/strict";

test("Node test runner is configured", () => {
  assert.equal(typeof process.version, "string");
});