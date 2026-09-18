import assert from "node:assert/strict";
import test from "node:test";
import type { ActivityDefinitionRegistry } from "./registry";

test("ActivityDefinitionRegistry contract defines get operation", () => {
  const registry: ActivityDefinitionRegistry = {
    get: () => undefined,
    has: () => false,
    list: () => [],
  };

  assert.equal(registry.get("pulse"), undefined);
});

test("ActivityDefinitionRegistry contract defines has operation", () => {
  const registry: ActivityDefinitionRegistry = {
    get: () => undefined,
    has: () => false,
    list: () => [],
  };

  assert.equal(registry.has("pulse"), false);
});

test("ActivityDefinitionRegistry contract defines list operation", () => {
  const registry: ActivityDefinitionRegistry = {
    get: () => undefined,
    has: () => false,
    list: () => [],
  };

  assert.deepEqual(registry.list(), []);
});
