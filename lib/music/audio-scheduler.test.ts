import assert from "node:assert/strict";
import test from "node:test";

import {
  createAudioScheduler,
} from "./audio-scheduler.ts";

const scheduler = createAudioScheduler();

test("schedules an event using BPM", () => {
  const event = {
    id: "event-1",
    beatPosition: 1,
    duration: 2,
    type: "note" as const,
  };

  const result = scheduler.schedule(
    event,
    10,
    60,
  );

  assert.deepEqual(result, {
    event,
    startTime: 11,
    endTime: 13,
  });
});

test("schedules events relative to the same start time", () => {
  const events = [
    {
      id: "event-1",
      beatPosition: 0,
      duration: 1,
      type: "note" as const,
    },
    {
      id: "event-2",
      beatPosition: 1,
      duration: 0.5,
      type: "rest" as const,
    },
  ];

  const result = scheduler.scheduleAll(
    events,
    5,
    120,
  );

  assert.deepEqual(result, [
    {
      event: events[0],
      startTime: 5,
      endTime: 5.5,
    },
    {
      event: events[1],
      startTime: 5.5,
      endTime: 5.75,
    },
  ]);
});

test("supports fractional beat positions", () => {
  const event = {
    id: "event-1",
    beatPosition: 0.5,
    duration: 0.25,
    type: "note" as const,
  };

  const result = scheduler.schedule(
    event,
    2,
    60,
  );

  assert.equal(result.startTime, 2.5);
  assert.equal(result.endTime, 2.75);
});

test("clear resets scheduler state", () => {
  const event = {
    id: "event-1",
    beatPosition: 0,
    duration: 1,
    type: "note" as const,
  };

  scheduler.schedule(event, 0, 60);
  scheduler.clear();

  // A subsequent schedule starts from a clean state.
  const result = scheduler.schedule(event, 0, 60);

  assert.equal(result.startTime, 0);
  assert.equal(result.endTime, 1);
});
