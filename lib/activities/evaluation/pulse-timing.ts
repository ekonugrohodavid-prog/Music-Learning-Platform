import type { PulseActivityConfiguration } from "@/types";
import { beatToMilliseconds } from "../../music/timing.ts";

export function getExpectedPulseTimes(
  configuration: PulseActivityConfiguration,
): readonly number[] {
  const tempo = {
    bpm: configuration.tempoBpm,
  };

  return Array.from(
    { length: configuration.beatCount },
    (_, index) => beatToMilliseconds(index, tempo),
  );
}
