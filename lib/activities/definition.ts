import type { ActivityType } from "@/types";
import type { ActivityEvaluator } from "./evaluation/contracts.ts";

export interface ActivityDefinition {
  readonly type: ActivityType;
  readonly configurationSchema: unknown;
  readonly responseSchema: unknown;
  readonly evaluator: ActivityEvaluator | undefined;
  readonly renderer: unknown;
}
