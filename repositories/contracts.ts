import type { Repository, RepositoryId } from "./base";
import type { CompetencyId } from "@/types";

export type ProfileRepository<
  TProfile,
  TCreateInput,
  TUpdateInput,
  TUserId extends RepositoryId = RepositoryId,
> = Repository<TProfile, TCreateInput, TUpdateInput, TUserId>;

export type ActivityRepository<
  TActivity,
  TCreateInput,
  TUpdateInput,
  TActivityId extends RepositoryId = RepositoryId,
> = Repository<TActivity, TCreateInput, TUpdateInput, TActivityId>;

export type AttemptRepository<
  TAttempt,
  TCreateInput,
  TUpdateInput,
  TAttemptId extends RepositoryId = RepositoryId,
> = Repository<TAttempt, TCreateInput, TUpdateInput, TAttemptId>;

export type CompositionRepository<
  TComposition,
  TCreateInput,
  TUpdateInput,
  TCompositionId extends RepositoryId = RepositoryId,
> = Repository<TComposition, TCreateInput, TUpdateInput, TCompositionId>;

export type ProgressRepository<
  TProgress,
  TCreateInput,
  TUpdateInput,
  TProgressId extends RepositoryId = RepositoryId,
> = Repository<TProgress, TCreateInput, TUpdateInput, TProgressId>;

export type MasteryRepository<
  TMastery,
  TCreateInput,
  TUpdateInput,
  TMasteryId extends RepositoryId = RepositoryId,
> = Repository<TMastery, TCreateInput, TUpdateInput, TMasteryId>;

export type XPRepository<
  TXPTransaction,
  TCreateInput,
  TUpdateInput,
  TXPTransactionId extends RepositoryId = RepositoryId,
> = Repository<TXPTransaction, TCreateInput, TUpdateInput, TXPTransactionId>;

export type AchievementRepository<
  TAchievement,
  TCreateInput,
  TUpdateInput,
  TAchievementId extends RepositoryId = RepositoryId,
> = Repository<TAchievement, TCreateInput, TUpdateInput, TAchievementId>;

export type CompetencyRepository<
  TCompetency,
  TCreateInput,
  TUpdateInput,
  TCompetencyId extends RepositoryId = RepositoryId,
> = Repository<
  TCompetency,
  TCreateInput,
  TUpdateInput,
  TCompetencyId
>;

export interface LearningContentRepository<
  TEntity,
  TCreateInput,
  TUpdateInput,
  TId extends RepositoryId = RepositoryId,
> extends Repository<TEntity, TCreateInput, TUpdateInput, TId> {
  listByCompetency(
    competencyId: CompetencyId,
  ): Promise<readonly TEntity[]>;
}
