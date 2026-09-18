import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const source = readFileSync(
join(process.cwd(), "lib/activities/service.ts"),
  "utf8",
);

test("activity service defines listByCompetency", () => {
  assert.match(
    source,
    /async\s+listByCompetency\s*\(/,
  );
});

test("activity service uses repository listByCompetency", () => {
  assert.match(
    source,
    /repository\.listByCompetency\s*\(\s*competencyId\s*\)/,
  );
});

test("activity service does not access Supabase directly", () => {
  assert.doesNotMatch(
    source,
    /\.from\s*\(/,
  );
});

test("activity service implements its contract", () => {
  assert.match(
    source,
    /implements\s+ActivityService/,
  );
});
