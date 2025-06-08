import { pgEnum, pgTable, unique, uuid, varchar } from "drizzle-orm/pg-core";

export const placeManager = pgEnum("place_manager", [
	"NATIONAL_TRUST",
	"ENGLISH_HERITAGE",
]);

export const places = pgTable(
	"places",
	{
		id: uuid().primaryKey().defaultRandom(),
		name: varchar().notNull(),
		description: varchar().notNull(),
		town: varchar(),
		county: varchar(),
		imageUrl: varchar(),
		imageDescription: varchar(),
		imageCredit: varchar(),
		imageBlurhash: varchar(),
		managedBy: placeManager(),
		managerId: varchar(),
		managerWebsiteUrl: varchar(),
	},
	(t) => [unique().on(t.managedBy, t.managerId).nullsNotDistinct()],
);
