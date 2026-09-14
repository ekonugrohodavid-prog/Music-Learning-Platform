import type { UserProfile, RoleCode } from "@/types";
import type { ProfileRepository } from "../contracts";
import { PersistenceError } from "@/types/errors";
import { createClient } from "@/lib/supabase/server";

type ProfileRow = {
  id: string;
  display_name: string;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  roles: {
    code: string;
  }[] | null;
};

export type ProfileCreateInput = {
  id: string;
  roleId: string;
  displayName: string;
  avatarUrl?: string | null;
  isActive?: boolean;
};

export type ProfileUpdateInput = Partial<
  Omit<ProfileCreateInput, "id">
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

export class SupabaseProfileRepository
  implements
    ProfileRepository<
      UserProfile,
      ProfileCreateInput,
      ProfileUpdateInput
    >
{
  async findById(id: string): Promise<UserProfile | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("profiles")
      .select(
        `
          id,
          display_name,
          avatar_url,
          is_active,
          created_at,
          updated_at,
          roles (
            code
          )
        `,
      )
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw new PersistenceError(
        "Failed to fetch profile.",
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

  async list(): Promise<readonly UserProfile[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("profiles")
      .select(
        `
          id,
          display_name,
          avatar_url,
          is_active,
          created_at,
          updated_at,
          roles (
            code
          )
        `,
      );

    if (error) {
      throw new PersistenceError(
        "Failed to list profiles.",
        {
  details: persistenceDetails(error),
},
      );
    }

    return (data ?? []).map((row) => this.mapRow(row));
  }

  async create(input: ProfileCreateInput): Promise<UserProfile> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("profiles")
      .insert({
        id: input.id,
        role_id: input.roleId,
        display_name: input.displayName,
        avatar_url: input.avatarUrl ?? null,
        is_active: input.isActive ?? true,
      })
      .select(
        `
          id,
          display_name,
          avatar_url,
          is_active,
          created_at,
          updated_at,
          roles (
            code
          )
        `,
      )
      .single();

    if (error) {
      throw new PersistenceError(
        "Failed to create profile.",
        {
  details: persistenceDetails(error),
},
      );
    }

    return this.mapRow(data);
  }

  async update(
    id: string,
    input: ProfileUpdateInput,
  ): Promise<UserProfile> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("profiles")
      .update({
        ...(input.roleId !== undefined && {
          role_id: input.roleId,
        }),
        ...(input.displayName !== undefined && {
          display_name: input.displayName,
        }),
        ...(input.avatarUrl !== undefined && {
          avatar_url: input.avatarUrl,
        }),
        ...(input.isActive !== undefined && {
          is_active: input.isActive,
        }),
      })
      .eq("id", id)
      .select(
        `
          id,
          display_name,
          avatar_url,
          is_active,
          created_at,
          updated_at,
          roles (
            code
          )
        `,
      )
      .single();

    if (error) {
      throw new PersistenceError(
        "Failed to update profile.",
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
      .from("profiles")
      .delete()
      .eq("id", id);

    if (error) {
      throw new PersistenceError(
        "Failed to delete profile.",
        {
  details: persistenceDetails(error),
},
      );
    }
  }

    private mapRow(row: ProfileRow): UserProfile {
    const role = row.roles?.[0]?.code;

    if (!role) {
      throw new PersistenceError(
        "Profile role is missing.",
        {
          details: {
            profileId: row.id,
          },
        },
      );
    }

    return {
      id: row.id,
      role: role as RoleCode,
      displayName: row.display_name,
      avatarUrl: row.avatar_url ?? undefined,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
