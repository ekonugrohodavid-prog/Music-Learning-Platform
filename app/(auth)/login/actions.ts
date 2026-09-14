"use server";

import { redirect } from "next/navigation";
import { signInWithPassword } from "@/lib/auth/service";

export async function login(formData: FormData): Promise<void> {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    redirect("/login?error=invalid_input");
  }

  const { error } = await signInWithPassword(email, password);

  if (error) {
    redirect("/login?error=invalid_credentials");
  }

  redirect("/student");
}
