"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function updatePassword(formData: FormData): Promise<void> {
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  if (
    typeof password !== "string" ||
    typeof confirmPassword !== "string"
  ) {
    redirect("/reset-password?error=invalid_input");
  }

  if (password.length < 8) {
    redirect("/reset-password?error=password_too_short");
  }

  if (password !== confirmPassword) {
    redirect("/reset-password?error=password_mismatch");
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?error=recovery_session_expired");
  }

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    redirect("/reset-password?error=update_failed");
  }

  await supabase.auth.signOut({
    scope: "global",
  });

  redirect("/login?success=password_updated");
}
