import test from "node:test";
import assert from "node:assert/strict";
import { DefaultPulseScoringPolicy } from "./pulse-scoring-policy.ts";

const scoringPolicy = new DefaultPulseScoringPolicy();

test("returns 100 for all hits", () => {
  const result = scoringPolicy.calculate(
    {
      hitCount: 4,
      partialCount: 0,
      missCount: 0,
      totalExpectedBeats: 4,
    },
    "exact_match",
  );

  assert.deepEqual(result, {
    value: 100,
    max: 100,
    percentage: 100,
  });
});

test("returns 87.5 for three hits and one partial", () => {
  const result = scoringPolicy.calculate(
    {
      hitCount: 3,
      partialCount: 1,
      missCount: 0,
      totalExpectedBeats: 4,
    },
    "partial_match",
  );

  assert.deepEqual(result, {
    value: 87.5,
    max: 100,
    percentage: 87.5,
  });
});

test("returns 75 for two hits and two partials", () => {
  const result = scoringPolicy.calculate(
    {
      hitCount: 2,
      partialCount: 2,
      missCount: 0,
      totalExpectedBeats: 4,
    },
    "partial_match",
  );

  assert.deepEqual(result, {
    value: 75,
    max: 100,
    percentage: 75,
  });
});

test("returns 62.5 for two hits, one partial, and one miss", () => {
  const result = scoringPolicy.calculate(
    {
      hitCount: 2,
      partialCount: 1,
      missCount: 1,
      totalExpectedBeats: 4,
    },
    "partial_match",
  );

  assert.deepEqual(result, {
    value: 62.5,
    max: 100,
    percentage: 62.5,
  });
});

test("returns 0 for all misses", () => {
  const result = scoringPolicy.calculate(
    {
      hitCount: 0,
      partialCount: 0,
      missCount: 4,
      totalExpectedBeats: 4,
    },
    "incorrect",
  );

  assert.deepEqual(result, {
    value: 0,
    max: 100,
    percentage: 0,
  });
});

test("returns 0 when there are no expected beats", () => {
  const result = scoringPolicy.calculate(
    {
      hitCount: 0,
      partialCount: 0,
      missCount: 0,
      totalExpectedBeats: 0,
    },
    "incorrect",
  );

  assert.deepEqual(result, {
    value: 0,
    max: 100,
    percentage: 0,
  });
});
