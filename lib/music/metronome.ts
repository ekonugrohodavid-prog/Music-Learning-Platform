export interface MetronomeTick {
  beat: number;
  timeMs: number;
}

export interface Metronome {
  start(startTimeMs?: number): MetronomeTick[];
  stop(): void;
  isRunning(): boolean;
  getBpm(): number;
}

export function createMetronome(
  bpm: number,
  beats: number,
): Metronome {
  let running = false;

  function start(startTimeMs = 0): MetronomeTick[] {
    running = true;

    const beatDurationMs = 60_000 / bpm;

    return Array.from(
      { length: beats },
      (_, index) => ({
        beat: index + 1,
        timeMs:
          startTimeMs + index * beatDurationMs,
      }),
    );
  }

  function stop(): void {
    running = false;
  }

  function isRunning(): boolean {
    return running;
  }

  function getBpm(): number {
    return bpm;
  }

  return {
    start,
    stop,
    isRunning,
    getBpm,
  };
}
