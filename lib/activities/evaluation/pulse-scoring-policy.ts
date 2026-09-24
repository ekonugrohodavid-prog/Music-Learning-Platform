import type { EvaluationClassification, Score } from "@/types";

export interface PulseScoringInput {
  readonly hitCount: number;
  readonly partialCount: number;
  readonly missCount: number;
  readonly totalExpectedBeats: number;
}

export interface PulseScoringPolicy {
  calculate(
    input: PulseScoringInput,
    classification: EvaluationClassification,
  ): Score;
}

export class DefaultPulseScoringPolicy implements PulseScoringPolicy {
  calculate(
    input: PulseScoringInput,
    _classification: EvaluationClassification,
  ): Score {
    if (
      input.totalExpectedBeats <= 0 ||
      input.hitCount < 0 ||
      input.partialCount < 0 ||
      input.missCount < 0
    ) {
      return {
        value: 0,
        max: 100,
        percentage: 0,
      };
    }

    const weightedPoints =
      input.hitCount + input.partialCount * 0.5;

    const percentage = Math.min(
      100,
      Math.max(
        0,
        (weightedPoints / input.totalExpectedBeats) * 100,
      ),
    );

    return {
      value: percentage,
      max: 100,
      percentage,
    };
  }
}
