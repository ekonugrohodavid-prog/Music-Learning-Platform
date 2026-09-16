import type { LearningContent } from "@/types";
import type { LearningContentRepository } from "../contracts";
import { PersistenceError } from "@/types/errors";
import { createClient } from "@/lib/supabase/server";

type LearningContentRow = {
  id: string;
  competency_id: string;
  title: string;
  content_type: string;
  body: string | null;
  configuration: Record<string, unknown> | null;
  sequence: number;
  status: string;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type LearningContentCreateInput = {
  competencyId: string;
  title: string;
  contentType: LearningContent["contentType"];
  body?: string | null;
  configuration?: Record<string, unknown> | null;
  sequence: number;
  status?: LearningContent["status"];
  createdBy: string;
};

export type LearningContentUpdateInput = Partial<
  Omit<LearningContentCreateInput, "competencyId" | "createdBy">
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

export class SupabaseLearningContentRepository
  implements
    LearningContentRepository<
      LearningContent,
      LearningContentCreateInput,
      LearningContentUpdateInput
    >
{
  async findById(
    id: string,
  ): Promise<LearningContent | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("learning_contents")
      .select(
        `
          id,
          competency_id,
          title,
          content_type,
          body,
          configuration,
          sequence,
          status,
          created_by,
          created_at,
          updated_at
        `,
      )
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw new PersistenceError(
        "Failed to fetch learning content.",
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

  async list(): Promise<readonly LearningContent[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("learning_contents")
      .select(
        `
          id,
          competency_id,
          title,
          content_type,
          body,
          configuration,
          sequence,
          status,
          created_by,
          created_at,
          updated_at
        `,
      )
      .eq("status", "published")
      .order("sequence", {
        ascending: true,
      });

    if (error) {
      throw new PersistenceError(
        "Failed to list learning content.",
        {
          details: persistenceDetails(error),
        },
      );
    }

    return (data ?? []).map((row) => this.mapRow(row));
  }

  async listByCompetency(
    competencyId: string,
  ): Promise<readonly LearningContent[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("learning_contents")
      .select(
        `
          id,
          competency_id,
          title,
          content_type,
          body,
          configuration,
          sequence,
          status,
          created_by,
          created_at,
          updated_at
        `,
      )
      .eq("competency_id", competencyId)
      .eq("status", "published")
      .order("sequence", {
        ascending: true,
      });

    if (error) {
      throw new PersistenceError(
        "Failed to list learning content by competency.",
        {
          details: persistenceDetails(error),
        },
      );
    }

    return (data ?? []).map((row) => this.mapRow(row));
  }

  async create(
    input: LearningContentCreateInput,
  ): Promise<LearningContent> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("learning_contents")
      .insert({
        competency_id: input.competencyId,
        title: input.title,
        content_type: input.contentType,
        body: input.body ?? null,
        configuration: input.configuration ?? null,
        sequence: input.sequence,
        status: input.status ?? "draft",
        created_by: input.createdBy,
      })
      .select(
        `
          id,
          competency_id,
          title,
          content_type,
          body,
          configuration,
          sequence,
          status,
          created_by,
          created_at,
          updated_at
        `,
      )
      .single();

    if (error) {
      throw new PersistenceError(
        "Failed to create learning content.",
        {
          details: persistenceDetails(error),
        },
      );
    }

    return this.mapRow(data);
  }

  async update(
    id: string,
    input: LearningContentUpdateInput,
  ): Promise<LearningContent> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("learning_contents")
      .update({
        ...(input.title !== undefined && {
          title: input.title,
        }),
        ...(input.contentType !== undefined && {
          content_type: input.contentType,
        }),
        ...(input.body !== undefined && {
          body: input.body,
        }),
        ...(input.configuration !== undefined && {
          configuration: input.configuration,
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
          competency_id,
          title,
          content_type,
          body,
          configuration,
          sequence,
          status,
          created_by,
          created_at,
          updated_at
        `,
      )
      .single();

    if (error) {
      throw new PersistenceError(
        "Failed to update learning content.",
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
      .from("learning_contents")
      .delete()
      .eq("id", id);

    if (error) {
      throw new PersistenceError(
        "Failed to delete learning content.",
        {
          details: persistenceDetails(error),
        },
      );
    }
  }

  private mapRow(
    row: LearningContentRow,
  ): LearningContent {
    if (
      row.status !== "draft" &&
      row.status !== "published" &&
      row.status !== "archived"
    ) {
      throw new PersistenceError(
        "Learning content status is invalid.",
        {
          details: {
            learningContentId: row.id,
            status: row.status,
          },
        },
      );
    }

    if (
      row.content_type !== "lesson" &&
      row.content_type !== "video" &&
      row.content_type !== "reading" &&
      row.content_type !== "interactive" &&
      row.content_type !== "reference"
    ) {
      throw new PersistenceError(
        "Learning content type is invalid.",
        {
          details: {
            learningContentId: row.id,
            contentType: row.content_type,
          },
        },
      );
    }

    return {
      id: row.id,
      competencyId: row.competency_id,
      title: row.title,
      contentType: row.content_type,
      body: row.body ?? undefined,
      configuration: row.configuration ?? undefined,
      sequence: row.sequence,
      status: row.status,
      createdBy: row.created_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
