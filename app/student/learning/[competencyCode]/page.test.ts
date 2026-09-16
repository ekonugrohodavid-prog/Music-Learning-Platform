import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const source = readFileSync(
  join(
    process.cwd(),
    "app/student/learning/[competencyCode]/page.tsx",
  ),
  "utf8",
);

test("competency page renders learning content body", () => {
  assert.match(
    source,
    /content\.body/,
  );
});

test("competency page conditionally renders learning content body", () => {
  assert.match(
    source,
    /content\.body\s*&&/,
  );
});
