import {
  sqliteTable,
  text,
  integer,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// ─── Captain ──────────────────────────────────────────────

export const captain = sqliteTable("captain", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  staffNo: text("staff_no").notNull().unique(),
  name: text("name").notNull(),
  baseLocation: text("base_location"),
  preferencesJson: text("preferences_json"), // JSON string
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// ─── Duty ─────────────────────────────────────────────────

export const duty = sqliteTable("duty", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  dutyCode: text("duty_code").notNull(),
  timetableCode: text("timetable_code"),
  dayType: text("day_type"), // weekday, saturday, sunday, holiday
  signOnLocation: text("sign_on_location"),
  signOnTime: text("sign_on_time"), // HH:MM format
  signOffLocation: text("sign_off_location"),
  signOffTime: text("sign_off_time"),
  workMinutes: integer("work_minutes"),
  remarks: text("remarks"),
  sourceFile: text("source_file"),
  rawText: text("raw_text"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// ─── Duty Task ────────────────────────────────────────────

export const dutyTask = sqliteTable("duty_task", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  dutyId: integer("duty_id")
    .notNull()
    .references(() => duty.id, { onDelete: "cascade" }),
  sequenceNo: integer("sequence_no").notNull(),
  taskType: text("task_type").notNull(), // SIGN_ON, BOARD, TRAIN_WORK, ALIGHT, HANDOVER, CHANGE_CAB, BREAK, STANDBY, SPECIAL_INSTRUCTION, SIGN_OFF, UNKNOWN
  startTime: text("start_time"),
  endTime: text("end_time"),
  eventTime: text("event_time"),
  runNo: text("run_no"),
  trn: text("trn"),
  fromLocation: text("from_location"),
  fromPlatform: text("from_platform"),
  toLocation: text("to_location"),
  toPlatform: text("to_platform"),
  instructionText: text("instruction_text"),
  instructionType: text("instruction_type"),
  rawText: text("raw_text"),
  confidence: text("confidence"), // high, medium, low
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// ─── Roster Assignment ────────────────────────────────────

export const rosterAssignment = sqliteTable("roster_assignment", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  serviceDate: text("service_date").notNull(), // YYYY-MM-DD
  captainId: integer("captain_id")
    .notNull()
    .references(() => captain.id),
  publishedDutyId: integer("published_duty_id")
    .notNull()
    .references(() => duty.id),
  actualDutyId: integer("actual_duty_id").references(() => duty.id),
  status: text("status").notNull().default("rostered"), // rostered, swapped, confirmed
  source: text("source"),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// ─── Swap Request ─────────────────────────────────────────

export const swapRequest = sqliteTable("swap_request", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  serviceDate: text("service_date").notNull(),
  requestingCaptainId: integer("requesting_captain_id")
    .notNull()
    .references(() => captain.id),
  offeredDutyId: integer("offered_duty_id")
    .notNull()
    .references(() => duty.id),
  wantedDutyId: integer("wanted_duty_id")
    .notNull()
    .references(() => duty.id),
  preferenceType: text("preference_type"),
  status: text("status").notNull().default("pending"), // pending, matched, confirmed, cancelled
  matchedCaptainId: integer("matched_captain_id").references(() => captain.id),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  confirmedAt: integer("confirmed_at", { mode: "timestamp" }),
});

// ─── Duty Preference ──────────────────────────────────────

export const dutyPreference = sqliteTable("duty_preference", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  captainId: integer("captain_id")
    .notNull()
    .references(() => captain.id),
  preferredStartPeriod: text("preferred_start_period"), // early_morning, morning, afternoon, evening, overnight
  preferredEndPeriod: text("preferred_end_period"), // morning_finish, day_finish, evening_finish, dead_evening, overnight_finish
  preferredLocationsJson: text("preferred_locations_json"),
  avoidLocationsJson: text("avoid_locations_json"),
  maxWorkMinutes: integer("max_work_minutes"),
  allowOvernight: integer("allow_overnight", { mode: "boolean" }).default(false),
  preferMorning: integer("prefer_morning", { mode: "boolean" }).default(false),
  preferDeadEvening: integer("prefer_dead_evening", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`),
});

// ─── Train Run ────────────────────────────────────────────

export const trainRun = sqliteTable("train_run", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  timetableCode: text("timetable_code"),
  runNo: text("run_no").notNull(),
  dayType: text("day_type"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// ─── Train Movement ───────────────────────────────────────

export const trainMovement = sqliteTable("train_movement", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  trainRunId: integer("train_run_id")
    .notNull()
    .references(() => trainRun.id),
  trn: text("trn").notNull(),
  direction: text("direction"), // Up, Dn
  fromLocation: text("from_location"),
  fromPlatform: text("from_platform"),
  toLocation: text("to_location"),
  toPlatform: text("to_platform"),
  scheduledDeparture: text("scheduled_departure"),
  scheduledArrival: text("scheduled_arrival"),
  rawText: text("raw_text"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// ─── Duty Run Segment ─────────────────────────────────────

export const dutyRunSegment = sqliteTable("duty_run_segment", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  dutyId: integer("duty_id")
    .notNull()
    .references(() => duty.id),
  dutyTaskId: integer("duty_task_id").references(() => dutyTask.id),
  trainRunId: integer("train_run_id").references(() => trainRun.id),
  trainMovementId: integer("train_movement_id").references(() => trainMovement.id),
  sequenceNo: integer("sequence_no"),
  sourceFile: text("source_file"),
  confidence: text("confidence"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});
