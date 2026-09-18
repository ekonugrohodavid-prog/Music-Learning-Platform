import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(
  new URL("./get-activity.ts", import.meta.url),
  "utf8",
);

test("getActivity is a server action", () => {
  assert.match(source, /^"use server";/);
});

test("getActivity creates activity detail service", () => {
  assert.match(
    source,
    /createActivityDetailService/,
  );
});

test("getActivity delegates to activity detail service", () => {
  assert.match(
    source,
    /service\.getById\(id\)/,
  );
});
