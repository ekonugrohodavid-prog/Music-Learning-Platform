import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  CompetencyId,
  MasteryRecord,
  UserId,
} from "@/types";
import type { MasteryRepository } from "@/repositories/contracts";
import {
  ApplicationError,
  PersistenceError,
} from "@/types/errors";

type MasteryRow = {
  id: string;
  student_id: string;
  competency_id: string;
  mastery_score: number;
  mastery_level: number;
  evidence_count: number;
  last_evaluated_at: string | null;
  created_at: string;
  updated_at: string;
};

type MasteryCreateInput = Omit<
  MasteryRecord,
  "id" | "createdAt" | "updatedAt"
>;

type MasteryUpdateInput = Partial<
  Pick<
    MasteryRecord,
    | "masteryScore"
    | "masteryLevel"
    | "evidenceCount"
    | "lastEvaluatedAt"
  >
>;

function mapRow(row: MasteryRow): MasteryRecord {
  return {
    id: row.id,
    studentId: row.student_id,
    competencyId: row.competency_id,
    masteryScore: row.mastery_score,
    masteryLevel: row.mastery_level,
    evidenceCount: row.evidence_count,
    ...(row.last_evaluated_at
      ? { lastEvaluatedAt: row.last_evaluated_at }
      : {}),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toCreateRow(input: MasteryCreateInput) {
  return {
    student_id: input.studentId,
    competency_id: input.competencyId,
    mastery_score: input.masteryScore,
    mastery_level: input.masteryLevel,
    evidence_count: input.evidenceCount,
    last_evaluated_at: input.lastEvaluatedAt ?? null,
  };
}

function toUpdateRow(input: MasteryUpdateInput) {
  return {
    ...(input.masteryScore !== undefined
      ? { mastery_score: input.masteryScore }
      : {}),
    ...(input.masteryLevel !== undefined
      ? { mastery_level: input.masteryLevel }
      : {}),
    ...(input.evidenceCount !== undefined
      ? { evidence_count: input.evidenceCount }
      : {}),
    ...(input.lastEvaluatedAt !== undefined
      ? { last_evaluated_at: input.lastEvaluatedAt }
      : {}),
    updated_at: new Date().toISOString(),
  };
}

function persistenceError(error: unknown): PersistenceError {
  if (error instanceof PersistenceError) {
    return error;
  }

  if (error instanceof ApplicationError) {
    return new PersistenceError(
      error.message,
      { cause: error },
    );
  }

  return new PersistenceError(
    error instanceof Error ? error.message : "Persistence operation failed",
    { cause: error },
  );
}

export class SupabaseMasteryRepository<
  TMastery extends MasteryRecord = MasteryRecord,
  TCreateInput extends MasteryCreateInput = MasteryCreateInput,
  TUpdateInput extends MasteryUpdateInput = MasteryUpdateInput,
> implements MasteryRepository<
    TMastery,
    TCreateInput,
    TUpdateInput
  > {
  constructor(
    private readonly supabase: SupabaseClient,
  ) {}

  async findById(id: string): Promise<TMastery | null> {
    const { data, error } = await this.supabase
      .from("mastery_records")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw persistenceError(error);
    }

    return data ? (mapRow(data as MasteryRow) as TMastery) : null;
  }

  async list(): Promise<readonly TMastery[]> {
    const { data, error } = await this.supabase
      .from("mastery_records")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) {
      throw persistenceError(error);
    }

    return (data ?? []).map(
      (row) => mapRow(row as MasteryRow) as TMastery,
    );
  }

  async create(input: TCreateInput): Promise<TMastery> {
    const { data, error } = await this.supabase
      .from("mastery_records")
      .insert(toCreateRow(input))
      .select("*")
      .single();

    if (error) {
      throw persistenceError(error);
    }

    return mapRow(data as MasteryRow) as TMastery;
  }

  async update(
    id: string,
    input: TUpdateInput,
  ): Promise<TMastery> {
    const { data, error } = await this.supabase
      .from("mastery_records")
      .update(toUpdateRow(input))
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      throw persistenceError(error);
    }

    return mapRow(data as MasteryRow) as TMastery;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from("mastery_records")
      .delete()
      .eq("id", id);

    if (error) {
      throw persistenceError(error);
    }
  }

  async findByStudentAndCompetency(
    studentId: UserId,
    competencyId: CompetencyId,
  ): Promise<TMastery | null> {
    const { data, error } = await this.supabase
      .from("mastery_records")
      .select("*")
      .eq("student_id", studentId)
      .eq("competency_id", competencyId)
      .maybeSingle();

    if (error) {
      throw persistenceError(error);
    }

    return data ? (mapRow(data as MasteryRow) as TMastery) : null;
  }
}
