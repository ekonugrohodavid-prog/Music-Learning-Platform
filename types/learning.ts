import type {
  ActivityId,
  CompetencyId,
  ISODateString,
  UserId,
} from "./identity";

import type { RhythmPattern } from "./music";

export type LearningContentType =
  | "lesson"
  | "video"
  | "reading"
  | "interactive"
  | "reference";

export type ContentStatus =
  | "draft"
  | "published"
  | "archived";

export interface LearningContent {
  id: string;
  competencyId: CompetencyId;
  title: string;
  contentType: LearningContentType;
  body?: string;
  configuration?: Record<string, unknown>;
  sequence: number;
  status: ContentStatus;
  createdBy: UserId;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export type ActivityType =
  | "pulse"
  | "tempo"
  | "meter"
  | "note_value"
  | "rest"
  | "rhythm_composer"
  | "rhythm_reading"
  | "rhythm_analysis"
  | "rhythm_performance"
  | "rhythm_creation";

export type ActivityStatus =
  | "draft"
  | "published"
  | "archived";

export interface Activity {
  id: ActivityId;
  competencyId: CompetencyId;
  type: ActivityType;
  title: string;
  instructions?: string;
  difficulty: number;
  configuration: ActivityConfiguration;
  scoringConfiguration?: ScoringConfiguration;
  status: ActivityStatus;
  createdBy: UserId;
  publishedBy?: UserId;
  publishedAt?: ISODateString;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface PulseActivityConfiguration {
  type: "pulse";
  tempoBpm: number;
  beatCount: number;
}

export interface TempoActivityConfiguration {
  type: "tempo";
  targetBpm?: number;
  minBpm?: number;
  maxBpm?: number;
}

export interface MeterActivityConfiguration {
  type: "meter";
  beatsPerMeasure: number;
  beatUnit: number;
}

export interface NoteValueActivityConfiguration {
  type: "note_value";
  noteValues: string[];
}

export interface RestActivityConfiguration {
  type: "rest";
  restValues: string[];
}

export interface RhythmActivityConfiguration {
  type:
    | "rhythm_composer"
    | "rhythm_reading"
    | "rhythm_analysis"
    | "rhythm_performance"
    | "rhythm_creation";
  tempoBpm: number;
  beatsPerMeasure: number;
  beatUnit: number;
}

export type ActivityConfiguration =
  | PulseActivityConfiguration
  | TempoActivityConfiguration
  | MeterActivityConfiguration
  | NoteValueActivityConfiguration
  | RestActivityConfiguration
  | RhythmActivityConfiguration;

export interface ScoringConfiguration {
  passingScore?: number;
  maxScore?: number;
  xpReward?: number;
}

export type AttemptState =
  | "started"
  | "submitted"
  | "evaluated"
  | "completed";

export interface ActivityAttempt {
  id: string;
  activityId: ActivityId;
  studentId: UserId;
  startedAt: ISODateString;
  submittedAt?: ISODateString;
  response?: ActivityResponse;
  evaluation?: EvaluationResult;
  score?: Score;
  completionState: AttemptState;
  attemptNumber: number;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface PulseActivityResponse {
  type: "pulse";
  response: string;
}

export interface TempoActivityResponse {
  type: "tempo";
  bpm: number;
}

export interface MeterActivityResponse {
  type: "meter";
  beatsPerMeasure: number;
  beatUnit: number;
}

export interface RhythmActivityResponse {
  type: "rhythm";
  pattern: RhythmPattern;
}

export interface GenericActivityResponse {
  type: "generic";
  value: Record<string, unknown>;
}

export type ActivityResponse =
  | PulseActivityResponse
  | TempoActivityResponse
  | MeterActivityResponse
  | RhythmActivityResponse
  | GenericActivityResponse;

export interface Challenge {
  id: string;
  activityId: ActivityId;
  title: string;
  description?: string;
  configuration?: Record<string, unknown>;
  xpReward: number;
  status: ActivityStatus;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface ChallengeAttempt {
  id: string;
  challengeId: string;
  studentId: UserId;
  startedAt: ISODateString;
  submittedAt?: ISODateString;
  response?: unknown;
  evaluation?: EvaluationResult;
  score?: Score;
  completed: boolean;
  createdAt: ISODateString;
}

export interface Score {
  value: number;
  max: number;
  percentage: number;
}

export type EvaluationClassification =
  | "exact_match"
  | "partial_match"
  | "incorrect";

export interface EvaluationDimension {
  key: string;
  score: number;
  maxScore: number;
}

export interface EvaluationResult {
  classification: EvaluationClassification;
  score: Score;
  dimensions?: EvaluationDimension[];
  feedback?: string;
}
