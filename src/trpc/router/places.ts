import { z } from "zod";
import { db } from "../../db";
import { publicProcedure } from "../init";
import * as schema from "@/db/schema";
import { and, ilike, inArray } from "drizzle-orm";

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
			const baseFilter = and(
				search?.name
					? ilike(schema.places.name, `%${search.name}%`)
					: undefined,
				search?.managedBy && search.managedBy.length > 0
					? // biome-ignore lint/suspicious/noExplicitAny: Will deal with enum issue later
						inArray(schema.places.managedBy, search.managedBy as any)
					: undefined,
			);

			const places = await db.query.places.findMany({
				where: (t, { and, gte }) =>
					and(cursor ? gte(t.id, cursor) : undefined, baseFilter),
				orderBy: (t, { asc }) => asc(t.id),
				limit: limit + 1,
			});

			const count = await db.$count(schema.places, baseFilter);

			let nextCursor: typeof cursor | null = null;
			if (places.length > limit) {
				const nextPlace = places.pop();
				nextCursor = nextPlace?.id ?? null;
			}

			return {
				items: places,
				count,
				nextCursor,
			};
		}),
};
