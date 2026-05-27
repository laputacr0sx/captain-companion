CREATE TABLE `captain` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`staff_no` text NOT NULL,
	`name` text NOT NULL,
	`base_location` text,
	`preferences_json` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `captain_staff_no_unique` ON `captain` (`staff_no`);--> statement-breakpoint
CREATE TABLE `duty` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`duty_code` text NOT NULL,
	`timetable_code` text,
	`day_type` text,
	`sign_on_location` text,
	`sign_on_time` text,
	`sign_off_location` text,
	`sign_off_time` text,
	`work_minutes` integer,
	`remarks` text,
	`source_file` text,
	`raw_text` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `duty_preference` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`captain_id` integer NOT NULL,
	`preferred_start_period` text,
	`preferred_end_period` text,
	`preferred_locations_json` text,
	`avoid_locations_json` text,
	`max_work_minutes` integer,
	`allow_overnight` integer DEFAULT false,
	`prefer_morning` integer DEFAULT false,
	`prefer_dead_evening` integer DEFAULT false,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`captain_id`) REFERENCES `captain`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `duty_run_segment` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`duty_id` integer NOT NULL,
	`duty_task_id` integer,
	`train_run_id` integer,
	`train_movement_id` integer,
	`sequence_no` integer,
	`source_file` text,
	`confidence` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`duty_id`) REFERENCES `duty`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`duty_task_id`) REFERENCES `duty_task`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`train_run_id`) REFERENCES `train_run`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`train_movement_id`) REFERENCES `train_movement`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `duty_task` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`duty_id` integer NOT NULL,
	`sequence_no` integer NOT NULL,
	`task_type` text NOT NULL,
	`start_time` text,
	`end_time` text,
	`event_time` text,
	`run_no` text,
	`trn` text,
	`from_location` text,
	`from_platform` text,
	`to_location` text,
	`to_platform` text,
	`instruction_text` text,
	`instruction_type` text,
	`raw_text` text,
	`confidence` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`duty_id`) REFERENCES `duty`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `roster_assignment` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`service_date` text NOT NULL,
	`captain_id` integer NOT NULL,
	`published_duty_id` integer NOT NULL,
	`actual_duty_id` integer,
	`status` text DEFAULT 'rostered' NOT NULL,
	`source` text,
	`notes` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`captain_id`) REFERENCES `captain`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`published_duty_id`) REFERENCES `duty`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`actual_duty_id`) REFERENCES `duty`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `swap_request` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`service_date` text NOT NULL,
	`requesting_captain_id` integer NOT NULL,
	`offered_duty_id` integer NOT NULL,
	`wanted_duty_id` integer NOT NULL,
	`preference_type` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`matched_captain_id` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`confirmed_at` integer,
	FOREIGN KEY (`requesting_captain_id`) REFERENCES `captain`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`offered_duty_id`) REFERENCES `duty`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`wanted_duty_id`) REFERENCES `duty`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`matched_captain_id`) REFERENCES `captain`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `train_movement` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`train_run_id` integer NOT NULL,
	`trn` text NOT NULL,
	`direction` text,
	`from_location` text,
	`from_platform` text,
	`to_location` text,
	`to_platform` text,
	`scheduled_departure` text,
	`scheduled_arrival` text,
	`raw_text` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`train_run_id`) REFERENCES `train_run`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `train_run` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`timetable_code` text,
	`run_no` text NOT NULL,
	`day_type` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
