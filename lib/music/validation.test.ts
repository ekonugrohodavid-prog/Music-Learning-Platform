import assert from "node:assert/strict";
import test from "node:test";

import {
  validateRhythm,
} from "./validation.ts";

const meter = {
  beatsPerMeasure: 4,
  beatUnit: 4,
};

test("validates a valid rhythm pattern", () => {
  const result = validateRhythm(
    [
      {
        id: "event-1",
        beatPosition: 0,
        duration: 1,
        type: "note",
      },
      {
        id: "event-2",
        beatPosition: 1,
        duration: 1,
        type: "rest",
      },
      {
        id: "event-3",
        beatPosition: 2,
        duration: 1,
        type: "note",
      },
      {
        id: "event-4",
        beatPosition: 3,
        duration: 1,
        type: "note",
      },
    ],
    {
      meter,
      requireCompleteMeasure: true,
    },
  );

  assert.equal(result.valid, true);
  assert.deepEqual(result.issues, []);
});

test("rejects an invalid event position", () => {
  const result = validateRhythm(
    [
      {
        id: "event-1",
        beatPosition: -1,
        duration: 1,
        type: "note",
      },
    ],
    { meter },
  );

  assert.equal(result.valid, false);
  assert.ok(
    result.issues.some(
      (issue) =>
        issue.code === "RHYTHM_INVALID_POSITION",
    ),
  );
});

test("rejects an invalid event duration", () => {
  const result = validateRhythm(
    [
      {
        id: "event-1",
        beatPosition: 0,
        duration: 0,
        type: "note",
      },
    ],
    { meter },
  );

  assert.equal(result.valid, false);
  assert.ok(
    result.issues.some(
      (issue) =>
        issue.code === "RHYTHM_INVALID_DURATION",
    ),
  );
});

test("rejects event crossing measure boundary", () => {
  const result = validateRhythm(
    [
      {
        id: "event-1",
        beatPosition: 3.5,
        duration: 1,
        type: "note",
      },
    ],
    { meter },
  );

  assert.equal(result.valid, false);
  assert.ok(
    result.issues.some(
      (issue) =>
        issue.code === "RHYTHM_MEASURE_OVERFLOW",
    ),
  );
});

test("rejects incomplete measure when required", () => {
  const result = validateRhythm(
    [
      {
        id: "event-1",
        beatPosition: 0,
        duration: 1,
        type: "note",
      },
      {
        id: "event-2",
        beatPosition: 1,
        duration: 1,
        type: "note",
      },
    ],
    {
      meter,
      requireCompleteMeasure: true,
    },
  );

  assert.equal(result.valid, false);
  assert.ok(
    result.issues.some(
      (issue) =>
        issue.code === "RHYTHM_DURATION_OVERFLOW",
    ),
  );
});

test("enforces activity event constraints", () => {
  const result = validateRhythm(
    [
      {
        id: "event-1",
        beatPosition: 0,
        duration: 0.75,
        type: "note",
      },
    ],
    {
      meter,
      constraints: {
        minEvents: 2,
        allowedDurations: [0.25, 0.5, 1],
        allowedEventTypes: ["note"],
      },
    },
  );

  assert.equal(result.valid, false);

  assert.ok(
    result.issues.some(
      (issue) =>
        issue.code === "RHYTHM_MIN_EVENTS",
    ),
  );

  assert.ok(
    result.issues.some(
      (issue) =>
        issue.code === "RHYTHM_INVALID_DURATION",
    ),
  );
});
