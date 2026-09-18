import type { ActivityType } from "@/types";

export interface ActivityDefinition {
  readonly type: ActivityType;
  readonly configurationSchema: unknown;
  readonly responseSchema: unknown;
  readonly evaluator: unknown;
  readonly renderer: unknown;
}
