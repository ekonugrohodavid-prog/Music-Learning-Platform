import test from "node:test";
import assert from "node:assert/strict";

import {
  tempoSchema,
  meterSchema,
  musicEventSchema,
  rhythmPatternSchema,
  musicCompositionSchema,
} from "./music.ts";

test("tempoSchema accepts valid tempo", () => {
  const result = tempoSchema.safeParse({
    bpm: 100,
    marking: "Moderato",
  });

  assert.equal(result.success, true);
});

test("tempoSchema rejects invalid BPM", () => {
  const result = tempoSchema.safeParse({
    bpm: 0,
  });

  assert.equal(result.success, false);
});

test("meterSchema accepts valid meter", () => {
  const result = meterSchema.safeParse({
    beatsPerMeasure: 4,
    beatUnit: 4,
  });

  assert.equal(result.success, true);
});

test("meterSchema rejects invalid beatsPerMeasure", () => {
  const result = meterSchema.safeParse({
    beatsPerMeasure: 0,
    beatUnit: 4,
  });

  assert.equal(result.success, false);
});

test("musicEventSchema accepts valid note event", () => {
  const result = musicEventSchema.safeParse({
    id: "event-1",
    beatPosition: 0,
    duration: 1,
    type: "note",
  });

  assert.equal(result.success, true);
});

test("musicEventSchema accepts valid rest event", () => {
  const result = musicEventSchema.safeParse({
    id: "event-2",
    beatPosition: 1,
    duration: 0.5,
    type: "rest",
  });

  assert.equal(result.success, true);
});

test("musicEventSchema rejects negative beat position", () => {
  const result = musicEventSchema.safeParse({
    id: "event-1",
    beatPosition: -1,
    duration: 1,
    type: "note",
  });

  assert.equal(result.success, false);
});

test("musicEventSchema rejects non-positive duration", () => {
  const result = musicEventSchema.safeParse({
    id: "event-1",
    beatPosition: 0,
    duration: 0,
    type: "note",
  });

  assert.equal(result.success, false);
});

test("rhythmPatternSchema accepts valid rhythm pattern", () => {
  const result = rhythmPatternSchema.safeParse({
    events: [
      {
        id: "event-1",
        beatPosition: 0,
        duration: 1,
        type: "note",
      },
    ],
    tempo: {
      bpm: 100,
    },
    meter: {
      beatsPerMeasure: 4,
      beatUnit: 4,
    },
  });

  assert.equal(result.success, true);
});

test("musicCompositionSchema accepts valid composition", () => {
  const result = musicCompositionSchema.safeParse({
    id: "composition-1",
    studentId: "student-1",
    title: "Rhythm Exercise",
    tempo: {
      bpm: 100,
    },
    meter: {
      beatsPerMeasure: 4,
      beatUnit: 4,
    },
    events: [
      {
        id: "event-1",
        beatPosition: 0,
        duration: 1,
        type: "note",
      },
    ],
    createdAt: "2026-09-14T00:00:00.000Z",
    updatedAt: "2026-09-14T00:00:00.000Z",
  });

  assert.equal(result.success, true);
});

test("musicCompositionSchema rejects invalid composition event", () => {
  const result = musicCompositionSchema.safeParse({
    id: "composition-1",
    title: "Invalid Composition",
    tempo: {
      bpm: 100,
    },
    meter: {
      beatsPerMeasure: 4,
      beatUnit: 4,
    },
    events: [
      {
        id: "event-1",
        beatPosition: -1,
        duration: 1,
        type: "note",
      },
    ],
    createdAt: "2026-09-14T00:00:00.000Z",
    updatedAt: "2026-09-14T00:00:00.000Z",
  });

  assert.equal(result.success, false);
});

test("meterSchema rejects invalid beatUnit", () => {
  const result = meterSchema.safeParse({
    beatsPerMeasure: 4,
    beatUnit: 0,
  });

  assert.equal(result.success, false);
});
