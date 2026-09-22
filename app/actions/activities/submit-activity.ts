"use server";

import { requireStudent } from "@/lib/auth/authorization";
import {
  ActivitySubmissionService,
} from "@/lib/activities/submission/service";
import type { SubmitActivityInput, SubmitActivityResult } from "@/lib/activities/submission/action-contracts";
import { createActivityDetailService } from "@/lib/activities/detail/container";
import { SupabaseAttemptRepository } from "@/repositories/supabase/attempt";
import { activityResponseSchema } from "@/schemas/activity";

export async function submitActivity(
  input: SubmitActivityInput,
): Promise<SubmitActivityResult> {
  try {
    const parsedInput = activityResponseSchema.safeParse(input.response);

if (!parsedInput.success) {
  return {
    success: false,
    code: "INVALID_INPUT",
    message: "Invalid activity response.",
  };
}
    const authContext = await requireStudent();

    const activityService = createActivityDetailService();
    const attemptRepository = new SupabaseAttemptRepository();

    const service = new ActivitySubmissionService({
      getActivity: (activityId) =>
        activityService.getById(activityId),

      getAttempt: (attemptId) =>
        attemptRepository.findById(attemptId),

      submitStartedAttempt: (
  attemptId,
  studentId,
  activityId,
  submissionInput,
) =>
  attemptRepository.submitStartedAttempt(
    attemptId,
    studentId,
    activityId,
    submissionInput,
  ),
    });

    const result = await service.submit({
      activityId: input.activityId,
      attemptId: input.attemptId,
      studentId: authContext.userId,
      response: parsedInput.data,
    });

    return {
  success: true,
  attemptId: result.attempt.id,
  state: "submitted",
};
    } catch (error) {
    if (error instanceof Error) {
      switch (error.message) {
        case "Activity not found":
          return {
            success: false,
            code: "ACTIVITY_NOT_FOUND",
            message: "Activity not found.",
          };

        case "Attempt not found":
          return {
            success: false,
            code: "ATTEMPT_NOT_FOUND",
            message: "Attempt not found.",
          };

        case "Attempt does not belong to student":
          return {
            success: false,
            code: "UNAUTHORIZED",
            message: "You are not authorized to submit this attempt.",
          };

        case "Attempt does not belong to activity":
          return {
            success: false,
            code: "SUBMISSION_REJECTED",
            message: "Attempt does not belong to this activity.",
          };

        case "Attempt has already been submitted":
          return {
            success: false,
            code: "SUBMISSION_REJECTED",
            message: "Attempt has already been submitted.",
          };

        default:
          return {
            success: false,
            code: "SUBMISSION_REJECTED",
            message: "Unable to submit activity.",
          };
      }
    }

    return {
      success: false,
      code: "SUBMISSION_REJECTED",
      message: "Unable to submit activity.",
    };
  }
}
