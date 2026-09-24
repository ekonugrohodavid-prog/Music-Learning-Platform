import type { PulseTimingPolicy } from "./pulse-policy.ts";

export const PROVISIONAL_PULSE_TIMING_POLICY: PulseTimingPolicy = {
  hitWindowMs: 50,
  partialWindowMs: 150,
};
