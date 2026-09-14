import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("profile service defines current profile resolution", async () => {
  const source = await readFile(
    new URL("./profile.ts", import.meta.url),
    "utf8",
  );

  assert.match(source, /export class ProfileService/);
  assert.match(source, /getCurrentProfile/);
  assert.match(source, /profileRepository\.findById/);
  assert.match(source, /NotFoundError/);
});

test("profile service does not resolve role from client input", async () => {
  const source = await readFile(
    new URL("./profile.ts", import.meta.url),
    "utf8",
  );

  assert.doesNotMatch(
    source,
    /getCurrentProfile\s*\([^)]*role/,
  );

  assert.doesNotMatch(
    source,
    /getCurrentProfile\s*\([^)]*ProfileCreateInput/,
  );
});