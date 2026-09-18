import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const source = readFileSync(
  join(process.cwd(), "lib/activities/container.ts"),
  "utf8",
);

test("activity container uses activity repository", () => {
  assert.match(
    source,
    /SupabaseActivityRepository/,
  );
});

test("activity container uses activity service", () => {
  assert.match(
    source,
    /DefaultActivityService/,
  );
});

test("activity container creates the repository", () => {
  assert.match(
    source,
    /new\s+SupabaseActivityRepository\s*\(\s*\)/,
  );
});

test("activity container creates the service with repository", () => {
  assert.match(
    source,
    /new\s+DefaultActivityService\s*\(\s*repository\s*\)/,
  );
});
