import test from "node:test";
import assert from "node:assert/strict";

import {
  activityConfigurationSchema,
  activityInputSchema,
} from "./activity.ts";

test("activityInputSchema accepts valid activity input", () => {
  const result = activityInputSchema.safeParse({
    competencyId: "competency-1",
    type: "pulse",
    title: "Pulse Exercise",
    difficulty: 3,
    status: "draft",
    createdBy: "user-1",
  });

  assert.equal(result.success, true);
});

test("activityInputSchema rejects invalid difficulty", () => {
  const result = activityInputSchema.safeParse({
    competencyId: "competency-1",
    type: "pulse",
    title: "Pulse Exercise",
    difficulty: 6,
    status: "draft",
    createdBy: "user-1",
  });

  assert.equal(result.success, false);
});

test("activityConfigurationSchema accepts pulse configuration", () => {
  const result = activityConfigurationSchema.safeParse({
    type: "pulse",
    tempoBpm: 100,
    beatCount: 8,
  });

  assert.equal(result.success, true);
});

test("activityConfigurationSchema accepts tempo configuration", () => {
  const result = activityConfigurationSchema.safeParse({
    type: "tempo",
    targetBpm: 120,
  });

  assert.equal(result.success, true);
});

test("activityConfigurationSchema accepts meter configuration", () => {
  const result = activityConfigurationSchema.safeParse({
    type: "meter",
    meter: {
     beatsPerMeasure: 4,
     beatUnit: 4,
  },
});

  assert.equal(result.success, true);
});

test("activityConfigurationSchema accepts rhythm configuration", () => {
const result = activityConfigurationSchema.safeParse({
  type: "rhythm_composer",
  tempo: {
    bpm: 100,
  },
  meter: {
    beatsPerMeasure: 4,
    beatUnit: 4,
  },
  eventConstraints: {},
});

  assert.equal(result.success, true);
});

test("activityConfigurationSchema rejects unknown activity configuration type", () => {
  const result = activityConfigurationSchema.safeParse({
    type: "unknown",
  });

  assert.equal(result.success, false);
});
