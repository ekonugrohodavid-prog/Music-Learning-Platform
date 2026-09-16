import type {
  Meter,
  MusicEvent,
  MusicEventConstraints,
  MusicValidationResult,
  ValidationIssue,
} from "@/types/music";

import { measureToBeatRange } from "./measures.ts";

export interface RhythmValidationOptions {
  meter: Meter;
  constraints?: MusicEventConstraints;
  requireCompleteMeasure?: boolean;
}

export function validateRhythm(
  events: MusicEvent[],
  options: RhythmValidationOptions,
): MusicValidationResult {
  const issues: ValidationIssue[] = [];
  const { meter, constraints } = options;

  const measureRange = measureToBeatRange(1, meter);
  const measureDuration = meter.beatsPerMeasure;

  if (constraints?.minEvents !== undefined) {
    if (events.length < constraints.minEvents) {
      issues.push({
        code: "RHYTHM_MIN_EVENTS",
        message: `Pattern requires at least ${constraints.minEvents} events.`,
        severity: "error",
      });
    }
  }

  if (constraints?.maxEvents !== undefined) {
    if (events.length > constraints.maxEvents) {
      issues.push({
        code: "RHYTHM_MAX_EVENTS",
        message: `Pattern allows at most ${constraints.maxEvents} events.`,
        severity: "error",
      });
    }
  }

  for (const event of events) {
    if (event.beatPosition < 0) {
      issues.push({
        code: "RHYTHM_INVALID_POSITION",
        message: "Event position must be greater than or equal to 0.",
        severity: "error",
        eventId: event.id,
      });
    }

    if (event.duration <= 0) {
      issues.push({
        code: "RHYTHM_INVALID_DURATION",
        message: "Event duration must be greater than 0.",
        severity: "error",
        eventId: event.id,
      });
    }

    if (
      constraints?.allowedEventTypes &&
      !constraints.allowedEventTypes.includes(event.type)
    ) {
      issues.push({
        code: "RHYTHM_INVALID_EVENT_TYPE",
        message: `Event type "${event.type}" is not allowed.`,
        severity: "error",
        eventId: event.id,
      });
    }

    if (
      constraints?.allowedDurations &&
      !constraints.allowedDurations.includes(event.duration)
    ) {
      issues.push({
        code: "RHYTHM_INVALID_DURATION",
        message: `Duration ${event.duration} is not allowed.`,
        severity: "error",
        eventId: event.id,
      });
    }

    const eventEnd =
      event.beatPosition + event.duration;

    if (
      event.beatPosition < measureRange.startBeat ||
      eventEnd > measureRange.endBeat
    ) {
      issues.push({
        code: "RHYTHM_MEASURE_OVERFLOW",
        message: "Event exceeds the measure boundary.",
        severity: "error",
        eventId: event.id,
      });
    }
  }

  if (options.requireCompleteMeasure) {
    const totalDuration = events.reduce(
      (total, event) => total + event.duration,
      0,
    );

    if (totalDuration !== measureDuration) {
      issues.push({
        code: "RHYTHM_DURATION_OVERFLOW",
        message: `Pattern duration must equal ${measureDuration} beats.`,
        severity: "error",
      });
    }
  }

  return {
    valid: issues.every(
      (issue) => issue.severity !== "error",
    ),
    issues,
  };
}
