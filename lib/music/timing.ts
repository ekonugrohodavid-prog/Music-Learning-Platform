import type { MusicEvent, Tempo } from "@/types/music";

export interface TimedEvent {
  event: MusicEvent;
  startMs: number;
  endMs: number;
}

export function beatToMilliseconds(
  beatPosition: number,
  tempo: Tempo,
): number {
  return (beatPosition * 60_000) / tempo.bpm;
}

export function millisecondsToBeat(
  milliseconds: number,
  tempo: Tempo,
): number {
  return (milliseconds * tempo.bpm) / 60_000;
}

export function eventToTiming(
  event: MusicEvent,
  tempo: Tempo,
): TimedEvent {
  const startMs = beatToMilliseconds(
    event.beatPosition,
    tempo,
  );

  const endMs = beatToMilliseconds(
    event.beatPosition + event.duration,
    tempo,
  );

  return {
    event,
    startMs,
    endMs,
  };
}
