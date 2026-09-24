import assert from "node:assert/strict";
import test from "node:test";
import { PulseEvaluator } from "./pulse-evaluator.ts";
import type { Activity, ActivityResponse } from "@/types";

const evaluator = new PulseEvaluator({
  timingPolicy: {
    hitWindowMs: 50,
    partialWindowMs: 150,
  },
});

const activity = {
  id: "activity-pulse-001",
  type: "pulse",
  configuration: {
    type: "pulse",
    tempoBpm: 60,
    beatCount: 4,
  },
} as Activity;

test("ACT-006 evaluates exact pulse taps as exact_match", () => {
  const response: ActivityResponse = {
    type: "pulse",
    tapsMs: [0, 1000, 2000, 3000],
  };

  const result = evaluator.evaluate(activity, response);

  assert.equal(result.classification, "exact_match");
  assert.equal(result.score.percentage, 100);
  assert.equal(result.dimensions?.[0]?.score, 4);
  assert.equal(result.dimensions?.[1]?.score, 0);
  assert.equal(result.dimensions?.[2]?.score, 0);
});

test("ACT-006 evaluates partially accurate pulse taps as partial_match", () => {
  const response: ActivityResponse = {
    type: "pulse",
    tapsMs: [0, 1100, 2000, 3100],
  };

  const result = evaluator.evaluate(activity, response);

  assert.equal(result.classification, "partial_match");
  assert.equal(result.dimensions?.[0]?.score, 2);
  assert.equal(result.dimensions?.[1]?.score, 2);
  assert.equal(result.score.percentage, 75);
});

test("ACT-006 evaluates completely incorrect pulse taps as incorrect", () => {
  const response: ActivityResponse = {
    type: "pulse",
    tapsMs: [500, 1500, 2500, 3500],
  };

  const result = evaluator.evaluate(activity, response);

  assert.equal(result.classification, "incorrect");
  assert.equal(result.score.percentage, 0);
});

test("ACT-006 rejects a non-pulse activity", () => {
  const tempoActivity = {
    ...activity,
    type: "tempo",
  } as Activity;

  const response: ActivityResponse = {
    type: "pulse",
    tapsMs: [0, 1000, 2000, 3000],
  };

  assert.throws(
    () => evaluator.evaluate(tempoActivity, response),
    /PulseEvaluator requires a pulse activity/,
  );
});

test("ACT-006 rejects a non-pulse response", () => {
  const response = {
    type: "tempo",
  } as ActivityResponse;

  assert.throws(
    () => evaluator.evaluate(activity, response),
    /PulseEvaluator requires a pulse response/,
  );
});

test("ACT-006 handles empty pulse response as incorrect", () => {
  const response: ActivityResponse = {
    type: "pulse",
    tapsMs: [],
  };

  const result = evaluator.evaluate(activity, response);

  assert.equal(result.classification, "incorrect");
  assert.equal(result.score.percentage, 0);
  assert.equal(result.dimensions?.[2]?.score, 4);
  assert.equal(result.score.percentage, 0);
});


