CREATE TABLE `ai_recommendations` (
	`id` varchar(36) NOT NULL,
	`mission_id` varchar(36) NOT NULL,
	`recommendation_type` varchar(60) NOT NULL,
	`payload` json NOT NULL,
	`score` decimal(5,2),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ai_recommendations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `assignments` (
	`id` varchar(36) NOT NULL,
	`personnel_id` varchar(36) NOT NULL,
	`unit_id` varchar(36) NOT NULL,
	`role_title` varchar(120),
	`start_date` date NOT NULL,
	`end_date` date,
	`reason` text,
	CONSTRAINT `assignments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36),
	`action` varchar(120) NOT NULL,
	`entity` varchar(120) NOT NULL,
	`entity_id` varchar(36),
	`ip_address` varchar(80),
	`user_agent` text,
	`metadata` json,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `audit_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `grades` (
	`id` varchar(36) NOT NULL,
	`name` varchar(100) NOT NULL,
	`rank_order` int NOT NULL,
	`category` varchar(80),
	CONSTRAINT `grades_id` PRIMARY KEY(`id`),
	CONSTRAINT `grades_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `military_personnel` (
	`id` varchar(36) NOT NULL,
	`service_number` varchar(80) NOT NULL,
	`first_name` varchar(120) NOT NULL,
	`last_name` varchar(120) NOT NULL,
	`gender` varchar(20) NOT NULL,
	`birth_date` date,
	`grade_id` varchar(36) NOT NULL,
	`unit_id` varchar(36) NOT NULL,
	`availability_status` enum('AVAILABLE','ASSIGNED','ON_LEAVE','TRAINING','UNAVAILABLE') NOT NULL DEFAULT 'AVAILABLE',
	`health_status` varchar(40),
	`enlistment_date` date,
	`archived_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `military_personnel_id` PRIMARY KEY(`id`),
	CONSTRAINT `personnel_service_number_idx` UNIQUE(`service_number`)
);
--> statement-breakpoint
CREATE TABLE `mission_personnel` (
	`mission_id` varchar(36) NOT NULL,
	`personnel_id` varchar(36) NOT NULL,
	`assignment_role` varchar(120),
	`assigned_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `mission_personnel_mission_id_personnel_id_pk` PRIMARY KEY(`mission_id`,`personnel_id`)
);
--> statement-breakpoint
CREATE TABLE `mission_units` (
	`mission_id` varchar(36) NOT NULL,
	`unit_id` varchar(36) NOT NULL,
	`assigned_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `mission_units_mission_id_unit_id_pk` PRIMARY KEY(`mission_id`,`unit_id`)
);
--> statement-breakpoint
CREATE TABLE `missions` (
	`id` varchar(36) NOT NULL,
	`operation_id` varchar(36) NOT NULL,
	`title` varchar(180) NOT NULL,
	`description` text,
	`required_skills` json,
	`risk_level` enum('LOW','MEDIUM','HIGH','CRITICAL') NOT NULL DEFAULT 'MEDIUM',
	`status` enum('PLANNED','IN_PROGRESS','SUSPENDED','COMPLETED','CANCELLED') NOT NULL DEFAULT 'PLANNED',
	`start_date` date,
	`end_date` date,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `missions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `operations` (
	`id` varchar(36) NOT NULL,
	`code` varchar(80) NOT NULL,
	`title` varchar(180) NOT NULL,
	`objective` text NOT NULL,
	`priority` enum('LOW','MEDIUM','HIGH','CRITICAL') NOT NULL,
	`area` varchar(160),
	`status` enum('PLANNED','IN_PROGRESS','SUSPENDED','COMPLETED','CANCELLED') NOT NULL DEFAULT 'PLANNED',
	`start_date` date,
	`end_date` date,
	`created_by_id` varchar(36) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `operations_id` PRIMARY KEY(`id`),
	CONSTRAINT `operations_code_idx` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `permissions` (
	`id` varchar(36) NOT NULL,
	`key` varchar(120) NOT NULL,
	`description` text,
	CONSTRAINT `permissions_id` PRIMARY KEY(`id`),
	CONSTRAINT `permissions_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `personnel_skills` (
	`personnel_id` varchar(36) NOT NULL,
	`skill_id` varchar(36) NOT NULL,
	`level` int NOT NULL,
	`certified_at` date,
	CONSTRAINT `personnel_skills_personnel_id_skill_id_pk` PRIMARY KEY(`personnel_id`,`skill_id`)
);
--> statement-breakpoint
CREATE TABLE `refresh_tokens` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`token_hash` text NOT NULL,
	`expires_at` timestamp NOT NULL,
	`revoked_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `refresh_tokens_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reports` (
	`id` varchar(36) NOT NULL,
	`title` varchar(180) NOT NULL,
	`type` varchar(60) NOT NULL,
	`operation_id` varchar(36),
	`mission_id` varchar(36),
	`generated_by_id` varchar(36) NOT NULL,
	`file_path` text,
	`summary` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `role_permissions` (
	`role_id` varchar(36) NOT NULL,
	`permission_id` varchar(36) NOT NULL,
	CONSTRAINT `role_permissions_role_id_permission_id_pk` PRIMARY KEY(`role_id`,`permission_id`)
);
--> statement-breakpoint
CREATE TABLE `roles` (
	`id` varchar(36) NOT NULL,
	`name` varchar(80) NOT NULL,
	`description` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `roles_id` PRIMARY KEY(`id`),
	CONSTRAINT `roles_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `skills` (
	`id` varchar(36) NOT NULL,
	`name` varchar(120) NOT NULL,
	`category` varchar(80),
	`description` text,
	CONSTRAINT `skills_id` PRIMARY KEY(`id`),
	CONSTRAINT `skills_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `units` (
	`id` varchar(36) NOT NULL,
	`name` varchar(160) NOT NULL,
	`code` varchar(50) NOT NULL,
	`type` varchar(80) NOT NULL,
	`location` varchar(160),
	`parent_unit_id` varchar(36),
	`status` varchar(30) NOT NULL DEFAULT 'ACTIVE',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `units_id` PRIMARY KEY(`id`),
	CONSTRAINT `units_code_idx` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(36) NOT NULL,
	`email` varchar(160) NOT NULL,
	`password_hash` text NOT NULL,
	`full_name` varchar(160) NOT NULL,
	`role_id` varchar(36) NOT NULL,
	`status` enum('ACTIVE','DISABLED','LOCKED') NOT NULL DEFAULT 'ACTIVE',
	`last_login_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_idx` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `ai_recommendations` ADD CONSTRAINT `ai_recommendations_mission_id_missions_id_fk` FOREIGN KEY (`mission_id`) REFERENCES `missions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `assignments` ADD CONSTRAINT `assignments_personnel_id_military_personnel_id_fk` FOREIGN KEY (`personnel_id`) REFERENCES `military_personnel`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `assignments` ADD CONSTRAINT `assignments_unit_id_units_id_fk` FOREIGN KEY (`unit_id`) REFERENCES `units`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `military_personnel` ADD CONSTRAINT `military_personnel_grade_id_grades_id_fk` FOREIGN KEY (`grade_id`) REFERENCES `grades`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `military_personnel` ADD CONSTRAINT `military_personnel_unit_id_units_id_fk` FOREIGN KEY (`unit_id`) REFERENCES `units`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `mission_personnel` ADD CONSTRAINT `mission_personnel_mission_id_missions_id_fk` FOREIGN KEY (`mission_id`) REFERENCES `missions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `mission_personnel` ADD CONSTRAINT `mission_personnel_personnel_id_military_personnel_id_fk` FOREIGN KEY (`personnel_id`) REFERENCES `military_personnel`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `mission_units` ADD CONSTRAINT `mission_units_mission_id_missions_id_fk` FOREIGN KEY (`mission_id`) REFERENCES `missions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `mission_units` ADD CONSTRAINT `mission_units_unit_id_units_id_fk` FOREIGN KEY (`unit_id`) REFERENCES `units`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `missions` ADD CONSTRAINT `missions_operation_id_operations_id_fk` FOREIGN KEY (`operation_id`) REFERENCES `operations`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `operations` ADD CONSTRAINT `operations_created_by_id_users_id_fk` FOREIGN KEY (`created_by_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `personnel_skills` ADD CONSTRAINT `personnel_skills_personnel_id_military_personnel_id_fk` FOREIGN KEY (`personnel_id`) REFERENCES `military_personnel`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `personnel_skills` ADD CONSTRAINT `personnel_skills_skill_id_skills_id_fk` FOREIGN KEY (`skill_id`) REFERENCES `skills`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `refresh_tokens` ADD CONSTRAINT `refresh_tokens_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reports` ADD CONSTRAINT `reports_operation_id_operations_id_fk` FOREIGN KEY (`operation_id`) REFERENCES `operations`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reports` ADD CONSTRAINT `reports_mission_id_missions_id_fk` FOREIGN KEY (`mission_id`) REFERENCES `missions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reports` ADD CONSTRAINT `reports_generated_by_id_users_id_fk` FOREIGN KEY (`generated_by_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_role_id_roles_id_fk` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_permission_id_permissions_id_fk` FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_role_id_roles_id_fk` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `audit_user_idx` ON `audit_logs` (`user_id`);--> statement-breakpoint
CREATE INDEX `audit_created_idx` ON `audit_logs` (`created_at`);--> statement-breakpoint
CREATE INDEX `personnel_grade_idx` ON `military_personnel` (`grade_id`);--> statement-breakpoint
CREATE INDEX `personnel_unit_idx` ON `military_personnel` (`unit_id`);--> statement-breakpoint
CREATE INDEX `personnel_availability_idx` ON `military_personnel` (`availability_status`);--> statement-breakpoint
CREATE INDEX `missions_operation_idx` ON `missions` (`operation_id`);--> statement-breakpoint
CREATE INDEX `missions_status_idx` ON `missions` (`status`);--> statement-breakpoint
CREATE INDEX `operations_status_idx` ON `operations` (`status`);--> statement-breakpoint
CREATE INDEX `operations_priority_idx` ON `operations` (`priority`);--> statement-breakpoint
CREATE INDEX `units_parent_idx` ON `units` (`parent_unit_id`);--> statement-breakpoint
CREATE INDEX `users_role_idx` ON `users` (`role_id`);