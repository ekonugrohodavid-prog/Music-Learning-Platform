import assert from "node:assert/strict";
import test from "node:test";
import {
  createWave1ActivityDefinitionRegistry,
} from "./wave1-registry.ts";

test("Wave 1 registry registers pulse activity", () => {
  const registry =
    createWave1ActivityDefinitionRegistry();

  assert.equal(registry.has("pulse"), true);
});

test("Wave 1 registry does not register deferred activity types", () => {
  const registry =
    createWave1ActivityDefinitionRegistry();

  assert.equal(registry.has("tempo"), false);
  assert.equal(registry.has("meter"), false);
});

test("Wave 1 registry returns pulse definition", () => {
  const registry =
    createWave1ActivityDefinitionRegistry();

  const definition = registry.get("pulse");

  assert.equal(definition?.type, "pulse");
});

test("Wave 1 registry lists only the R1 pulse definition", () => {
  const registry =
    createWave1ActivityDefinitionRegistry();

  assert.deepEqual(
    registry.list().map((definition) => definition.type),
    ["pulse"],
  );
});
