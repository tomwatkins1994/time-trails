import type { NTPlace } from "./types/place";

interface NTPlacesResult {
    multiMatch: {
        input: string;
        results: NTPlace[]
        aggregations?: string[]
    }
}

export async function getPlaces(): Promise<NTPlacesResult> {
  const response = await fetch('https://www.nationaltrust.org.uk/api/search/places?query=&lat=52&lon=0&milesRadius=1000&maxPlaceResults=1000');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json() as NTPlacesResult;
  return data;
}