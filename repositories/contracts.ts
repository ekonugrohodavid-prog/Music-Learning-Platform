import type { Repository, RepositoryId } from "./base";

export interface ProfileRepository<TProfile, TCreateInput, TUpdateInput, TUserId extends RepositoryId = RepositoryId> extends Repository<TProfile, TCreateInput, TUpdateInput, TUserId> {}

export interface ActivityRepository<TActivity, TCreateInput, TUpdateInput, TActivityId extends RepositoryId = RepositoryId> extends Repository<TActivity, TCreateInput, TUpdateInput, TActivityId> {}

export interface AttemptRepository<TAttempt, TCreateInput, TUpdateInput, TAttemptId extends RepositoryId = RepositoryId> extends Repository<TAttempt, TCreateInput, TUpdateInput, TAttemptId> {}

export interface CompositionRepository<TComposition, TCreateInput, TUpdateInput, TCompositionId extends RepositoryId = RepositoryId> extends Repository<TComposition, TCreateInput, TUpdateInput, TCompositionId> {}

export interface ProgressRepository<TProgress, TCreateInput, TUpdateInput, TProgressId extends RepositoryId = RepositoryId> extends Repository<TProgress, TCreateInput, TUpdateInput, TProgressId> {}

export interface MasteryRepository<TMastery, TCreateInput, TUpdateInput, TMasteryId extends RepositoryId = RepositoryId> extends Repository<TMastery, TCreateInput, TUpdateInput, TMasteryId> {}

export interface XPRepository<TXPTransaction, TCreateInput, TUpdateInput, TXPTransactionId extends RepositoryId = RepositoryId> extends Repository<TXPTransaction, TCreateInput, TUpdateInput, TXPTransactionId> {}

export interface AchievementRepository<TAchievement, TCreateInput, TUpdateInput, TAchievementId extends RepositoryId = RepositoryId> extends Repository<TAchievement, TCreateInput, TUpdateInput, TAchievementId> {}
