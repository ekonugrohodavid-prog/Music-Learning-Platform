import type {
  Activity,
  ActivityResponse,
  EvaluationResult,
} from "@/types";
import type { PulseScoringPolicy } from "./pulse-scoring-policy.ts";
import type { PulseTimingPolicy } from "./pulse-policy.ts";

export interface ActivityEvaluator {
  evaluate(
    activity: Activity,
    response: ActivityResponse,
  ): EvaluationResult;
}

export interface PulseEvaluatorDependencies {
  readonly timingPolicy: PulseTimingPolicy;
  readonly scoringPolicy?: PulseScoringPolicy;
}
