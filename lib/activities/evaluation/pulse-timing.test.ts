import test from "node:test";
import assert from "node:assert/strict";
import type { PulseActivityConfiguration } from "@/types";
import { getExpectedPulseTimes } from "./pulse-timing.ts";

test("ACT-006 derives expected pulse times from BPM and beat count", () => {
  const configuration: PulseActivityConfiguration = {
    type: "pulse",
    tempoBpm: 60,
    beatCount: 4,
  };

  assert.deepEqual(
    getExpectedPulseTimes(configuration),
    [0, 1000, 2000, 3000],
  );
});

test("ACT-006 derives faster pulse intervals from higher BPM", () => {
  const configuration: PulseActivityConfiguration = {
    type: "pulse",
    tempoBpm: 120,
    beatCount: 4,
  };

  assert.deepEqual(
    getExpectedPulseTimes(configuration),
    [0, 500, 1000, 1500],
  );
});
