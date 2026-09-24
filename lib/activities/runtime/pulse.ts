import type {
  Activity,
  PulseActivityConfiguration,
} from "@/types";
import type {
  Metronome,
  MetronomeTick,
} from "../../music/metronome.ts";
import type {
  AudioScheduler,
} from "../../music/audio-scheduler.ts";
import {
  createMetronome,
} from "../../music/metronome.ts";
import {
  createAudioScheduler,
} from "../../music/audio-scheduler.ts";

export interface PulseRuntime {
  start(): readonly MetronomeTick[];
  tap(timestampMs?: number): void;
  stop(): readonly number[];
  getTaps(): readonly number[];
}

export function createPulseRuntime(
  activity: Activity,
  now: () => number = () => performance.now(),
): PulseRuntime {
  if (activity.type !== "pulse") {
    throw new Error(
      "Pulse runtime requires an R1 pulse activity.",
    );
  }

  const configuration =
    activity.configuration as PulseActivityConfiguration;

  const metronome: Metronome = createMetronome(
    configuration.tempoBpm,
    configuration.beatCount,
  );

  const scheduler: AudioScheduler =
    createAudioScheduler();

  let running = false;
  let startTimeMs: number | null = null;
  const taps: number[] = [];

  function start(): readonly MetronomeTick[] {
    scheduler.clear();
    taps.length = 0;
    startTimeMs = now();
    running = true;

    return metronome.start(0);
  }

  function tap(timestampMs = now()): void {
    if (!running || startTimeMs === null) {
      return;
    }

    taps.push(timestampMs - startTimeMs);
  }

  function stop(): readonly number[] {
    metronome.stop();
    scheduler.clear();
    running = false;
    startTimeMs = null;

    return [...taps];
  }

  function getTaps(): readonly number[] {
    return [...taps];
  }

  return {
    start,
    tap,
    stop,
    getTaps,
  };
}
