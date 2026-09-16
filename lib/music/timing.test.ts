import assert from "node:assert/strict";
import test from "node:test";

import {
  beatToMilliseconds,
  eventToTiming,
  millisecondsToBeat,
} from "./timing.ts";

const tempo = {
  bpm: 60,
};

test("converts beat position to milliseconds", () => {
  assert.equal(
    beatToMilliseconds(1, tempo),
    1000,
  );

  assert.equal(
    beatToMilliseconds(2.5, tempo),
    2500,
  );
});

test("converts milliseconds to beat position", () => {
  assert.equal(
    millisecondsToBeat(1000, tempo),
    1,
  );

  assert.equal(
    millisecondsToBeat(2500, tempo),
    2.5,
  );
});

test("converts event position and duration to timing", () => {
  const event = {
    id: "event-1",
    beatPosition: 1,
    duration: 2,
    type: "note" as const,
  };

  assert.deepEqual(
    eventToTiming(event, tempo),
    {
      event,
      startMs: 1000,
      endMs: 3000,
    },
  );
});

test("supports fractional beat timing", () => {
  assert.equal(
    beatToMilliseconds(0.5, tempo),
    500,
  );

  assert.equal(
    millisecondsToBeat(500, tempo),
    0.5,
  );
});

test("timing changes according to BPM", () => {
  const fastTempo = {
    bpm: 120,
  };

  assert.equal(
    beatToMilliseconds(1, fastTempo),
    500,
  );

  assert.equal(
    beatToMilliseconds(4, fastTempo),
    2000,
  );
});
