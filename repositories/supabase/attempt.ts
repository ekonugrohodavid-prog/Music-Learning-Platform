import type {
  ActivityAttempt,
  ActivityResponse,
  EvaluationResult,
  AttemptState,
} from "@/types";
import type { AttemptRepository } from "../contracts";
import { PersistenceError } from "@/types/errors";
import { createClient } from "@/lib/supabase/server";

type ActivityAttemptRow = {
  id: string;
  activity_id: string;
  student_id: string;
  started_at: string;
  submitted_at: string | null;
  response: ActivityResponse | null;
  evaluation: EvaluationResult | null;
  score: number | null;
  completion_state: string;
  attempt_number: number;
  created_at: string;
  updated_at: string;
};

export type AttemptCreateInput = {
  activityId: string;
  studentId: string;
  startedAt?: string;
  submittedAt?: string | null;
  response?: ActivityResponse | null;
  evaluation?: EvaluationResult | null;
  score?: number | null;
  completionState?: AttemptState;
  attemptNumber?: number;
};

export type AttemptUpdateInput = Partial<
  Omit<AttemptCreateInput, "activityId" | "studentId">
>;

function persistenceDetails(error: {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
}) {
  return {
    databaseCode: error.code,
    databaseMessage: error.message,
    databaseDetails: error.details,
    databaseHint: error.hint,
  };
}

