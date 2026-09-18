import type { ActivityType } from "@/types";
import type { ActivityDefinition } from "./definition";
import type { ActivityDefinitionRegistry } from "./registry";

const WAVE_1_DEFINITIONS: readonly ActivityDefinition[] = [
  {
    type: "pulse",
    configurationSchema: undefined,
    responseSchema: undefined,
    evaluator: undefined,
    renderer: undefined,
  },
];

export class Wave1ActivityDefinitionRegistry
  implements ActivityDefinitionRegistry
{
  get(type: ActivityType): ActivityDefinition | undefined {
    return WAVE_1_DEFINITIONS.find(
      (definition) => definition.type === type,
    );
  }

  has(type: ActivityType): boolean {
    return this.get(type) !== undefined;
  }

  list(): readonly ActivityDefinition[] {
    return WAVE_1_DEFINITIONS;
  }
}

export function createWave1ActivityDefinitionRegistry(): ActivityDefinitionRegistry {
  return new Wave1ActivityDefinitionRegistry();
}
