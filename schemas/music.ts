import { z } from "zod";

export const tempoSchema = z.object({
  bpm: z.number().positive(),
  marking: z.string().optional(),
});

export const meterSchema = z.object({
  beatsPerMeasure: z.number().int().positive(),
  beatUnit: z.number().int().positive(),
});

export const musicEventTypeSchema = z.enum(["note", "rest"]);

export const musicEventValueSchema = z.record(
  z.string(),
  z.unknown(),
);

export const musicEventSchema = z.object({
  id: z.string().min(1),
  beatPosition: z.number().nonnegative(),
  duration: z.number().positive(),
  type: musicEventTypeSchema,
  value: musicEventValueSchema.optional(),
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

export const musicCompositionSchema = z.object({
  id: z.string().min(1),
  studentId: z.string().min(1).optional(),
  activityId: z.string().min(1).optional(),
  projectSubmissionId: z.string().min(1).optional(),
  title: z.string().min(1),
  tempo: tempoSchema,
  meter: meterSchema,
  totalBeats: z.number().nonnegative().optional(),
  events: z.array(musicEventSchema),
  metadata: z.record(z.string(), z.unknown()).optional(),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

export type TempoInput = z.infer<typeof tempoSchema>;
export type MeterInput = z.infer<typeof meterSchema>;
export type MusicEventInput = z.infer<typeof musicEventSchema>;
export type RhythmPatternInput = z.infer<typeof rhythmPatternSchema>;
export type MusicCompositionInput = z.infer<
  typeof musicCompositionSchema
>;
export type MusicEventConstraintsInput = z.infer<
  typeof musicEventConstraintsSchema
>;
