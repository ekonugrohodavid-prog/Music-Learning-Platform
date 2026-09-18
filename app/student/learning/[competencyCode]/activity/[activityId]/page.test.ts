import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(
  new URL("./page.tsx", import.meta.url),
  "utf8",
);

test("activity detail page uses activity detail server action", () => {
  assert.match(source, /getActivity/);
});

test("activity detail page reads activityId from route params", () => {
  assert.match(source, /activityId/);
});

test("activity detail page renders activity title", () => {
  assert.match(source, /activity\.title/);
});

test("activity detail page handles missing activity", () => {
  assert.match(source, /if \(!activity\)/);
});
