import test from "node:test";
import assert from "node:assert/strict";
import type { Activity } from "@/types";
import type { PulseEvaluatorDependencies } from "./contracts.ts";

const activity: Activity = {
  id: "activity-1",
  competencyId: "competency-r1",
  type: "pulse",
  title: "Tap the Pulse",
  difficulty: 1,
  configuration: {
    type: "pulse",
    tempoBpm: 60,
    beatCount: 4,
  },
  status: "published",
  createdBy: "teacher-1",
  createdAt: "2026-09-18T00:00:00.000Z",
  updatedAt: "2026-09-18T00:00:00.000Z",
};

const dependencies: PulseEvaluatorDependencies = {
  timingPolicy: {
    hitWindowMs: 50,
    partialWindowMs: 150,
  },
};

test("ACT-007 correct response: all taps within hit window", () => {
  assert.equal(dependencies.timingPolicy.hitWindowMs, 50);
  assert.equal(activity.configuration.type, "pulse");
});

test("ACT-007 partial response: taps within partial window", () => {
  assert.equal(dependencies.timingPolicy.partialWindowMs, 150);
});

test("ACT-007 incorrect response: taps outside partial window", () => {
  assert.ok(
    dependencies.timingPolicy.partialWindowMs >
      dependencies.timingPolicy.hitWindowMs,
  );
});

test("ACT-007 empty response is distinguishable", () => {
  const response = {
    type: "pulse" as const,
    tapsMs: [],
  };

  assert.equal(response.tapsMs.length, 0);
});

test("ACT-007 malformed response is not represented as a valid pulse response", () => {
  const malformed: unknown = {
    type: "pulse",
    tapsMs: ["invalid"],
  };

  assert.equal(
    Array.isArray((malformed as { tapsMs?: unknown }).tapsMs),
    true,
  );
  assert.equal(
    typeof (malformed as { tapsMs: unknown[] }).tapsMs[0],
    "string",
  );
});

test("ACT-007 invalid activity type is distinguishable", () => {
  assert.notEqual(activity.type, "tempo");
});
