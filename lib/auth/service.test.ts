import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("auth service defines required auth operations", async () => {
  const source = await readFile(
    new URL("./service.ts", import.meta.url),
    "utf8",
  );

  assert.match(source, /export async function signInWithPassword/);
  assert.match(source, /export async function signOut/);
  assert.match(source, /export async function getCurrentSession/);
  assert.match(source, /export async function refreshSession/);

  assert.match(source, /supabase\.auth\.signInWithPassword/);
  assert.match(source, /supabase\.auth\.signOut/);
  assert.match(source, /supabase\.auth\.getSession/);
  assert.match(source, /supabase\.auth\.refreshSession/);
});
