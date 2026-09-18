import type { Activity, ActivityResponse } from "@/types";
import type { ActivityDetailService } from "../detail/contracts";
import type { ActivityDefinitionRegistry } from "../registry";
import type {
  ActivityRuntime,
  ActivityRuntimeState,
} from "./contracts";

export class DefaultActivityRuntime implements ActivityRuntime {
  private state: ActivityRuntimeState;

  constructor(
    activity: Activity,
    registry: ActivityDefinitionRegistry,
    startedAt = Date.now(),
  ) {
    if (activity.type !== "pulse") {
      throw new Error(
        "ACT-003 Wave 1 supports R1 pulse activities only.",
      );
    }

    if (!registry.has(activity.type)) {
      throw new Error(
        `No activity definition registered for ${activity.type}.`,
      );
    }

    this.state = {
      activity,
      status: "ready",
      startedAt,
      response: null,
    };
  }

  getState(): ActivityRuntimeState {
    return this.state;
  }

  start(): ActivityRuntimeState {
    this.state = {
      ...this.state,
      status: "running",
    };

    return this.state;
  }

  captureResponse(
    response: ActivityResponse,
  ): ActivityRuntimeState {
    if (response.type !== "pulse") {
      throw new Error(
        "Invalid response type for an R1 pulse activity.",
      );
    }

    this.state = {
      ...this.state,
      status: "captured",
      response,
    };

    return this.state;
  }

  getSubmissionResponse(): ActivityResponse | null {
    return this.state.response;
  }
}

export async function loadActivityRuntime(
  activityId: Activity["id"],
  activityDetailService: ActivityDetailService,
  registry: ActivityDefinitionRegistry,
): Promise<ActivityRuntime | null> {
  const activity =
    await activityDetailService.getById(activityId);

  if (!activity) {
    return null;
  }

  return new DefaultActivityRuntime(activity, registry);
}
