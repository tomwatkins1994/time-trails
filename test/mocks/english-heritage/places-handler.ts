import { http, HttpResponse } from "msw";
import placesJson from "./places.json";
import { EH_BASE_URL } from "@/lib/english-heritage/constants";

export const placesHandler = http.get(
	`${EH_BASE_URL}/api/PropertySearch/GetAll`,
	() => {
		return HttpResponse.json(placesJson);
	},
);