export class SupabaseAttemptRepository
  implements
    AttemptRepository<
      ActivityAttempt,
      AttemptCreateInput,
      AttemptUpdateInput
    >
{
  async findById(
    id: string,
  ): Promise<ActivityAttempt | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("activity_attempts")
      .select(
        `
          id,
          activity_id,
          student_id,
          started_at,
          submitted_at,
          response,
          evaluation,
          score,
          completion_state,
          attempt_number,
          created_at,
          updated_at
        `,
      )
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw new PersistenceError(
        "Failed to fetch activity attempt.",
        {
          details: persistenceDetails(error),
        },
      );
    }

    if (!data) {
      return null;
    }

    return this.mapRow(data);
  }

  async list(): Promise<
    readonly ActivityAttempt[]
  > {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("activity_attempts")
      .select(
        `
          id,
          activity_id,
          student_id,
          started_at,
          submitted_at,
          response,
          evaluation,
          score,
          completion_state,
          attempt_number,
          created_at,
          updated_at
        `,
      )
      .order("created_at", {
        ascending: true,
      });

    if (error) {
      throw new PersistenceError(
        "Failed to list activity attempts.",
        {
          details: persistenceDetails(error),
        },
      );
    }

    return (data ?? []).map((row) =>
      this.mapRow(row),
    );
  }

  async create(
    input: AttemptCreateInput,
  ): Promise<ActivityAttempt> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("activity_attempts")
      .insert({
        activity_id: input.activityId,
        student_id: input.studentId,
        ...(input.startedAt !== undefined && {
          started_at: input.startedAt,
        }),
        ...(input.submittedAt !== undefined && {
          submitted_at: input.submittedAt,
        }),
        ...(input.response !== undefined && {
          response: input.response,
        }),
        ...(input.evaluation !== undefined && {
          evaluation: input.evaluation,
        }),
        ...(input.score !== undefined && {
          score: input.score,
        }),
        ...(input.completionState !== undefined && {
          completion_state: input.completionState,
        }),
        ...(input.attemptNumber !== undefined && {
          attempt_number: input.attemptNumber,
        }),
      })
      .select(
        `
          id,
          activity_id,
          student_id,
          started_at,
          submitted_at,
          response,
          evaluation,
          score,
          completion_state,
          attempt_number,
          created_at,
          updated_at
        `,
      )
      .single();

    if (error) {
      throw new PersistenceError(
        "Failed to create activity attempt.",
        {
          details: persistenceDetails(error),
        },
      );
    }

    return this.mapRow(data);
  }

  async update(
    id: string,
    input: AttemptUpdateInput,
  ): Promise<ActivityAttempt> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("activity_attempts")
      .update({
        ...(input.startedAt !== undefined && {
          started_at: input.startedAt,
        }),
        ...(input.submittedAt !== undefined && {
          submitted_at: input.submittedAt,
        }),
        ...(input.response !== undefined && {
          response: input.response,
        }),
        ...(input.evaluation !== undefined && {
          evaluation: input.evaluation,
        }),
        ...(input.score !== undefined && {
          score: input.score,
        }),
        ...(input.completionState !== undefined && {
          completion_state:
            input.completionState,
        }),
        ...(input.attemptNumber !== undefined && {
          attempt_number: input.attemptNumber,
        }),
      })
      .eq("id", id)
      .select(
        `
          id,
          activity_id,
          student_id,
          started_at,
          submitted_at,
          response,
          evaluation,
          score,
          completion_state,
          attempt_number,
          created_at,
          updated_at
        `,
      )
      .single();

    if (error) {
      throw new PersistenceError(
        "Failed to update activity attempt.",
        {
          details: persistenceDetails(error),
        },
      );
    }

    return this.mapRow(data);
  }

    async submitStartedAttempt(
    attemptId: string,
    studentId: string,
    activityId: string,
    input: {
      submittedAt: string;
      response: ActivityResponse;
    },
  ): Promise<{
    attempt: ActivityAttempt;
    didSubmit: boolean;
  }> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("activity_attempts")
      .update({
        submitted_at: input.submittedAt,
        response: input.response,
        completion_state: "submitted",
      })
      .eq("id", attemptId)
      .eq("student_id", studentId)
      .eq("activity_id", activityId)
      .eq("completion_state", "started")
      .select(
        `
          id,
          activity_id,
          student_id,
          started_at,
          submitted_at,
          response,
          evaluation,
          score,
          completion_state,
          attempt_number,
          created_at,
          updated_at
        `,
      )
      .maybeSingle();

    if (error) {
      throw new PersistenceError(
        "Failed to submit activity attempt.",
        {
          details: persistenceDetails(error),
        },
      );
    }

    if (data) {
      return {
        attempt: this.mapRow(data),
        didSubmit: true,
      };
    }

    const existingAttempt = await this.findById(attemptId);

    if (!existingAttempt) {
      throw new PersistenceError(
        "Activity attempt was not found after submission.",
        {
          details: {
            attemptId,
            studentId,
            activityId,
          },
        },
      );
    }

    if (
      existingAttempt.studentId !== studentId ||
      existingAttempt.activityId !== activityId
    ) {
      throw new PersistenceError(
        "Activity attempt does not belong to the submission context.",
        {
          details: {
            attemptId,
            studentId,
            activityId,
          },
        },
      );
    }

    return {
      attempt: existingAttempt,
      didSubmit: false,
    };
  }

  async delete(id: string): Promise<void> {
    const supabase = await createClient();

    const { error } = await supabase
      .from("activity_attempts")
      .delete()
      .eq("id", id);

    if (error) {
      throw new PersistenceError(
        "Failed to delete activity attempt.",
        {
          details: persistenceDetails(error),
        },
      );
    }
  }

  private mapRow(
    row: ActivityAttemptRow,
  ): ActivityAttempt {
    if (
      row.completion_state !== "started" &&
      row.completion_state !== "submitted" &&
      row.completion_state !== "evaluated" &&
      row.completion_state !== "completed"
    ) {
      throw new PersistenceError(
        "Activity attempt completion state is invalid.",
        {
          details: {
            attemptId: row.id,
            completionState:
              row.completion_state,
          },
        },
      );
    }

    return {
      id: row.id,
      activityId: row.activity_id,
      studentId: row.student_id,
      startedAt: row.started_at,
      submittedAt:
        row.submitted_at ?? undefined,
      response: row.response ?? undefined,
      evaluation:
        row.evaluation ?? undefined,
      score:
        row.score === null
          ? undefined
          : {
              value: row.score,
              max: 100,
              percentage: row.score,
            },
      completionState:
        row.completion_state as AttemptState,
      attemptNumber: row.attempt_number,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
