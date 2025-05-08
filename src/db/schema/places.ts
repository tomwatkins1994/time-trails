import { pgEnum, pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const placeManager = pgEnum("place_manager", ["NATIONAL_TRUST"]);

export const placesTable = pgTable("places", {
	id: uuid().primaryKey(),
	name: varchar({ length: 255 }).notNull(),
	description: varchar({ length: 255 }).notNull(),
	town: varchar(),
	county: varchar(),
	imageUrl: varchar(),
	managedBy: placeManager(),
	managerId: varchar(),
	managerWebsiteUrl: varchar(),
});
