import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const source = readFileSync(
  join(process.cwd(), "repositories/supabase/competency.ts"),
  "utf8",
);

// test-test yang sudah ada...

// Tambahkan di sini:
test("competency repository defines findByCode", () => {
  assert.match(source, /findByCode\s*\(/);
});

test("competency repository finds active competency by code", () => {
  assert.match(
    source,
    /\.from\(["']competencies["']\)[\s\S]*?\.eq\(["']code["'],\s*code\)/,
  );
  assert.match(
    source,
    /\.eq\(["']status["'],\s*["']active["']\)/,
  );
});
