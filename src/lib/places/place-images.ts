import { db } from "@/db";
import { getImageBlurhash } from "../images/get-image-blurhash";
import { places } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function updatePlaceImageBlurhash(placeId: string) {
	const place = await db.query.places.findFirst({
		columns: { imageUrl: true },
		where: (t, { eq }) => eq(t.id, placeId),
	});

	if (!place) throw new Error("Place not found");
	if (!place.imageUrl) return;

	const imageBlurhash = await getImageBlurhash(place.imageUrl);
	await db.update(places).set({ imageBlurhash }).where(eq(places.id, placeId));
}

export async function updatePlacesMissingImageBlurhash() {
	const placesToUpdate = await db.query.places.findMany({
		columns: { id: true },
		where: (t, { and, gt, isNull }) =>
			and(gt(t.imageUrl, ""), isNull(t.imageBlurhash)),
	});

	for (const place of placesToUpdate) {
		await updatePlaceImageBlurhash(place.id);
	}
}
