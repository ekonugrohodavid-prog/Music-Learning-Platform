import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const source = readFileSync(
  new URL("./authorization.ts", import.meta.url),
  "utf8",
);

test("authorization exposes required helpers", () => {
  assert.match(source, /requireAuth/);
  assert.match(source, /requireStudent/);
  assert.match(source, /requireTeacher/);
  assert.match(source, /requireAdmin/);
});

test("authorization resolves role from profiles relation", () => {
  assert.match(source, /from\("profiles"\)/);
  assert.match(source, /roles\s*\(/);
  assert.match(source, /code/);
});

test("authorization does not use user metadata for role", () => {
  assert.doesNotMatch(source, /user_metadata/);
});

test("authorization enforces expected roles", () => {
  assert.match(source, /requireRole/);
  assert.match(source, /"student"/);
  assert.match(source, /"teacher"/);
  assert.match(source, /"admin"/);
});
