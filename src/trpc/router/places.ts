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
				search: z
					.object({
						name: z.string().nullable().optional(),
						managedBy: z.string().array().optional(),
					})
					.optional(),
			}),
		)
		.query(async ({ input: { cursor, limit, search } }) => {
			const places = await db.query.places.findMany({
				where: (t, { and, gte, ilike, inArray }) =>
					and(
						cursor ? gte(t.id, cursor) : undefined,
						search?.name ? ilike(t.name, `%${search.name}%`) : undefined,
						search?.managedBy
							? // biome-ignore lint/suspicious/noExplicitAny: Will deal with enum issue later
								inArray(t.managedBy, search.managedBy as any)
							: undefined,
					),
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
