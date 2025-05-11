import { sql } from "drizzle-orm";
import { db } from "@/db";
import { places } from "@/db/schema/places";
import { getPlaces } from "./get-places";

export async function upsertPlaces() {
	const ntPlaces = (await getPlaces()).multiMatch.results.map((place) => ({
		name: place.title,
		description: place.description,
		town: place.town,
		county: place.county,
		imageUrl: place.imageUrl,
		managedBy: "NATIONAL_TRUST" as const,
		managerId: place.id.value,
		managerWebsiteUrl: place.websiteUrl,
	}));

	await db
		.insert(places)
		.values(ntPlaces)
		.onConflictDoUpdate({
			target: [places.managedBy, places.managerId],
			set: {
				name: sql`exlucded.name`,
				description: sql`exlucded.description`,
				town: sql`exlucded.town`,
				county: sql`exlucded.county`,
				imageUrl: sql`exlucded.imageUrl`,
				managerWebsiteUrl: sql`exlucded.websiteUrl`,
			},
		});
}
