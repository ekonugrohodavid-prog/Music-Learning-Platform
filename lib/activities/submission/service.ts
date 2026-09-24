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
      return {
        attempt,
        state: attempt.completionState,
      };
    }

    const definition =
      this.dependencies.activityDefinitionRegistry.get(
        activity.type,
      );

    if (!definition?.evaluator) {
      throw new Error(
        `No evaluator configured for activity type: ${activity.type}`,
      );
    }

    const evaluation = definition.evaluator.evaluate(
      activity,
      input.response,
    );

    const submittedAt = new Date().toISOString();

    const submission =
      await this.dependencies.submitStartedAttempt(
        input.attemptId,
        input.studentId,
        input.activityId,
        {
          submittedAt,
          response: input.response,
          evaluation,
          score: evaluation.score.percentage,
        },
      );

    return {
      attempt: submission.attempt,
      state: submission.attempt.completionState,
    };
  }
}
