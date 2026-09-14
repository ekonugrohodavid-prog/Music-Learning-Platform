import assert from "node:assert/strict";
import test from "node:test";
import { getProtectedRoutePolicy } from "./route-policy.ts";

test("student routes require student role", () => {
  assert.deepEqual(
    getProtectedRoutePolicy("/student"),
    {
      prefix: "/student",
      role: "student",
    },
  );

  assert.deepEqual(
    getProtectedRoutePolicy("/student/practice"),
    {
      prefix: "/student",
      role: "student",
    },
  );
});

test("teacher routes require teacher role", () => {
  assert.deepEqual(
    getProtectedRoutePolicy("/teacher"),
    {
      prefix: "/teacher",
      role: "teacher",
    },
  );
});

test("admin routes require admin role", () => {
  assert.deepEqual(
    getProtectedRoutePolicy("/admin"),
    {
      prefix: "/admin",
      role: "admin",
    },
  );
});

test("public routes have no authorization policy", () => {
  assert.equal(
    getProtectedRoutePolicy("/login"),
    undefined,
  );

  assert.equal(
    getProtectedRoutePolicy("/"),
    undefined,
  );
});
