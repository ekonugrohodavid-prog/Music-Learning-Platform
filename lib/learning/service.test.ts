import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const source = readFileSync(
  join(process.cwd(), "lib/learning/service.ts"),
  "utf8",
);

test("competency detail service defines getByCode", () => {
  assert.match(source, /getByCode\s*\(/);
});

test("competency detail service requires student authorization", () => {
  assert.match(source, /requireStudent\s*\(/);
});

test("competency detail service resolves competency by code", () => {
  assert.match(
    source,
    /competencyRepository\.findByCode\s*\(\s*code\s*\)/,
  );
});

test("competency detail service loads learning contents by competency", () => {
  assert.match(
    source,
    /learningContentRepository\.listByCompetency\s*\(\s*competency\.id\s*\)/,
  );
});

test("competency detail service loads activities by competency", () => {
  assert.match(
    source,
    /activityRepository\.listByCompetency\s*\(\s*competency\.id\s*\)/,
  );
});

test("competency detail service loads mastery for authenticated student", () => {
  assert.match(
    source,
    /masteryRepository\.findByStudentAndCompetency\s*\(\s*authContext\.userId\s*,\s*competency\.id\s*,?\s*\)/,
  );
});

test("competency detail service returns null for missing competency", () => {
  assert.match(
    source,
    /if\s*\(\s*!competency\)\s*\{[\s\S]*?return null;/,
  );
});

test("competency detail service does not access Supabase directly", () => {
  assert.doesNotMatch(source, /createClient\s*\(/);
  assert.doesNotMatch(source, /\.from\s*\(/);
});

test("competency detail service combines competency detail data", () => {
  assert.match(
    source,
    /return\s*\{[\s\S]*?competency,[\s\S]*?learningContents,[\s\S]*?activities,[\s\S]*?mastery,[\s\S]*?\}/,
  );
});
