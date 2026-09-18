import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("activity detail container creates Supabase activity repository", () => {
  const source = readFileSync(
    new URL("./container.ts", import.meta.url),
    "utf8",
  );

  assert.match(
    source,
    /new SupabaseActivityRepository\(\)/,
  );
});

test("activity detail container creates default activity detail service", () => {
  const source = readFileSync(
    new URL("./container.ts", import.meta.url),
    "utf8",
  );

  assert.match(
    source,
    /new DefaultActivityDetailService\(repository\)/,
  );
});

test("activity detail container exposes factory", () => {
  const source = readFileSync(
    new URL("./container.ts", import.meta.url),
    "utf8",
  );

  assert.match(
    source,
    /export function createActivityDetailService/,
  );
});
