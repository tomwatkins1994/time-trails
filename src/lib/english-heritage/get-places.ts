import { z } from "zod";
import { EHPlaceSchema } from "./types/place";
import { EH_BASE_URL } from "./constants";

export const EHPlacesResultSchema = z.object({
	Total: z.number(),
	Results: EHPlaceSchema.array(),
});

export type EHPlacesResult = z.infer<typeof EHPlacesResultSchema>;

export async function getPlaces(): Promise<EHPlacesResult> {
	const response = await fetch(`${EH_BASE_URL}/api/PropertySearch/GetAll`);
	if (!response.ok) {
		throw new Error("Network response was not ok");
	}
	const data = await response.json();
	const parsedData = EHPlacesResultSchema.parse(data);
	return parsedData;
}
