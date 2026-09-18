import type { Activity, CompetencyId } from "@/types";
import type { ActivityService } from "./contracts";

interface ActivityReader {
  listByCompetency(
    competencyId: CompetencyId,
  ): Promise<readonly Activity[]>;
}

export class DefaultActivityService implements ActivityService {
  constructor(
    private readonly repository: ActivityReader,
  ) {}

  async listByCompetency(
    competencyId: CompetencyId,
  ): Promise<readonly Activity[]> {
    return this.repository.listByCompetency(competencyId);
  }
}
