import type { Meter, MusicEvent } from "@/types/music";

export interface BeatRange {
  startBeat: number;
  endBeat: number;
}

export interface EventMeasurePosition {
  measure: number;
  beatOffset: number;
}

export function beatToMeasure(
  beatPosition: number,
  meter: Meter,
): number {
  return Math.floor(
    beatPosition / meter.beatsPerMeasure,
  ) + 1;
}

export function measureToBeatRange(
  measure: number,
  meter: Meter,
): BeatRange {
  const startBeat =
    (measure - 1) * meter.beatsPerMeasure;

  return {
    startBeat,
    endBeat: startBeat + meter.beatsPerMeasure,
  };
}

export function eventToMeasure(
  event: MusicEvent,
  meter: Meter,
): EventMeasurePosition {
  const measure = beatToMeasure(
    event.beatPosition,
    meter,
  );

  const range = measureToBeatRange(measure, meter);

  return {
    measure,
    beatOffset: event.beatPosition - range.startBeat,
  };
}
