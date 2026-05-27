import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  serial,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// ─── Users ──────────────────────────────────────────────────

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  staffNo: text("staff_no").unique(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  role: text("role").notNull().default("CAPTAIN"), // CAPTAIN, ADMIN, MODERATOR
  baseLocation: text("base_location"),
  createdAt: timestamp("created_at", { mode: "date" })
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .notNull()
    .default(sql`now()`),
});

// ─── Captain Profiles ───────────────────────────────────────

export const captainProfiles = pgTable("captain_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
  preferencesJson: jsonb("preferences_json").$type<{
    preferredStartPeriod?: string;
    preferredEndPeriod?: string;
    preferredLocations?: string[];
    avoidLocations?: string[];
    maxWorkMinutes?: number;
    allowOvernight?: boolean;
  }>(),
  createdAt: timestamp("created_at", { mode: "date" })
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .notNull()
    .default(sql`now()`),
});

// ─── Duty Templates ─────────────────────────────────────────

export const dutyTemplates = pgTable("duty_templates", {
  id: serial("id").primaryKey(),
  dutyCode: text("duty_code").notNull().unique(),
  timetableCode: text("timetable_code"),
  dayType: text("day_type"), // WEEKDAY, SATURDAY, SUNDAY, HOLIDAY
  signOnLocation: text("sign_on_location"),
  signOnTime: text("sign_on_time"), // HH:MM format
  signOffLocation: text("sign_off_location"),
  signOffTime: text("sign_off_time"), // HH:MM format
  signOffDayOffset: integer("sign_off_day_offset").default(0), // 0 = same day, 1 = next day
  workMinutes: integer("work_minutes"),
  remarks: text("remarks"),
  classificationJson: jsonb("classification_json").$type<{
    earlyStart?: boolean;
    morningDuty?: boolean;
    afternoonDuty?: boolean;
    eveningDuty?: boolean;
    deadEvening?: boolean;
    overnight?: boolean;
    crossesMidnight?: boolean;
    shortDuty?: boolean;
    longDuty?: boolean;
    hasBreak?: boolean;
    noBreakRecorded?: boolean;
    startsAtBase?: boolean;
    endsAtBase?: boolean;
  }>(),
  isPublished: boolean("is_published").notNull().default(false),
  createdBy: integer("created_by").references(() => users.id),
  updatedBy: integer("updated_by").references(() => users.id),
  createdAt: timestamp("created_at", { mode: "date" })
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .notNull()
    .default(sql`now()`),
});

// ─── Duty Tasks ─────────────────────────────────────────────

export const dutyTasks = pgTable("duty_tasks", {
  id: serial("id").primaryKey(),
  dutyTemplateId: integer("duty_template_id")
    .notNull()
    .references(() => dutyTemplates.id, { onDelete: "cascade" }),
  sequenceNo: integer("sequence_no").notNull(),
  taskType: text("task_type").notNull(), // SIGN_ON, BOARD, TRAIN_WORK, ALIGHT, HANDOVER, CHANGE_CAB, BREAK, STANDBY, SPECIAL_INSTRUCTION, SIGN_OFF, UNKNOWN
  startTime: text("start_time"), // HH:MM
  endTime: text("end_time"), // HH:MM
  eventTime: text("event_time"), // HH:MM
  dayOffset: integer("day_offset").default(0), // for tasks crossing midnight
  runNo: text("run_no"),
  trn: text("trn"),
  fromLocation: text("from_location"),
  fromPlatform: text("from_platform"),
  toLocation: text("to_location"),
  toPlatform: text("to_platform"),
  instructionText: text("instruction_text"),
  remarks: text("remarks"),
  createdAt: timestamp("created_at", { mode: "date" })
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .notNull()
    .default(sql`now()`),
});

// ─── Roster Assignments ─────────────────────────────────────

export const rosterAssignments = pgTable("roster_assignments", {
  id: serial("id").primaryKey(),
  serviceDate: text("service_date").notNull(), // YYYY-MM-DD
  captainUserId: integer("captain_user_id")
    .notNull()
    .references(() => users.id),
  publishedDutyTemplateId: integer("published_duty_template_id")
    .notNull()
    .references(() => dutyTemplates.id),
  actualDutyTemplateId: integer("actual_duty_template_id").references(
    () => dutyTemplates.id
  ),
  status: text("status").notNull().default("rostered"), // rostered, swapped, confirmed
  source: text("source"),
  notes: text("notes"),
  createdBy: integer("created_by").references(() => users.id),
  updatedBy: integer("updated_by").references(() => users.id),
  createdAt: timestamp("created_at", { mode: "date" })
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .notNull()
    .default(sql`now()`),
});

