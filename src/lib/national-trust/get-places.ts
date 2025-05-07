import { z } from "zod";
import { NTPlaceSchema } from "./types/place";

export const NTPlacesResultSchema = z.object({
    multiMatch: z.object({
        input: z.string(),
        results: NTPlaceSchema.array(),
        aggregations: z.string().nullable(),
    })
});

export type NTPlacesResult = z.infer<typeof NTPlacesResultSchema>;

export async function getPlaces(): Promise<NTPlacesResult> {
  const response = await fetch('https://www.nationaltrust.org.uk/api/search/places?query=&lat=52&lon=0&milesRadius=1000&maxPlaceResults=1000');
  if (!response.ok) {
    throw new Error('Network response was not ok'); 
  }
  const data = await response.json();
  const parsedData = NTPlacesResultSchema.parse(data);
  return parsedData;
}