import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const source = readFileSync(
  new URL("./service.ts", import.meta.url),
  "utf8",
);

test("competency service exposes required methods", () => {
  assert.match(source, /getCompetencies/);
  assert.match(source, /getCompetency/);
});

test("competency service requires student authorization", () => {
  assert.match(source, /requireStudent/);
});

test("competency service uses competency repository", () => {
  assert.match(
    source,
    /SupabaseCompetencyRepository/,
  );
});

test("competency service lists competencies through repository", () => {
  assert.match(source, /repository\.list\(\)/);
});

test("competency service finds competency through repository", () => {
  assert.match(
    source,
    /repository\.findById\(id\)/,
  );
});

test("competency service does not access Supabase directly", () => {
  assert.doesNotMatch(
    source,
    /\.from\("competencies"\)/,
  );
});
