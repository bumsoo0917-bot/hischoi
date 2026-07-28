CREATE TABLE `player_progress` (
	`email` text PRIMARY KEY NOT NULL,
	`display_name` text NOT NULL,
	`current_gold` integer DEFAULT 0 NOT NULL,
	`total_gold` integer DEFAULT 0 NOT NULL,
	`bosses_defeated` integer DEFAULT 0 NOT NULL,
	`lesson_1_bosses` integer DEFAULT 0 NOT NULL,
	`lesson_2_bosses` integer DEFAULT 0 NOT NULL,
	`defeated_json` text DEFAULT '{}' NOT NULL,
	`updated_at` integer NOT NULL
);
