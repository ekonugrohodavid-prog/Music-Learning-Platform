import assert from "node:assert/strict";
import test from "node:test";

import {
  createMetronome,
} from "./metronome.ts";

test("creates metronome with BPM", () => {
  const metronome = createMetronome(60, 4);

  assert.equal(
    metronome.getBpm(),
    60,
  );
});

test("generates beat ticks according to BPM", () => {
  const metronome = createMetronome(60, 4);

  assert.deepEqual(
    metronome.start(1000),
    [
      { beat: 1, timeMs: 1000 },
      { beat: 2, timeMs: 2000 },
      { beat: 3, timeMs: 3000 },
      { beat: 4, timeMs: 4000 },
    ],
  );
});

test("supports faster BPM", () => {
  const metronome = createMetronome(120, 4);

  assert.deepEqual(
    metronome.start(),
    [
      { beat: 1, timeMs: 0 },
      { beat: 2, timeMs: 500 },
      { beat: 3, timeMs: 1000 },
      { beat: 4, timeMs: 1500 },
    ],
  );
});

test("supports fractional starting time", () => {
  const metronome = createMetronome(60, 2);

  assert.deepEqual(
    metronome.start(250.5),
    [
      { beat: 1, timeMs: 250.5 },
      { beat: 2, timeMs: 1250.5 },
    ],
  );
});

test("tracks running state", () => {
  const metronome = createMetronome(60, 4);

  assert.equal(
    metronome.isRunning(),
    false,
  );

  metronome.start();

  assert.equal(
    metronome.isRunning(),
    true,
  );

  metronome.stop();

  assert.equal(
    metronome.isRunning(),
    false,
  );
});
