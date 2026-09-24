import type { Activity, ActivityResponse, EvaluationResult } from "@/types";
import type { ActivityEvaluator, PulseEvaluatorDependencies } from "./contracts.ts";
import { getExpectedPulseTimes } from "./pulse-timing.ts";
import { matchPulseTaps } from "./pulse-matching.ts";
import { classifyPulseTiming } from "./pulse-classification.ts";
import { DefaultPulseScoringPolicy } from "./pulse-scoring-policy.ts";

export class PulseEvaluator implements ActivityEvaluator {
  private readonly dependencies: Required<PulseEvaluatorDependencies>;

  constructor(dependencies: PulseEvaluatorDependencies) {
    this.dependencies = {
      ...dependencies,
      scoringPolicy:
        dependencies.scoringPolicy ?? new DefaultPulseScoringPolicy(),
    };
  }

  evaluate(
    activity: Activity,
    response: ActivityResponse,
  ): EvaluationResult {
    if (activity.type !== "pulse") {
      throw new Error("PulseEvaluator requires a pulse activity");
    }

    if (response.type !== "pulse") {
      throw new Error("PulseEvaluator requires a pulse response");
    }

    if (activity.configuration.type !== "pulse") {
      throw new Error("PulseEvaluator requires pulse configuration");
    }

    const expectedMs = getExpectedPulseTimes(activity.configuration);
    const matchResult = matchPulseTaps(expectedMs, response.tapsMs);

    const classifications = matchResult.matches.map((match) =>
      classifyPulseTiming(
        match.deviationMs,
        this.dependencies.timingPolicy,
      ),
    );

    const hitCount = classifications.filter(
      (classification) => classification === "hit",
    ).length;

    const partialCount = classifications.filter(
      (classification) => classification === "partial",
    ).length;

    const missCount =
      classifications.filter((classification) => classification === "miss")
        .length +
      matchResult.unmatchedExpectedMs.length;

    const classification =
      hitCount === expectedMs.length && missCount === 0
        ? "exact_match"
        : hitCount > 0 || partialCount > 0
          ? "partial_match"
          : "incorrect";

    const score = this.dependencies.scoringPolicy.calculate(
      {
        hitCount,
        partialCount,
        missCount,
        totalExpectedBeats: expectedMs.length,
      },
      classification,
    );

    return {
      classification,
      score,
      dimensions: [
        {
          key: "hit",
          score: hitCount,
          maxScore: expectedMs.length,
        },
        {
          key: "partial",
          score: partialCount,
          maxScore: expectedMs.length,
        },
        {
          key: "miss",
          score: missCount,
          maxScore: expectedMs.length,
        },
      ],
    };
  }
}
