import test from "node:test";
import assert from "node:assert/strict";
import { matchPulseTaps } from "./pulse-matching.ts";

test("ACT-006 matches each expected beat to at most one tap", () => {
  const result = matchPulseTaps(
    [0, 1000, 2000],
    [20, 1010, 1020],
  );

  assert.deepEqual(result.matches, [
    {
      expectedMs: 0,
      actualMs: 20,
      deviationMs: 20,
    },
    {
      expectedMs: 1000,
      actualMs: 1010,
      deviationMs: 10,
    },
    {
      expectedMs: 2000,
      actualMs: 1020,
      deviationMs: 980,
    },
  ]);

  assert.deepEqual(result.unmatchedExpectedMs, []);
  assert.deepEqual(result.unmatchedActualMs, []);
});

test("ACT-006 reports missing expected beats", () => {
  const result = matchPulseTaps(
    [0, 1000, 2000],
    [10, 1010],
  );

  assert.deepEqual(
    result.unmatchedExpectedMs,
    [2000],
  );
});

test("ACT-006 reports extra taps", () => {
  const result = matchPulseTaps(
    [0, 1000],
    [10, 1010, 2020],
  );

  assert.deepEqual(
    result.unmatchedActualMs,
    [2020],
  );
});

test("ACT-006 matches each actual tap at most once", () => {
  const result = matchPulseTaps(
    [1000, 1100],
    [1050],
  );

  assert.equal(result.matches.length, 1);
  assert.deepEqual(result.unmatchedExpectedMs, [1100]);
  assert.deepEqual(result.unmatchedActualMs, []);
});
