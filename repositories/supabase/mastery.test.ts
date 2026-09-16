import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { strict as assert } from "node:assert";

const repositoryPath = join(
  process.cwd(),
  "repositories",
  "supabase",
  "mastery.ts",
);

const source = readFileSync(repositoryPath, "utf8");

test("mastery repository defines required repository operations", () => {
  assert.match(source, /class SupabaseMasteryRepository/);
  assert.match(source, /findById\s*\(/);
  assert.match(source, /list\s*\(/);
  assert.match(source, /create\s*\(/);
  assert.match(source, /update\s*\(/);
  assert.match(source, /delete\s*\(/);
  assert.match(source, /findByStudentAndCompetency\s*\(/);
});

test("mastery repository uses mastery_records table", () => {
  assert.match(
    source,
    /\.from\(["']mastery_records["']\)/,
  );
});

test("mastery repository filters by student and competency", () => {
  assert.match(
    source,
    /\.eq\(["']student_id["'],\s*studentId\)/,
  );
  assert.match(
    source,
    /\.eq\(["']competency_id["'],\s*competencyId\)/,
  );
});

test("mastery repository maps database fields to domain fields", () => {
  assert.match(source, /studentId:\s*row\.student_id/);
  assert.match(source, /competencyId:\s*row\.competency_id/);
  assert.match(source, /masteryScore:\s*row\.mastery_score/);
  assert.match(source, /masteryLevel:\s*row\.mastery_level/);
  assert.match(source, /evidenceCount:\s*row\.evidence_count/);
  assert.match(
    source,
    /lastEvaluatedAt:\s*row\.last_evaluated_at/,
  );
  assert.match(source, /createdAt:\s*row\.created_at/);
  assert.match(source, /updatedAt:\s*row\.updated_at/);
});

test("mastery repository handles nullable last_evaluated_at", () => {
  assert.match(
    source,
    /row\.last_evaluated_at\s*\?/,
  );
});

test("mastery repository uses PersistenceError", () => {
  assert.match(source, /PersistenceError/);
  assert.match(source, /throw persistenceError\(error\)/);
});

test("mastery repository uses server Supabase client", () => {
  assert.match(
    source,
    /SupabaseClient/,
  );
});

test("mastery repository does not resolve authorization from input", () => {
  assert.doesNotMatch(source, /role\s*:/);
  assert.doesNotMatch(source, /auth\.user\(\)/);
  assert.doesNotMatch(source, /auth\.getUser\(\)/);
});
