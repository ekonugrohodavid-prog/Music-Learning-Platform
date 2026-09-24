import test from "node:test";
import assert from "node:assert/strict";
import { classifyPulseTiming } from "./pulse-classification.ts";
import type { PulseTimingPolicy } from "./pulse-policy.ts";

const policy: PulseTimingPolicy = {
  hitWindowMs: 50,
  partialWindowMs: 150,
};

test("ACT-006 classifies deviation inside hit window as hit", () => {
  assert.equal(classifyPulseTiming(0, policy), "hit");
  assert.equal(classifyPulseTiming(50, policy), "hit");
  assert.equal(classifyPulseTiming(-50, policy), "hit");
});

test("ACT-006 classifies deviation inside partial window as partial", () => {
  assert.equal(classifyPulseTiming(51, policy), "partial");
  assert.equal(classifyPulseTiming(150, policy), "partial");
  assert.equal(classifyPulseTiming(-150, policy), "partial");
});

test("ACT-006 classifies deviation outside partial window as miss", () => {
  assert.equal(classifyPulseTiming(151, policy), "miss");
  assert.equal(classifyPulseTiming(-151, policy), "miss");
});

test("ACT-006 uses absolute timing deviation", () => {
  assert.equal(classifyPulseTiming(-25, policy), "hit");
  assert.equal(classifyPulseTiming(-100, policy), "partial");
  assert.equal(classifyPulseTiming(-200, policy), "miss");
});
