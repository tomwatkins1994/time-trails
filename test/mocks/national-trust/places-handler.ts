import { http, HttpResponse } from "msw";
import placesJson from "./places.json";
import { NT_BASE_URL } from "@/lib/national-trust/constants";

export const placesHandler = http.get(
	`${NT_BASE_URL}/api/search/places`,
	() => {
		return HttpResponse.json(placesJson);
	},
);
