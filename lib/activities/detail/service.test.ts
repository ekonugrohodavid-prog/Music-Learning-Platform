import assert from "node:assert/strict";
import test from "node:test";
import type { Activity } from "@/types";
import type { ActivityDetailService } from "./contracts";

test("ActivityDetailService defines getById operation", () => {
  const service: ActivityDetailService = {
    getById: async () => null,
  };

  const result = service.getById("activity-id" as Activity["id"]);

  assert.ok(result instanceof Promise);
});
