import type { Competency } from "@/types";
import type { CompetencyRepository } from "../contracts";
import { PersistenceError } from "@/types/errors";
import { createClient } from "@/lib/supabase/server";

type CompetencyRow = {
  id: string;
  code: string;
  title: string;
  description: string | null;
  sequence: number;
  status: string;
  created_at: string;
  updated_at: string;
};

export type CompetencyCreateInput = {
  code: string;
  title: string;
  description?: string | null;
  sequence: number;
  status?: "active" | "inactive";
};

export type CompetencyUpdateInput = Partial<
  Omit<CompetencyCreateInput, "code">
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

export class SupabaseCompetencyRepository
  implements
    CompetencyRepository<
      Competency,
      CompetencyCreateInput,
      CompetencyUpdateInput
    >
{
  async findById(id: string): Promise<Competency | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("competencies")
      .select(
        `
          id,
          code,
          title,
          description,
          sequence,
          status,
          created_at,
          updated_at
        `,
      )
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw new PersistenceError(
        "Failed to fetch competency.",
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

async findByCode(code: string): Promise<Competency | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("competencies")
    .select(
      `
        id,
        code,
        title,
        description,
        sequence,
        status,
        created_at,
        updated_at
      `,
    )
    .eq("code", code)
    .eq("status", "active")
    .maybeSingle();

  if (error) {
    throw new PersistenceError(
      "Failed to fetch competency by code.",
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

  async list(): Promise<readonly Competency[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("competencies")
      .select(
        `
          id,
          code,
          title,
          description,
          sequence,
          status,
          created_at,
          updated_at
        `,
      )
      .eq("status", "active")
      .order("sequence", {
        ascending: true,
      });

    if (error) {
      throw new PersistenceError(
        "Failed to list competencies.",
        {
          details: persistenceDetails(error),
        },
      );
    }

    return (data ?? []).map((row) => this.mapRow(row));
  }

  async create(
    input: CompetencyCreateInput,
  ): Promise<Competency> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("competencies")
      .insert({
        code: input.code,
        title: input.title,
        description: input.description ?? null,
        sequence: input.sequence,
        status: input.status ?? "active",
      })
      .select(
        `
          id,
          code,
          title,
          description,
          sequence,
          status,
          created_at,
          updated_at
        `,
      )
      .single();

    if (error) {
      throw new PersistenceError(
        "Failed to create competency.",
        {
          details: persistenceDetails(error),
        },
      );
    }

    return this.mapRow(data);
  }

  async update(
    id: string,
    input: CompetencyUpdateInput,
  ): Promise<Competency> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("competencies")
      .update({
        ...(input.title !== undefined && {
          title: input.title,
        }),
        ...(input.description !== undefined && {
          description: input.description,
        }),
        ...(input.sequence !== undefined && {
          sequence: input.sequence,
        }),
        ...(input.status !== undefined && {
          status: input.status,
        }),
      })
      .eq("id", id)
      .select(
        `
          id,
          code,
          title,
          description,
          sequence,
          status,
          created_at,
          updated_at
        `,
      )
      .single();

    if (error) {
      throw new PersistenceError(
        "Failed to update competency.",
        {
          details: persistenceDetails(error),
        },
      );
    }

    return this.mapRow(data);
  }

  async delete(id: string): Promise<void> {
    const supabase = await createClient();

    const { error } = await supabase
      .from("competencies")
      .delete()
      .eq("id", id);

    if (error) {
      throw new PersistenceError(
        "Failed to delete competency.",
        {
          details: persistenceDetails(error),
        },
      );
    }
  }

  private mapRow(row: CompetencyRow): Competency {
    if (
      row.status !== "active" &&
      row.status !== "inactive"
    ) {
      throw new PersistenceError(
        "Competency status is invalid.",
        {
          details: {
            competencyId: row.id,
            status: row.status,
          },
        },
      );
    }

    return {
      id: row.id,
      code: row.code,
      title: row.title,
      description: row.description ?? undefined,
      sequence: row.sequence,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
