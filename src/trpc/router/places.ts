import { db } from "../../db";
import { publicProcedure } from "../init";

export const placesRouter = {
	list: publicProcedure.query(async () => {
		const places = await db.query.places.findMany();
		return places;
	}),
};
