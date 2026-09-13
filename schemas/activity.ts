import { z } from "zod";

export const activityTypeSchema = z.enum([
  "pulse",
  "tempo",
  "meter",
  "note_value",
  "rest",
  "rhythm_composer",
  "rhythm_reading",
  "rhythm_analysis",
  "rhythm_performance",
  "rhythm_creation",
]);

export const activityStatusSchema = z.enum([
  "draft",
  "published",
  "archived",
]);

export const activityInputSchema = z.object({
  competencyId: z.string().min(1),
  type: activityTypeSchema,
  title: z.string().min(1),
  instructions: z.string().optional(),
  difficulty: z.number().int().min(1).max(5),
  status: activityStatusSchema,
  createdBy: z.string().min(1),
});

export type ActivityInput = z.infer<typeof activityInputSchema>;

export const tempoSchema = z.object({
  bpm: z.number().positive(),
  marking: z.string().optional(),
});

export const meterSchema = z.object({
  beatsPerMeasure: z.number().int().positive(),
  beatUnit: z.number().int().positive(),
});

export const musicEventTypeSchema = z.enum(["note", "rest"]);

export const musicEventSchema = z.object({
  id: z.string().min(1),
  beatPosition: z.number().nonnegative(),
  duration: z.number().positive(),
  type: musicEventTypeSchema,
  value: z.record(z.string(), z.unknown()).optional(),
});

export const rhythmPatternSchema = z.object({
  events: z.array(musicEventSchema),
  tempo: tempoSchema,
  meter: meterSchema,
});

export const musicEventConstraintsSchema = z.object({
  minEvents: z.number().int().nonnegative().optional(),
  maxEvents: z.number().int().nonnegative().optional(),
  allowedDurations: z.array(z.number().positive()).optional(),
  allowedEventTypes: z.array(musicEventTypeSchema).optional(),
});

export const pulseActivityConfigurationSchema = z.object({
  type: z.literal("pulse"),
  tempoBpm: z.number().positive(),
  beatCount: z.number().int().positive(),
});

export const tempoActivityConfigurationSchema = z.object({
  type: z.literal("tempo"),
  targetBpm: z.number().positive().optional(),
  minBpm: z.number().positive().optional(),
  maxBpm: z.number().positive().optional(),
});

export const meterActivityConfigurationSchema = z.object({
  type: z.literal("meter"),
  meter: meterSchema,
});

export const rhythmComposerActivityConfigurationSchema = z.object({
  type: z.literal("rhythm_composer"),
  tempo: tempoSchema,
  meter: meterSchema,
  eventConstraints: musicEventConstraintsSchema,
});

export const rhythmReadingActivityConfigurationSchema = z.object({
  type: z.literal("rhythm_reading"),
  tempo: tempoSchema,
  meter: meterSchema,
  pattern: rhythmPatternSchema,
});

export const rhythmAnalysisActivityConfigurationSchema = z.object({
  type: z.literal("rhythm_analysis"),
  meter: meterSchema,
  expectedPattern: rhythmPatternSchema.optional(),
});

export const rhythmPerformanceActivityConfigurationSchema = z.object({
  type: z.literal("rhythm_performance"),
  tempo: tempoSchema,
  meter: meterSchema,
  targetPattern: rhythmPatternSchema,
});

export const rhythmCreationActivityConfigurationSchema = z.object({
  type: z.literal("rhythm_creation"),
  tempo: tempoSchema,
  meter: meterSchema,
  constraints: musicEventConstraintsSchema.optional(),
});

export const activityConfigurationSchema = z.discriminatedUnion("type", [
  pulseActivityConfigurationSchema,
  tempoActivityConfigurationSchema,
  meterActivityConfigurationSchema,
  rhythmComposerActivityConfigurationSchema,
  rhythmReadingActivityConfigurationSchema,
  rhythmAnalysisActivityConfigurationSchema,
  rhythmPerformanceActivityConfigurationSchema,
  rhythmCreationActivityConfigurationSchema,
]);

export type ActivityConfiguration = z.infer<
  typeof activityConfigurationSchema
>;

export const pulseActivityResponseSchema = z.object({
  type: z.literal("pulse"),
  response: z.string().min(1),
});

export const tempoActivityResponseSchema = z.object({
  type: z.literal("tempo"),
  bpm: z.number().positive(),
});

export const meterActivityResponseSchema = z.object({
  type: z.literal("meter"),
  beatsPerMeasure: z.number().int().positive(),
  beatUnit: z.number().int().positive(),
});

export const rhythmActivityResponseSchema = z.object({
  type: z.literal("rhythm"),
  pattern: rhythmPatternSchema,
});

export const genericActivityResponseSchema = z.object({
  type: z.literal("generic"),
  value: z.record(z.string(), z.unknown()),
});

export const activityResponseSchema = z.discriminatedUnion("type", [
  pulseActivityResponseSchema,
  tempoActivityResponseSchema,
  meterActivityResponseSchema,
  rhythmActivityResponseSchema,
  genericActivityResponseSchema,
]);

export type ActivityResponse = z.infer<typeof activityResponseSchema>;
