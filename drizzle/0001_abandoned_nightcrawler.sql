CREATE TABLE `option_prices` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`key` text NOT NULL,
	`name` text NOT NULL,
	`price` integer NOT NULL,
	`sort_order` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `option_prices_key_unique` ON `option_prices` (`key`);
--> statement-breakpoint
INSERT INTO `option_prices` (`key`, `name`, `price`, `sort_order`, `updated_at`) VALUES
	('equipped-kitchen', 'Cuisine équipée', 1500, 1, 1788036003572),
	('built-in-cupboards', 'Placards intégrés', 900, 2, 1788036003572),
	('air-conditioning', 'Climatisation', 700, 3, 1788036003572),
	('water-heater', 'Chauffe-eau', 350, 4, 1788036003572),
	('solar-installation', 'Installation solaire', 2500, 5, 1788036003572),
	('water-tank', 'Réservoir d’eau', 300, 6, 1788036003572),
	('generator', 'Groupe électrogène', 900, 7, 1788036003572),
	('fence-and-gate', 'Clôture et portail', 3000, 8, 1788036003572),
	('landscaping', 'Aménagement extérieur', 1500, 9, 1788036003572),
	('furniture-appliances', 'Mobilier & électroménager', 2000, 10, 1788036003572);
