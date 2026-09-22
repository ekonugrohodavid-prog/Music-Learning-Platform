import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { strict as assert } from "node:assert";

const repositoryPath = join(
  process.cwd(),
  "repositories",
  "supabase",
  "attempt.ts",
);

const source = readFileSync(repositoryPath, "utf8");

test("attempt repository defines required repository operations", () => {
  assert.match(
    source,
    /class SupabaseAttemptRepository/,
  );
  assert.match(source, /findById\s*\(/);
  assert.match(source, /list\s*\(/);
  assert.match(source, /create\s*\(/);
  assert.match(source, /update\s*\(/);
  assert.match(source, /delete\s*\(/);
});

test("attempt repository defines atomic submission operation", () => {
  assert.match(
    source,
    /submitStartedAttempt\s*\(/,
  );

  assert.match(
    source,
    /\.eq\("completion_state",\s*"started"\)/,
  );

  assert.match(
    source,
    /completion_state:\s*"submitted"/,
  );
});

test("attempt repository returns existing attempt when atomic submission does not update", () => {
  assert.match(
    source,
    /if\s*\(data\)\s*\{[\s\S]*didSubmit:\s*true/,
  );

  assert.match(
    source,
    /findById\(attemptId\)/,
  );

  assert.match(
    source,
    /didSubmit:\s*false/,
  );
});

test("attempt repository uses activity_attempts table", () => {
  assert.match(
    source,
    /\.from\(["']activity_attempts["']\)/,
  );
});

test("attempt repository maps activity and student fields", () => {
  assert.match(
    source,
    /activityId:\s*row\.activity_id/,
  );
  assert.match(
    source,
    /studentId:\s*row\.student_id/,
  );
});

test("attempt repository maps attempt timing fields", () => {
  assert.match(
    source,
    /startedAt:\s*row\.started_at/,
  );
  assert.match(
    source,
    /submittedAt:/,
  );
});

test("attempt repository maps response and evaluation", () => {
  assert.match(source, /response:/);
  assert.match(source, /evaluation:/);
});

test("attempt repository maps score", () => {
  assert.match(source, /row\.score/);
  assert.match(source, /percentage:/);
});

test("attempt repository maps completion state", () => {
  assert.match(
    source,
    /completionState:/,
  );
  assert.match(
    source,
    /attemptNumber:\s*row\.attempt_number/,
  );
});

test("attempt repository maps audit timestamps", () => {
  assert.match(
    source,
    /createdAt:\s*row\.created_at/,
  );
  assert.match(
    source,
    /updatedAt:\s*row\.updated_at/,
  );
});

test("attempt repository validates completion state", () => {
  assert.match(
    source,
    /row\.completion_state !== "started"/,
  );
  assert.match(
    source,
    /row\.completion_state !== "submitted"/,
  );
  assert.match(
    source,
    /row\.completion_state !== "evaluated"/,
  );
  assert.match(
    source,
    /row\.completion_state !== "completed"/,
  );
});

test("attempt repository uses PersistenceError", () => {
  assert.match(source, /PersistenceError/);
});

test("attempt repository uses server Supabase client", () => {
  assert.match(
    source,
    /@\/lib\/supabase\/server/,
  );
});

test("attempt repository preserves response as structured data", () => {
  assert.match(
    source,
    /response:\s*ActivityResponse\s*\|\s*null/,
  );
});

test("attempt repository persists server evaluation fields", () => {
  assert.match(
    source,
    /evaluation:\s*input\.evaluation/,
  );
  assert.match(
    source,
    /score:\s*input\.score/,
  );
});
