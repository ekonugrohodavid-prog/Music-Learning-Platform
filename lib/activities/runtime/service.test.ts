import test from "node:test";
import assert from "node:assert/strict";
import type { Activity } from "@/types";
import type { ActivityDetailService } from "../detail/contracts";
import type { ActivityDefinitionRegistry } from "../registry";
import {
  DefaultActivityRuntime,
  loadActivityRuntime,
} from "./service.ts";

const activity: Activity = {
  id: "activity-1",
  competencyId: "competency-r1",
  type: "pulse",
  title: "Tap the Pulse",
  difficulty: 1,
  configuration: {
    type: "pulse",
    tempoBpm: 60,
    beatCount: 4,
  },
  status: "published",
  createdBy: "teacher-1",
  createdAt: "2026-09-18T00:00:00.000Z",
  updatedAt: "2026-09-18T00:00:00.000Z",
};

const registry: ActivityDefinitionRegistry = {
  get: () => undefined,
  has: (type) => type === "pulse",
  list: () => [],
};

test("ACT-003 initializes loaded R1 activity", () => {
  const runtime = new DefaultActivityRuntime(
    activity,
    registry,
    123,
  );

  const state = runtime.getState();

  assert.equal(state.activity.id, "activity-1");
  assert.equal(state.status, "ready");
  assert.equal(state.startedAt, 123);
  assert.equal(state.response, null);
});

test("ACT-003 starts activity runtime", () => {
  const runtime = new DefaultActivityRuntime(
    activity,
    registry,
  );

  assert.equal(runtime.start().status, "running");
});

test("ACT-003 captures response for ACT-004", () => {
  const runtime = new DefaultActivityRuntime(
    activity,
    registry,
  );

  runtime.start();

  const response = {
    type: "pulse" as const,
    response: JSON.stringify({
      tapsMs: [100, 1100],
    }),
  };

  const state = runtime.captureResponse(response);

  assert.equal(state.status, "captured");
  assert.deepEqual(
    runtime.getSubmissionResponse(),
    response,
  );
});

test("ACT-003 rejects unsupported activity type", () => {
  const unsupported = {
    ...activity,
    type: "tempo" as const,
  };

  assert.throws(
    () =>
      new DefaultActivityRuntime(
        unsupported,
        registry,
      ),
  );
});

test("ACT-003 loads through ActivityDetailService", async () => {
  const detailService: ActivityDetailService = {
    getById: async () => activity,
  };

  const runtime = await loadActivityRuntime(
    "activity-1",
    detailService,
    registry,
  );

  assert.equal(
    runtime?.getState().activity.id,
    "activity-1",
  );
});

test("ACT-003 returns null when activity is missing", async () => {
  const detailService: ActivityDetailService = {
    getById: async () => null,
  };

  const runtime = await loadActivityRuntime(
    "missing",
    detailService,
    registry,
  );

  assert.equal(runtime, null);
});
