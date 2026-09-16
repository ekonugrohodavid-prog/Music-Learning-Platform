import assert from "node:assert/strict";
import test from "node:test";

import {
  beatToMeasure,
  eventToMeasure,
  measureToBeatRange,
} from "./measures.ts";

const meter = {
  beatsPerMeasure: 4,
  beatUnit: 4,
};

test("beatToMeasure maps beat 0 to measure 1", () => {
  assert.equal(
    beatToMeasure(0, meter),
    1,
  );
});

test("beatToMeasure maps beat 5 to measure 2", () => {
  assert.equal(
    beatToMeasure(5, meter),
    2,
  );
});

test("measureToBeatRange returns measure beat range", () => {
  assert.deepEqual(
    measureToBeatRange(2, meter),
    {
      startBeat: 4,
      endBeat: 8,
    },
  );
});

test("eventToMeasure returns measure and beat offset", () => {
  const result = eventToMeasure(
    {
      id: "event-1",
      beatPosition: 5,
      duration: 1,
      type: "note",
    },
    meter,
  );

  assert.deepEqual(result, {
    measure: 2,
    beatOffset: 1,
  });
});

test("fractional beat positions are supported", () => {
  assert.equal(
    beatToMeasure(3.5, meter),
    1,
  );

  assert.equal(
    beatToMeasure(4.5, meter),
    2,
  );
});
