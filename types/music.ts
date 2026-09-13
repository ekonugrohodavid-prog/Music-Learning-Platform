import type {
  ActivityId,
  CompositionId,
  ISODateString,
  UserId,
} from "./identity";

export interface Tempo {
  bpm: number;
  marking?: string;
}

export interface Meter {
  beatsPerMeasure: number;
  beatUnit: number;
}

export type MusicEventType =
  | "note"
  | "rest";

export type MusicEventValue = Record<string, unknown>;

export interface MusicEvent {
  id: string;
  beatPosition: number;
  duration: number;
  type: MusicEventType;
  value?: MusicEventValue;
}

export interface RhythmPattern {
  events: MusicEvent[];
  tempo: Tempo;
  meter: Meter;
}

export interface MusicComposition {
  id: CompositionId;
  studentId?: UserId;
  activityId?: ActivityId;
  projectSubmissionId?: string;
  title: string;
  tempo: Tempo;
  meter: Meter;
  totalBeats?: number;
  events: MusicEvent[];
  metadata?: Record<string, unknown>;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface MusicEventConstraints {
  minEvents?: number;
  maxEvents?: number;
  allowedDurations?: number[];
  allowedEventTypes?: MusicEventType[];
}

export type ValidationSeverity =
  | "error"
  | "warning";

export interface ValidationIssue {
  code: string;
  message: string;
  severity: ValidationSeverity;
  eventId?: string;
}

export interface MusicValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
}
