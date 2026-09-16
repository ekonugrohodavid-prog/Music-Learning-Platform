import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const source = readFileSync(
  join(process.cwd(), "lib/learning/container.ts"),
  "utf8",
);

test("learning container defines competency detail service factory", () => {
  assert.match(
    source,
    /createCompetencyDetailService\s*\(/,
  );
});

test("learning container creates server Supabase client", () => {
  assert.match(
    source,
    /createClient\s*\(/,
  );
});

test("learning container wires competency repository", () => {
  assert.match(
    source,
    /new\s+SupabaseCompetencyRepository\s*\(\s*\)/,
  );
});

test("learning container wires learning content repository", () => {
  assert.match(
    source,
    /new\s+SupabaseLearningContentRepository\s*\(\s*\)/,
  );
});

test("learning container wires activity repository", () => {
  assert.match(
    source,
    /new\s+SupabaseActivityRepository\s*\(\s*\)/,
  );
});

test("learning container wires mastery repository with Supabase client", () => {
  assert.match(
    source,
    /new\s+SupabaseMasteryRepository\s*\(\s*supabase\s*\)/,
  );
});

test("learning container wires competency detail service", () => {
  assert.match(
    source,
    /new\s+DefaultCompetencyDetailService\s*\(/,
  );
});

test("learning container does not contain direct database queries", () => {
  assert.doesNotMatch(source, /\.from\s*\(/);
});

test("learning container returns competency detail service", () => {
  assert.match(
    source,
    /return\s+new\s+DefaultCompetencyDetailService/,
  );
});
