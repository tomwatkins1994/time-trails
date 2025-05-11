import { pgEnum, pgTable, unique, uuid, varchar } from "drizzle-orm/pg-core";

export const placeManager = pgEnum("place_manager", ["NATIONAL_TRUST"]);

export const places = pgTable(
	"places",
	{
		id: uuid().primaryKey().defaultRandom(),
		name: varchar({ length: 255 }).notNull(),
		description: varchar({ length: 255 }).notNull(),
		town: varchar(),
		county: varchar(),
		imageUrl: varchar(),
		managedBy: placeManager(),
		managerId: varchar(),
		managerWebsiteUrl: varchar(),
	},
	(t) => [unique().on(t.managedBy, t.managerId).nullsNotDistinct()],
);
