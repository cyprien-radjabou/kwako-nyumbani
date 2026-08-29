CREATE TABLE `reservations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reference` text NOT NULL,
	`name` text NOT NULL,
	`employee_id` text NOT NULL,
	`phone` text NOT NULL,
	`email` text,
	`department` text,
	`plot` text,
	`model_id` text NOT NULL,
	`model_name` text NOT NULL,
	`price` integer NOT NULL,
	`years` integer NOT NULL,
	`options` text DEFAULT '[]' NOT NULL,
	`options_total` integer DEFAULT 0 NOT NULL,
	`monthly` real NOT NULL,
	`status` text DEFAULT 'received' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `reservations_reference_unique` ON `reservations` (`reference`);