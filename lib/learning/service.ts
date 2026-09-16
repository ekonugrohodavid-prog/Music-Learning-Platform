import type {
  Activity,
  Competency,
  CompetencyDetail,
  LearningContent,
  MasteryRecord,
  UserId,
} from "@/types";
import { requireStudent } from "@/lib/auth/authorization";
import type { CompetencyDetailService } from "./contracts";

interface CompetencyReader {
  findByCode(code: string): Promise<Competency | null>;
}

interface LearningContentReader {
  listByCompetency(
    competencyId: Competency["id"],
  ): Promise<readonly LearningContent[]>;
}

interface ActivityReader {
  listByCompetency(
    competencyId: Competency["id"],
  ): Promise<readonly Activity[]>;
}

interface MasteryReader {
  findByStudentAndCompetency(
    studentId: UserId,
    competencyId: Competency["id"],
  ): Promise<MasteryRecord | null>;
}

export class DefaultCompetencyDetailService
  implements CompetencyDetailService
{
  constructor(
    private readonly competencyRepository: CompetencyReader,
    private readonly learningContentRepository: LearningContentReader,
    private readonly activityRepository: ActivityReader,
    private readonly masteryRepository: MasteryReader,
  ) {}

  async getByCode(code: string): Promise<CompetencyDetail | null> {
    const authContext = await requireStudent();

    const competency =
      await this.competencyRepository.findByCode(code);

    if (!competency) {
      return null;
    }

    const [
      learningContents,
      activities,
      mastery,
    ] = await Promise.all([
      this.learningContentRepository.listByCompetency(competency.id),
      this.activityRepository.listByCompetency(competency.id),
      this.masteryRepository.findByStudentAndCompetency(
        authContext.userId,
        competency.id,
      ),
    ]);

    return {
      competency,
      learningContents,
      activities,
      mastery,
    };
  }
}
