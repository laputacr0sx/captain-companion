import { z } from "zod";

// ─── Duty Template ────────────────────────────────────

export const dutyTemplateSchema = z.object({
  dutyCode: z.string().min(1),
  timetableCode: z.string().optional(),
  dayType: z
    .enum(["WEEKDAY", "SATURDAY", "SUNDAY", "HOLIDAY"])
    .optional(),
  signOnLocation: z.string().optional(),
  signOnTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  signOffLocation: z.string().optional(),
  signOffTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  signOffDayOffset: z.number().int().min(0).default(0),
  workMinutes: z.number().int().positive().optional(),
  remarks: z.string().optional(),
  isPublished: z.boolean().default(false),
});

export type DutyTemplateInput = z.infer<typeof dutyTemplateSchema>;

// ─── Duty Task ───────────────────────────────────────

const taskTypes = [
  "SIGN_ON",
  "BOARD",
  "TRAIN_WORK",
  "ALIGHT",
  "HANDOVER",
  "CHANGE_CAB",
  "BREAK",
  "STANDBY",
  "SPECIAL_INSTRUCTION",
  "SIGN_OFF",
  "UNKNOWN",
] as const;

export const dutyTaskSchema = z.object({
  sequenceNo: z.number().int().positive(),
  taskType: z.enum(taskTypes),
  startTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  endTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  eventTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  dayOffset: z.number().int().min(0).default(0),
  runNo: z.string().optional(),
  trn: z.string().optional(),
  fromLocation: z.string().optional(),
  fromPlatform: z.string().optional(),
  toLocation: z.string().optional(),
  toPlatform: z.string().optional(),
  instructionText: z.string().optional(),
  remarks: z.string().optional(),
});

export type DutyTaskInput = z.infer<typeof dutyTaskSchema>;

// ─── Duty Rating ─────────────────────────────────────

export const dutyRatingSchema = z.object({
  overallPreference: z.number().int().min(1).max(10).optional(),
  comfortScore: z.number().int().min(1).max(10).optional(),
  easeOfWorking: z.number().int().min(1).max(10).optional(),
  breakQuality: z.number().int().min(1).max(10).optional(),
  handoverSimplicity: z.number().int().min(1).max(10).optional(),
  locationConvenience: z.number().int().min(1).max(10).optional(),
  optionalComment: z.string().optional(),
});

export type DutyRatingInput = z.infer<typeof dutyRatingSchema>;