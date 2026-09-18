import type { Activity, ActivityResponse } from "@/types";

export type ActivityRuntimeStatus =
  | "ready"
  | "running"
  | "captured";

export interface ActivityRuntimeState {
  readonly activity: Activity;
  readonly status: ActivityRuntimeStatus;
  readonly startedAt: number;
  readonly response: ActivityResponse | null;
}

export interface ActivityRuntime {
  getState(): ActivityRuntimeState;
  start(): ActivityRuntimeState;
  captureResponse(response: ActivityResponse): ActivityRuntimeState;
  getSubmissionResponse(): ActivityResponse | null;
}
