import type { LearningContent } from "@/types";

export interface LearningContentReaderService {
  getById(id: string): Promise<LearningContent | null>;

  listByCompetency(
    competencyId: LearningContent["competencyId"],
  ): Promise<readonly LearningContent[]>;
}
