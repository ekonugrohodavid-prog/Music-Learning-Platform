import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const source = readFileSync(
  new URL("./learning-content.ts", import.meta.url),
  "utf8",
);

test("learning content repository defines required repository operations", () => {
  assert.match(source, /findById/);
  assert.match(source, /list\(/);
  assert.match(source, /listByCompetency/);
  assert.match(source, /create/);
  assert.match(source, /update/);
  assert.match(source, /delete/);
});

test("learning content repository uses learning_contents table", () => {
  assert.match(source, /\.from\("learning_contents"\)/);
});

test("learning content repository filters published content", () => {
  assert.match(source, /\.eq\("status", "published"\)/);
});

test("learning content repository orders content by sequence", () => {
  assert.match(source, /\.order\("sequence"/);
});

test("learning content repository filters content by competency", () => {
  assert.match(source, /\.eq\("competency_id", competencyId\)/);
});

test("learning content repository maps database fields to domain fields", () => {
  assert.match(source, /competencyId: row\.competency_id/);
  assert.match(source, /contentType: row\.content_type/);
  assert.match(source, /createdBy: row\.created_by/);
  assert.match(source, /createdAt: row\.created_at/);
  assert.match(source, /updatedAt: row\.updated_at/);
});

test("learning content repository uses PersistenceError", () => {
  assert.match(source, /PersistenceError/);
});

test("learning content repository uses server Supabase client", () => {
  assert.match(source, /@\/lib\/supabase\/server/);
});
