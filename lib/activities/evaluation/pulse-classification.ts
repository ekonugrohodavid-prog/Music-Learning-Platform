import type { PulseTimingPolicy } from "./pulse-policy.ts";

export type PulseTimingClassification =
  | "hit"
  | "partial"
  | "miss";

export function classifyPulseTiming(
  deviationMs: number,
  policy: PulseTimingPolicy,
): PulseTimingClassification {
  const deviation = Math.abs(deviationMs);

  if (deviation <= policy.hitWindowMs) {
    return "hit";
  }

  if (deviation <= policy.partialWindowMs) {
    return "partial";
  }

  return "miss";
}
