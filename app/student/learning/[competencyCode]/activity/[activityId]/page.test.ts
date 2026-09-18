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

test("activity detail page renders activity type", () => {
  assert.match(source, /activity\.type/);
});

test("activity detail page renders activity difficulty", () => {
  assert.match(source, /activity\.difficulty/);
});

test("activity detail page renders instructions", () => {
  assert.match(source, /activity\.instructions/);
});

test("activity detail page renders configuration", () => {
  assert.match(source, /activity\.configuration/);
});

test("activity detail page integrates ACT-003 runtime client", () => {
  assert.match(source, /ActivityRuntimeClient/);
});

test("activity detail page renders runtime for pulse activities", () => {
  assert.match(
    source,
    /activity\.type === "pulse"/,
  );
});

test("activity detail page handles missing activity", () => {
  assert.match(source, /if \(!activity\)/);
});
