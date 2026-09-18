import type { Activity } from "@/types";
import type { ActivityRepository } from "@/repositories/contracts";
import type { ActivityDetailService } from "./contracts";

export class DefaultActivityDetailService
  implements ActivityDetailService
{
  private readonly activityRepository: ActivityRepository<
    Activity,
    Activity,
    Activity
  >;

  constructor(
    activityRepository: ActivityRepository<
      Activity,
      Activity,
      Activity
    >,
  ) {
    this.activityRepository = activityRepository;
  }

  async getById(id: Activity["id"]): Promise<Activity | null> {
    return this.activityRepository.findById(id);
  }
}
