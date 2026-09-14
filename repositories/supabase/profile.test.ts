import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("profile repository defines the required repository operations", async () => {
  const source = await readFile(
    new URL("./profile.ts", import.meta.url),
    "utf8",
  );

  assert.match(
    source,
    /export class SupabaseProfileRepository/,
  );

  assert.match(source, /async findById/);
  assert.match(source, /async list/);
  assert.match(source, /async create/);
  assert.match(source, /async update/);
  assert.match(source, /async delete/);

  assert.match(source, /\.from\("profiles"\)/);
  assert.match(source, /roles/);
  assert.match(source, /PersistenceError/);
});

test("profile repository resolves role from the database relation", async () => {
  const source = await readFile(
    new URL("./profile.ts", import.meta.url),
    "utf8",
  );

  assert.match(source, /roles\?\.\[0\]\?\.code/);
  assert.match(source, /role:\s*role as RoleCode/);
});

test("profile repository does not accept role directly in profile creation input", async () => {
  const source = await readFile(
    new URL("./profile.ts", import.meta.url),
    "utf8",
  );

  assert.match(source, /roleId: string/);
  assert.doesNotMatch(
    source,
    /ProfileCreateInput[\s\S]*?role:\s*RoleCode/,
  );
});