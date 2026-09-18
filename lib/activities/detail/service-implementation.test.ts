import assert from "node:assert/strict";
import test from "node:test";
import type { Activity } from "@/types";
import type { ActivityRepository } from "@/repositories/contracts";
import { DefaultActivityDetailService } from "./service.ts";

test("activity detail service delegates getById to repository", async () => {
  const activity = {
    id: "activity-1",
  } as Activity;

  let receivedId: string | undefined;

  const repository = {
    findById: async (id: string) => {
      receivedId = id;
      return activity;
    },
    listByCompetency: async () => [],
    list: async () => [],
    create: async (input: Activity) => input,
    update: async (_id: string, input: Activity) => input,
    delete: async () => undefined,
  } satisfies ActivityRepository<Activity, Activity, Activity>;

  const service = new DefaultActivityDetailService(repository);

  const result = await service.getById(activity.id);

  assert.equal(receivedId, activity.id);
  assert.deepEqual(result, activity);
});
