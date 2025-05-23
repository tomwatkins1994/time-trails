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
		imageDescription: place.imageDescription,
		imageCredit: place.links
			.map((link) => {
				if ("imageLink" in link) {
					return link.imageLink.credit;
				}
			})
			.filter(Boolean)[0],
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
				name: sql`excluded.name`,
				description: sql`excluded.description`,
				town: sql`excluded.town`,
				county: sql`excluded.county`,
				imageUrl: sql`excluded.image_url`,
				imageDescription: sql`excluded.image_description`,
				imageCredit: sql`excluded.image_credit`,
				managerWebsiteUrl: sql`excluded.manager_website_url`,
			},
		});
}
