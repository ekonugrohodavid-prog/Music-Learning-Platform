import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const source = readFileSync(
  join(process.cwd(), "lib/learning/content/service.ts"),
  "utf8",
);

test("learning content reader service defines getById", () => {
  assert.match(
    source,
    /async\s+getById\s*\(/,
  );
});

test("learning content reader service defines listByCompetency", () => {
  assert.match(
    source,
    /async\s+listByCompetency\s*\(/,
  );
});

test("learning content reader service uses repository findById", () => {
  assert.match(
    source,
    /repository\.findById\s*\(\s*id\s*\)/,
  );
});

test("learning content reader service uses repository listByCompetency", () => {
  assert.match(
    source,
    /repository\.listByCompetency\s*\(\s*competencyId\s*\)/,
  );
});

test("learning content reader service does not access Supabase directly", () => {
  assert.doesNotMatch(
    source,
    /\.from\s*\(/,
  );
});

test("learning content reader service implements its contract", () => {
  assert.match(
    source,
    /implements\s+LearningContentReaderService/,
  );
});
