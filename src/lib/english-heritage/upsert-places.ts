import { sql } from "drizzle-orm";
import { db } from "@/db";
import { places } from "@/db/schema/places";
import { getPlaces } from "./get-places";
import { EH_BASE_URL } from "./constants";

export async function upsertPlaces() {
	const ehPlaces = (await getPlaces()).Results.map((place) => ({
		name: place.Title,
		description: place.Summary,
		county: place.County,
		imageUrl: `${EH_BASE_URL}/${place.ImagePath}`,
		imageDescription: place.ImageAlt,
		managedBy: "ENGLISH_HERITAGE" as const,
		managerId: place.ID.toString(),
		managerWebsiteUrl: `${EH_BASE_URL}/${place.Path}`,
	}));

	await db
		.insert(places)
		.values(ehPlaces)
		.onConflictDoUpdate({
			target: [places.managedBy, places.managerId],
			set: {
				name: sql`excluded.name`,
				description: sql`excluded.description`,
				county: sql`excluded.county`,
				imageUrl: sql`excluded.image_url`,
				imageDescription: sql`excluded.image_description`,
				managerWebsiteUrl: sql`excluded.manager_website_url`,
			},
		});
}
