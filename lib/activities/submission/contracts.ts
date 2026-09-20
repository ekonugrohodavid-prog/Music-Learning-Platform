import type {
  ActivityAttempt,
  ActivityResponse,
  AttemptState,
} from "@/types";
import type { Activity } from "@/types/learning";

export interface SubmitActivityInput {
  readonly activityId: string;
  readonly attemptId: string;
  readonly studentId: string;
  readonly response: ActivityResponse;
}

export interface SubmitActivityResult {
  readonly attempt: ActivityAttempt;
  readonly state: AttemptState;
}

export interface ActivitySubmissionDependencies {
  readonly getActivity: (
    activityId: string,
  ) => Promise<Activity | null>;

  readonly getAttempt: (
    attemptId: string,
  ) => Promise<ActivityAttempt | null>;

  readonly saveAttempt: (
    attemptId: string,
    input: {
      submittedAt: string;
      response: ActivityResponse;
      completionState: "submitted";
    },
  ) => Promise<ActivityAttempt>;
}

export interface ActivitySubmissionService {
  submit(
    input: SubmitActivityInput,
  ): Promise<SubmitActivityResult>;
}
