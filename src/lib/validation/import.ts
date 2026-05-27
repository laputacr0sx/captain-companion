import { z } from "zod";

// ─── CSV Import ──────────────────────────────────────

export const csvDutyRowSchema = z.object({
  dutyCode: z.string().min(1),
  timetableCode: z.string().optional(),
  dayType: z.string().optional(),
  signOnLocation: z.string().optional(),
  signOnTime: z.string().optional(),
  signOffLocation: z.string().optional(),
  signOffTime: z.string().optional(),
  signOffDayOffset: z.string().optional(),
  workMinutes: z.string().optional(),
  remarks: z.string().optional(),
});

export type CsvDutyRow = z.infer<typeof csvDutyRowSchema>;

// ─── JSON Import ─────────────────────────────────────

export const jsonDutyTaskSchema = z.object({
  sequenceNo: z.number().int().positive(),
  taskType: z.string().min(1),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  eventTime: z.string().optional(),
  dayOffset: z.number().int().optional(),
  runNo: z.string().optional(),
  trn: z.string().optional(),
  fromLocation: z.string().optional(),
  fromPlatform: z.string().optional(),
  toLocation: z.string().optional(),
  toPlatform: z.string().optional(),
  instructionText: z.string().optional(),
  remarks: z.string().optional(),
});

export const jsonDutyImportSchema = z.object({
  dutyCode: z.string().min(1),
  timetableCode: z.string().optional(),
  dayType: z.string().optional(),
  signOn: z
    .object({
      time: z.string(),
      location: z.string(),
    })
    .optional(),
  signOff: z
    .object({
      time: z.string(),
      location: z.string(),
    })
    .optional(),
  tasks: z.array(jsonDutyTaskSchema).optional(),
});

export type JsonDutyImport = z.infer<typeof jsonDutyImportSchema>;