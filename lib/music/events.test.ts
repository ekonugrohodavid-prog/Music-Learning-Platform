import assert from "node:assert/strict";
import test from "node:test";

import {
  createEvent,
  deleteEvent,
  moveEvent,
  resizeEvent,
  sortEvents,
} from "./events.ts";

const event = {
  id: "event-1",
  beatPosition: 0,
  duration: 1,
  type: "note" as const,
};

test("createEvent creates an event", () => {
  const result = createEvent(event);

  assert.deepEqual(result, event);
});

test("moveEvent changes beat position", () => {
  const result = moveEvent(event, 2);

  assert.equal(result.beatPosition, 2);
  assert.equal(result.duration, event.duration);
});

test("resizeEvent changes duration", () => {
  const result = resizeEvent(event, 0.5);

  assert.equal(result.duration, 0.5);
  assert.equal(result.beatPosition, event.beatPosition);
});

test("deleteEvent removes event by id", () => {
  const events = [
    event,
    {
      ...event,
      id: "event-2",
      beatPosition: 1,
    },
  ];

  const result = deleteEvent(events, "event-1");

  assert.deepEqual(result.map((item) => item.id), ["event-2"]);
});

test("sortEvents sorts events by beat position", () => {
  const events = [
    { ...event, id: "event-2", beatPosition: 2 },
    { ...event, id: "event-1", beatPosition: 0 },
    { ...event, id: "event-3", beatPosition: 1 },
  ];

  const result = sortEvents(events);

  assert.deepEqual(
    result.map((item) => item.id),
    ["event-1", "event-3", "event-2"],
  );
});
