import { z } from "zod";
import { db } from "../../db";
import { publicProcedure } from "../init";

export const placesRouter = {
	infiniteList: publicProcedure
		.input(
			z.object({
				cursor: z.string().nullable(),
				limit: z.number().default(12),
			}),
		)
		.query(async ({ input: { cursor, limit } }) => {
			const places = await db.query.places.findMany({
				where: (t, { gte }) => (cursor ? gte(t.id, cursor) : undefined),
				orderBy: (t, { asc }) => asc(t.id),
				limit: limit + 1,
			});

			let nextCursor: typeof cursor | undefined = undefined;
			if (places.length > limit) {
				const nextPlace = places.pop();
				nextCursor = nextPlace?.id;
			}

			return {
				items: places,
				nextCursor,
			};
		}),
};
