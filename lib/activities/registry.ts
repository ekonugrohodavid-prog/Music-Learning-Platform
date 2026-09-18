import type { ActivityType } from "@/types";
import type { ActivityDefinition } from "./definition";

export interface ActivityDefinitionRegistry {
  get(type: ActivityType): ActivityDefinition | undefined;

  has(type: ActivityType): boolean;

  list(): readonly ActivityDefinition[];
}
