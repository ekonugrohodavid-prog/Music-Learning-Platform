"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { sendPasswordRecovery } from "@/lib/auth/service";

export async function forgotPassword(
  formData: FormData,
): Promise<void> {
  const email = formData.get("email");

  if (typeof email !== "string" || !email.trim()) {
    redirect("/forgot-password?error=invalid_input");
  }

  const requestHeaders = await headers();
  const host = requestHeaders.get("host");

  if (!host) {
    redirect("/forgot-password?error=request_failed");
  }

  const protocol =
    process.env.NODE_ENV === "development" ? "http" : "https";

  const redirectTo =
    `${protocol}://${host}/auth/confirm`;

  const { error } = await sendPasswordRecovery(
    email.trim(),
    redirectTo,
  );

if (error) {
  redirect("/forgot-password?error=request_failed");
}

  redirect("/forgot-password?success=recovery_sent");
}
