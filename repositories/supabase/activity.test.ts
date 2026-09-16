import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const source = readFileSync(
  new URL("./activity.ts", import.meta.url),
  "utf8",
);

test("activity repository defines required repository operations", () => {
  assert.match(source, /findById/);
  assert.match(source, /list\(/);
  assert.match(source, /create/);
  assert.match(source, /update/);
  assert.match(source, /delete/);
});

test("activity repository uses activities table", () => {
  assert.match(source, /\.from\("activities"\)/);
});

test("activity repository filters published activities", () => {
  assert.match(source, /\.eq\("status", "published"\)/);
});

test("activity repository orders activities", () => {
  assert.match(source, /\.order\("created_at"/);
});

test("activity repository maps database fields to domain fields", () => {
  assert.match(source, /competencyId: row\.competency_id/);
  assert.match(source, /scoringConfiguration:/);
  assert.match(source, /publishedBy:/);
  assert.match(source, /publishedAt:/);
  assert.match(source, /createdAt: row\.created_at/);
  assert.match(source, /updatedAt: row\.updated_at/);
});

test("activity repository uses PersistenceError", () => {
  assert.match(source, /PersistenceError/);
});

test("activity repository uses server Supabase client", () => {
  assert.match(source, /@\/lib\/supabase\/server/);
});

test("activity repository preserves activity configuration type", () => {
  assert.match(
    source,
    /configuration: Activity\["configuration"\]/,
  );
});
