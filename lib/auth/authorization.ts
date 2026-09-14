import type { SupabaseClient } from "@supabase/supabase-js";
import { AuthorizationError } from "@/types/errors";
import { createClient } from "@/lib/supabase/server";
import type { RoleCode, UserId } from "@/types";

export interface AuthContext {
  userId: UserId;
  role: RoleCode;
}

export async function resolveAuthContext(
  supabase: SupabaseClient,
  userId: UserId,
): Promise<AuthContext> {
  const { data: profile, error } = await supabase
    .from("profiles")
    .select(
      `
        id,
        is_active,
        roles (
          code
        )
      `,
    )
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw new AuthorizationError("Unable to resolve user role.");
  }

  if (!profile || !profile.is_active) {
    throw new AuthorizationError("User authorization is not valid.");
  }

  const role = profile.roles?.[0]?.code;

  if (!role) {
    throw new AuthorizationError("User authorization is not valid.");
  }

  return {
    userId,
    role: role as RoleCode,
  };
}

export async function getAuthContext(): Promise<AuthContext> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new AuthorizationError("Authentication required.");
  }

  return resolveAuthContext(supabase, user.id);
}

export async function requireAuth(): Promise<AuthContext> {
  return getAuthContext();
}

async function requireRole(
  expectedRole: RoleCode,
): Promise<AuthContext> {
  const context = await getAuthContext();

  if (context.role !== expectedRole) {
    throw new AuthorizationError("Insufficient permissions.");
  }

  return context;
}

export async function requireStudent(): Promise<AuthContext> {
  return requireRole("student");
}

export async function requireTeacher(): Promise<AuthContext> {
  return requireRole("teacher");
}

export async function requireAdmin(): Promise<AuthContext> {
  return requireRole("admin");
}
