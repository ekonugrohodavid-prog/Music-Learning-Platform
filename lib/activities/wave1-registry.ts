import type { ActivityType } from "@/types";
import type { ActivityDefinition } from "./definition";
import type { ActivityDefinitionRegistry } from "./registry";
import type { ActivityEvaluator } from "./evaluation/contracts.ts";
import { PulseEvaluator } from "./evaluation/pulse-evaluator.ts";
import { PROVISIONAL_PULSE_TIMING_POLICY } from "./evaluation/provisional-pulse-policy.ts";

export interface Wave1ActivityDefinitionDependencies {
  readonly pulseEvaluator?: ActivityEvaluator;
}

export class Wave1ActivityDefinitionRegistry
  implements ActivityDefinitionRegistry
{
  private readonly definitions: readonly ActivityDefinition[];

  constructor(dependencies: Wave1ActivityDefinitionDependencies = {}) {
    const pulseEvaluator =
      dependencies.pulseEvaluator ??
      new PulseEvaluator({
        timingPolicy: PROVISIONAL_PULSE_TIMING_POLICY,
      });

    this.definitions = [
      {
        type: "pulse",
        configurationSchema: undefined,
        responseSchema: undefined,
        evaluator: pulseEvaluator,
        renderer: undefined,
      },
    ];
  }

  get(type: ActivityType): ActivityDefinition | undefined {
    return this.definitions.find(
      (definition) => definition.type === type,
    );
  }

  has(type: ActivityType): boolean {
    return this.get(type) !== undefined;
  }

  list(): readonly ActivityDefinition[] {
    return this.definitions;
  }
}

export function createWave1ActivityDefinitionRegistry(
  dependencies: Wave1ActivityDefinitionDependencies = {},
): ActivityDefinitionRegistry {
  return new Wave1ActivityDefinitionRegistry(dependencies);
}
