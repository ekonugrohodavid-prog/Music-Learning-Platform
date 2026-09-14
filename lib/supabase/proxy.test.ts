import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const source = readFileSync(
  new URL("./proxy.ts", import.meta.url),
  "utf8",
);

test("proxy protects student, teacher, and admin routes", () => {
  assert.match(source, /"\/student"/);
  assert.match(source, /"\/teacher"/);
  assert.match(source, /"\/admin"/);
});

test("proxy checks authenticated claims", () => {
  assert.match(source, /getClaims\(\)/);
  assert.match(source, /data\?\.claims/);
});

test("proxy redirects unauthenticated protected requests to login", () => {
  assert.match(source, /NextResponse\.redirect/);
  assert.match(source, /pathname = "\/login"/);
});
