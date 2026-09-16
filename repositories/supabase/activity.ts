import type { Activity } from "@/types";
import type { ActivityRepository } from "../contracts";
import { PersistenceError } from "@/types/errors";
import { createClient } from "@/lib/supabase/server";

type ActivityRow = {
  id: string;
  competency_id: string;
  type: string;
  title: string;
  instructions: string | null;
  difficulty: number;
  configuration: Activity["configuration"];
  scoring_configuration: Record<string, unknown> | null;
  status: string;
  created_by: string;
  published_by: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ActivityCreateInput = {
  competencyId: string;
  type: Activity["type"];
  title: string;
  instructions?: string | null;
  difficulty: number;
  configuration: Activity["configuration"];
  scoringConfiguration?: Activity["scoringConfiguration"];
  status?: Activity["status"];
  createdBy: string;
  publishedBy?: string | null;
  publishedAt?: string | null;
};

export type ActivityUpdateInput = Partial<
  Omit<ActivityCreateInput, "competencyId" | "createdBy">
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

export class SupabaseActivityRepository
  implements
    ActivityRepository<
      Activity,
      ActivityCreateInput,
      ActivityUpdateInput
    >
{
  async findById(id: string): Promise<Activity | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("activities")
      .select(
        `
          id,
          competency_id,
          type,
          title,
          instructions,
          difficulty,
          configuration,
          scoring_configuration,
          status,
          created_by,
          published_by,
          published_at,
          created_at,
          updated_at
        `,
      )
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw new PersistenceError(
        "Failed to fetch activity.",
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

  async listByCompetency(
  competencyId: string,
): Promise<readonly Activity[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("activities")
    .select(
      `
        id,
        competency_id,
        type,
        title,
        instructions,
        difficulty,
        configuration,
        scoring_configuration,
        status,
        created_by,
        published_by,
        published_at,
        created_at,
        updated_at
      `,
    )
    .eq("competency_id", competencyId)
    .eq("status", "published")
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    throw new PersistenceError(
      "Failed to list activities by competency.",
      {
        details: persistenceDetails(error),
      },
    );
  }

  return (data ?? []).map((row) => this.mapRow(row));
}
  
  async list(): Promise<readonly Activity[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("activities")
      .select(
        `
          id,
          competency_id,
          type,
          title,
          instructions,
          difficulty,
          configuration,
          scoring_configuration,
          status,
          created_by,
          published_by,
          published_at,
          created_at,
          updated_at
        `,
      )
      .eq("status", "published")
      .order("created_at", {
        ascending: true,
      });

    if (error) {
      throw new PersistenceError(
        "Failed to list activities.",
        {
          details: persistenceDetails(error),
        },
      );
    }

    return (data ?? []).map((row) => this.mapRow(row));
  }

  async create(input: ActivityCreateInput): Promise<Activity> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("activities")
      .insert({
        competency_id: input.competencyId,
        type: input.type,
        title: input.title,
        instructions: input.instructions ?? null,
        difficulty: input.difficulty,
        configuration: input.configuration,
        scoring_configuration:
          input.scoringConfiguration ?? null,
        status: input.status ?? "draft",
        created_by: input.createdBy,
        published_by: input.publishedBy ?? null,
        published_at: input.publishedAt ?? null,
      })
      .select(
        `
          id,
          competency_id,
          type,
          title,
          instructions,
          difficulty,
          configuration,
          scoring_configuration,
          status,
          created_by,
          published_by,
          published_at,
          created_at,
          updated_at
        `,
      )
      .single();

    if (error) {
      throw new PersistenceError(
        "Failed to create activity.",
        {
          details: persistenceDetails(error),
        },
      );
    }

    return this.mapRow(data);
  }

  async update(
    id: string,
    input: ActivityUpdateInput,
  ): Promise<Activity> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("activities")
      .update({
        ...(input.type !== undefined && {
          type: input.type,
        }),
        ...(input.title !== undefined && {
          title: input.title,
        }),
        ...(input.instructions !== undefined && {
          instructions: input.instructions,
        }),
        ...(input.difficulty !== undefined && {
          difficulty: input.difficulty,
        }),
        ...(input.configuration !== undefined && {
          configuration: input.configuration,
        }),
        ...(input.scoringConfiguration !== undefined && {
          scoring_configuration: input.scoringConfiguration,
        }),
        ...(input.status !== undefined && {
          status: input.status,
        }),
        ...(input.publishedBy !== undefined && {
          published_by: input.publishedBy,
        }),
        ...(input.publishedAt !== undefined && {
          published_at: input.publishedAt,
        }),
      })
      .eq("id", id)
      .select(
        `
          id,
          competency_id,
          type,
          title,
          instructions,
          difficulty,
          configuration,
          scoring_configuration,
          status,
          created_by,
          published_by,
          published_at,
          created_at,
          updated_at
        `,
      )
      .single();

    if (error) {
      throw new PersistenceError(
        "Failed to update activity.",
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
      .from("activities")
      .delete()
      .eq("id", id);

    if (error) {
      throw new PersistenceError(
        "Failed to delete activity.",
        {
          details: persistenceDetails(error),
        },
      );
    }
  }

  private mapRow(row: ActivityRow): Activity {
    if (
      row.status !== "draft" &&
      row.status !== "published" &&
      row.status !== "archived"
    ) {
      throw new PersistenceError(
        "Activity status is invalid.",
        {
          details: {
            activityId: row.id,
            status: row.status,
          },
        },
      );
    }

    return {
      id: row.id,
      competencyId: row.competency_id,
      type: row.type as Activity["type"],
      title: row.title,
      instructions: row.instructions ?? undefined,
      difficulty: row.difficulty,
      configuration: row.configuration,
      scoringConfiguration:
        row.scoring_configuration ?? undefined,
      status: row.status,
      createdBy: row.created_by,
      publishedBy: row.published_by ?? undefined,
      publishedAt: row.published_at ?? undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
