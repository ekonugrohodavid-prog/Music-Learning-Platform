import test from "node:test";
import assert from "node:assert/strict";
import type { Activity } from "@/types";
import { createPulseRuntime } from "./pulse.ts";

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

test("ACT-003 initializes existing metronome engine", () => {
  const runtime = createPulseRuntime(
    activity,
    () => 0,
  );

  const ticks = runtime.start();

  assert.equal(ticks.length, 4);
  assert.equal(ticks[0]?.beat, 1);
  assert.equal(ticks[1]?.timeMs, 1000);
});

test("ACT-003 captures taps only after start", () => {
  let now = 500;

  const runtime = createPulseRuntime(
    activity,
    () => now,
  );

  runtime.tap();

  assert.deepEqual(
    runtime.getTaps(),
    [],
  );

  runtime.start();

  runtime.tap();

  now = 1500;
  runtime.tap();

  assert.deepEqual(
    runtime.getTaps(),
    [500, 1500],
  );
});

test("ACT-003 returns captured taps on stop", () => {
  const runtime = createPulseRuntime(
    activity,
    () => 250,
  );

  runtime.start();
  runtime.tap();

  assert.deepEqual(
    runtime.stop(),
    [250],
  );
});

test("ACT-003 resets captured taps when started again", () => {
  let now = 500;

  const runtime = createPulseRuntime(
    activity,
    () => now,
  );

  runtime.start();
  runtime.tap();

  assert.deepEqual(
    runtime.getTaps(),
    [500],
  );

  runtime.stop();

  now = 1000;

  runtime.start();

  assert.deepEqual(
    runtime.getTaps(),
    [],
  );
});
