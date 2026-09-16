import type { LearningContent } from "@/types";
import type { LearningContentReaderService } from "./contracts";

interface LearningContentReader {
  findById(id: string): Promise<LearningContent | null>;

  listByCompetency(
    competencyId: LearningContent["competencyId"],
  ): Promise<readonly LearningContent[]>;
}

export class DefaultLearningContentReaderService
  implements LearningContentReaderService
{
  constructor(
    private readonly repository: LearningContentReader,
  ) {}

  async getById(id: string): Promise<LearningContent | null> {
    return this.repository.findById(id);
  }

  async listByCompetency(
    competencyId: LearningContent["competencyId"],
  ): Promise<readonly LearningContent[]> {
    return this.repository.listByCompetency(competencyId);
  }
}
