import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(
  new URL("./submit-activity.ts", import.meta.url),
  "utf8",
);

test("submitActivity is a server action", () => {
  assert.match(source, /^"use server";/);
});

test("submitActivity requires a student", () => {
  assert.match(
    source,
    /requireStudent\(\)/,
  );
});

test("submitActivity creates activity submission service", () => {
  assert.match(
    source,
    /new ActivitySubmissionService/,
  );
});

test("submitActivity uses the activity detail service", () => {
  assert.match(
    source,
    /createActivityDetailService/,
  );
});

test("submitActivity uses the attempt repository", () => {
  assert.match(
    source,
    /new SupabaseAttemptRepository/,
  );
});

test("submitActivity delegates activity submission", () => {
  assert.match(
    source,
    /service\.submit\(/,
  );
});

test("submitActivity returns a submitted result", () => {
  assert.match(
    source,
    /state:\s*"submitted"/,
  );
});

test("submitActivity returns a safe failure result", () => {
  assert.match(
    source,
    /success:\s*false/,
  );
});

test("submitActivity maps known domain errors", () => {
  assert.match(source, /ACTIVITY_NOT_FOUND/);
  assert.match(source, /ATTEMPT_NOT_FOUND/);
  assert.match(source, /UNAUTHORIZED/);
  assert.match(source, /SUBMISSION_REJECTED/);
});
