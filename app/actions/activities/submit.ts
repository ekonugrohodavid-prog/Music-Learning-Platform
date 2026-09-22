import type { ActivityResponse } from "@/types";

export interface SubmitActivityInput {
  readonly activityId: string;
  readonly attemptId: string;
  readonly response: ActivityResponse;
}

export interface SubmitActivitySuccess {
  readonly success: true;
  readonly attemptId: string;
  readonly state: "submitted";
}

export interface SubmitActivityFailure {
  readonly success: false;
  readonly code:
    | "UNAUTHENTICATED"
    | "UNAUTHORIZED"
    | "INVALID_INPUT"
    | "ACTIVITY_NOT_FOUND"
    | "ATTEMPT_NOT_FOUND"
    | "SUBMISSION_REJECTED";
  readonly message: string;
}

export type SubmitActivityResult =
  | SubmitActivitySuccess
  | SubmitActivityFailure;
