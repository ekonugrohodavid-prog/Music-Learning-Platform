"use server";

import type { Activity } from "@/types";
import { createActivityDetailService } from "@/lib/activities/detail/container";

export async function getActivity(
  id: Activity["id"],
): Promise<Activity | null> {
  const service = createActivityDetailService();

  return service.getById(id);
}
