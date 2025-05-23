import { z } from "zod";
import { db } from "../../db";
import { publicProcedure } from "../init";

export const placesRouter = {
	getById: publicProcedure
		.input(
			z.object({
				id: z.string(),
			}),
		)
		.query(async ({ input: { id } }) => {
			return await db.query.places.findFirst({
				where: (t, { eq }) => eq(t.id, id),
			});
		}),
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

			let nextCursor: typeof cursor | null = null;
			if (places.length > limit) {
				const nextPlace = places.pop();
				nextCursor = nextPlace?.id ?? null;
			}

			return {
				items: places,
				nextCursor,
			};
		}),
};
