import type {
  ActivityAttempt,
  AttemptState,
} from "@/types";

import type {
  ActivitySubmissionDependencies,
  ActivitySubmissionService as ActivitySubmissionServiceContract,
  SubmitActivityInput,
  SubmitActivityResult,
} from "./contracts";

export class ActivitySubmissionService
  implements ActivitySubmissionServiceContract
{
  private readonly dependencies: ActivitySubmissionDependencies;

  constructor(dependencies: ActivitySubmissionDependencies) {
    this.dependencies = dependencies;
  }

  async submit(
    input: SubmitActivityInput,
  ): Promise<SubmitActivityResult> {
    const activity = await this.dependencies.getActivity(
      input.activityId,
    );

    if (!activity) {
      throw new Error("Activity not found");
    }

    const attempt = await this.dependencies.getAttempt(
      input.attemptId,
    );

    if (!attempt) {
      throw new Error("Attempt not found");
    }

    if (attempt.studentId !== input.studentId) {
      throw new Error("Attempt does not belong to student");
    }

    if (attempt.activityId !== input.activityId) {
      throw new Error("Attempt does not belong to activity");
    }

    if (attempt.completionState !== "started") {
      throw new Error("Attempt has already been submitted");
    }

    const submittedAt = new Date().toISOString();

    const savedAttempt =
      await this.dependencies.saveAttempt(
        input.attemptId,
        {
          submittedAt,
          response: input.response,
          completionState: "submitted",
        },
      );

    return {
      attempt: savedAttempt,
      state: "submitted" as AttemptState,
    };
  }
}
