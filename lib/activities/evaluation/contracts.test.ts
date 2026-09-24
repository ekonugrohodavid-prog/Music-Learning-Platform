import test from "node:test";
import assert from "node:assert/strict";
import type { Activity } from "@/types";
import type { ActivityEvaluator } from "./contracts.ts";

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

test("ACT-006 evaluator contract accepts a pulse activity and response", () => {
  const evaluator: ActivityEvaluator = {
    evaluate: () => ({
      classification: "exact_match",
      score: {
        value: 100,
        max: 100,
        percentage: 100,
      },
    }),
  };

  const result = evaluator.evaluate(activity, {
    type: "pulse",
    tapsMs: [0, 1000, 2000, 3000],
  });

  assert.equal(result.classification, "exact_match");
  assert.equal(result.score.percentage, 100);
});
