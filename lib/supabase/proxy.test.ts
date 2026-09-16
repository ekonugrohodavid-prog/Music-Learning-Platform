import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const source = readFileSync(
  new URL("./proxy.ts", import.meta.url),
  "utf8",
);

test("proxy delegates protected route matching to route policy", () => {
  assert.match(source, /getProtectedRoutePolicy/);
  assert.match(source, /getProtectedRoutePolicy\(pathname\)/);
});

test("proxy checks authenticated claims", () => {
  assert.match(source, /getClaims\(\)/);
  assert.match(source, /data\?\.claims/);
});

test("proxy redirects unauthenticated protected requests to login", () => {
  assert.match(source, /NextResponse\.redirect/);
  assert.match(source, /pathname = "\/login"/);
});
