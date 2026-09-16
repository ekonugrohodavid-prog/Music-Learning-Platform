import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const source = readFileSync(
  join(process.cwd(), "lib/learning/content/container.ts"),
  "utf8",
);

test("content reader container uses learning content repository", () => {
  assert.match(
    source,
    /SupabaseLearningContentRepository/,
  );
});

test("content reader container uses reader service", () => {
  assert.match(
    source,
    /DefaultLearningContentReaderService/,
  );
});

test("content reader container creates the repository", () => {
  assert.match(
    source,
    /new\s+SupabaseLearningContentRepository\s*\(\s*\)/,
  );
});

test("content reader container creates the service with repository", () => {
  assert.match(
    source,
    /new\s+DefaultLearningContentReaderService\s*\(\s*repository\s*\)/,
  );
});
