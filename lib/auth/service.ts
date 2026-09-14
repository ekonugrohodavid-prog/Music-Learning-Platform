import { createClient } from "../supabase/server.ts";

export async function signInWithPassword(email: string, password: string) {
  const supabase = await createClient();

  return supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function signOut() {
  const supabase = await createClient();

  return supabase.auth.signOut();
}

export async function getCurrentSession() {
  const supabase = await createClient();

  return supabase.auth.getSession();
}

export async function refreshSession() {
  const supabase = await createClient();

  return supabase.auth.refreshSession();
}