// ─── Swap Requests ──────────────────────────────────────────

export const swapRequests = pgTable("swap_requests", {
  id: serial("id").primaryKey(),
  serviceDate: text("service_date").notNull(), // YYYY-MM-DD
  requestingUserId: integer("requesting_user_id")
    .notNull()
    .references(() => users.id),
  offeredDutyTemplateId: integer("offered_duty_template_id")
    .notNull()
    .references(() => dutyTemplates.id),
  wantedDutyTemplateId: integer("wanted_duty_template_id")
    .notNull()
    .references(() => dutyTemplates.id),
  matchedUserId: integer("matched_user_id").references(() => users.id),
  matchedDutyTemplateId: integer("matched_duty_template_id").references(
    () => dutyTemplates.id
  ),
  status: text("status").notNull().default("OPEN"), // OPEN, PENDING_ACCEPTANCE, ACCEPTED, REJECTED, CANCELLED, CONFIRMED, EXPIRED
  message: text("message"),
  createdAt: timestamp("created_at", { mode: "date" })
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .notNull()
    .default(sql`now()`),
  confirmedAt: timestamp("confirmed_at", { mode: "date" }),
  cancelledAt: timestamp("cancelled_at", { mode: "date" }),
});

// ─── Duty Notes ─────────────────────────────────────────────

export const dutyNotes = pgTable("duty_notes", {
  id: serial("id").primaryKey(),
  dutyTemplateId: integer("duty_template_id")
    .notNull()
    .references(() => dutyTemplates.id),
  authorUserId: integer("author_user_id")
    .notNull()
    .references(() => users.id),
  body: text("body").notNull(),
  visibility: text("visibility").notNull().default("PUBLIC"), // PUBLIC, PRIVATE
  status: text("status").notNull().default("VISIBLE"), // VISIBLE, HIDDEN, DELETED, FLAGGED
  createdAt: timestamp("created_at", { mode: "date" })
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .notNull()
    .default(sql`now()`),
});

// ─── Duty Ratings ───────────────────────────────────────────

export const dutyRatings = pgTable("duty_ratings", {
  id: serial("id").primaryKey(),
  dutyTemplateId: integer("duty_template_id")
    .notNull()
    .references(() => dutyTemplates.id),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  overallPreference: integer("overall_preference"), // 1-10
  comfortScore: integer("comfort_score"), // 1-10
  easeOfWorking: integer("ease_of_working"), // 1-10
  breakQuality: integer("break_quality"), // 1-10
  handoverSimplicity: integer("handover_simplicity"), // 1-10
  locationConvenience: integer("location_convenience"), // 1-10
  optionalComment: text("optional_comment"),
  createdAt: timestamp("created_at", { mode: "date" })
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .notNull()
    .default(sql`now()`),
});

// ─── Duty Favourites ────────────────────────────────────────

export const dutyFavourites = pgTable("duty_favourites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  dutyTemplateId: integer("duty_template_id")
    .notNull()
    .references(() => dutyTemplates.id),
  kind: text("kind").notNull(), // FAVOURITE, AVOID, INTERESTED
  createdAt: timestamp("created_at", { mode: "date" })
    .notNull()
    .default(sql`now()`),
});

// ─── Import Batches ─────────────────────────────────────────

export const importBatches = pgTable("import_batches", {
  id: serial("id").primaryKey(),
  importType: text("import_type").notNull(), // DUTY_CSV, DUTY_TASK_CSV, ROSTER_CSV, CAPTAIN_CSV, DUTY_JSON
  fileName: text("file_name"),
  status: text("status").notNull().default("PENDING"), // PENDING, PROCESSING, COMPLETED, FAILED
  createdBy: integer("created_by").references(() => users.id),
  summaryJson: jsonb("summary_json").$type<{
    totalRows?: number;
    importedRows?: number;
    skippedRows?: number;
    errorCount?: number;
  }>(),
  errorJson: jsonb("error_json").$type<
    Array<{ row: number; message: string }>
  >(),
  createdAt: timestamp("created_at", { mode: "date" })
    .notNull()
    .default(sql`now()`),
  completedAt: timestamp("completed_at", { mode: "date" }),
});
