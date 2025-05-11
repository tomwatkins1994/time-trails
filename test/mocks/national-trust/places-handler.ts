import { http, HttpResponse } from "msw";
import placesJson from "./places.json";

export const placesHandler = http.get(
	"https://www.nationaltrust.org.uk/api/search/places",
	() => {
		return HttpResponse.json(placesJson);
	},
);
