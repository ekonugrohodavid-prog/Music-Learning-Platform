import type { Activity, CompetencyId } from "@/types";

export interface ActivityService {
  listByCompetency(
    competencyId: CompetencyId,
  ): Promise<readonly Activity[]>;
}
