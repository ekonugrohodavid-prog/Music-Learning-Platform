import type {
  ActivityAttempt,
  ActivityResponse,
  AttemptState,
  EvaluationResult,
} from "@/types";
import type { Activity } from "@/types/learning";
import type { ActivityDefinitionRegistry } from "../registry";

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

  readonly activityDefinitionRegistry: ActivityDefinitionRegistry;

  readonly submitStartedAttempt: (
  attemptId: string,
  studentId: string,
  activityId: string,
  input: {
    submittedAt: string;
    response: ActivityResponse;
      evaluation: EvaluationResult;
      score: number;
    },
) => Promise<{
  attempt: ActivityAttempt;
  didSubmit: boolean;
}>;
}

export interface ActivitySubmissionService {
  submit(
    input: SubmitActivityInput,
  ): Promise<SubmitActivityResult>;
}


