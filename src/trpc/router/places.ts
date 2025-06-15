import { z } from "zod";
import { and, ilike, inArray, gte, sql, gt } from "drizzle-orm";
import { db } from "../../db";
import { publicProcedure } from "../init";
import { places } from "@/db/schema";
import { redis } from "@/db/redis";
import { D } from "node_modules/@upstash/redis/zmscore-DzNHSWxc.mjs";
import { cachedQuery } from "@/db/cached-query";
import { Input } from "@/components/ui/input";

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
				search?.name ? ilike(places.name, `%${search.name}%`) : undefined,
				search?.managedBy && search.managedBy.length > 0
					? // biome-ignore lint/suspicious/noExplicitAny: Will deal with enum issue later
						inArray(places.managedBy, search.managedBy as any)
					: undefined,
			);

			const [items, count] = await Promise.all([
				db.query.places.findMany({
					where: (t) => and(cursor ? gte(t.id, cursor) : undefined, baseFilter),
					orderBy: (t, { asc }) => asc(t.id),
					limit: limit + 1,
				}),
				db.$count(places, baseFilter),
			]);

			let nextCursor: typeof cursor | null = null;
			if (items.length > limit) {
				const nextPlace = items.pop();
				nextCursor = nextPlace?.id ?? null;
			}

			return {
				items,
				count,
				nextCursor,
			};
		}),
	getRandomImages: publicProcedure
		.input(
			z.object({
				number: z.number(),
			}),
		)
		.query(async ({ input: { number } }) => {
			return await cachedQuery(
				"random_place_images",
				{ number },
				() =>
					db
						.select({
							id: places.id,
							name: places.name,
							imageUrl: places.imageUrl,
							imageDescription: places.imageDescription,
							imageCredit: places.imageCredit,
							imageBlurhash: places.imageBlurhash,
						})
						.from(places)
						.where((t) => gt(t.imageUrl, ""))
						.limit(number)
						.orderBy(sql`RANDOM()`),
				{ ex: 3600 }, // 1 hour
			);
		}),
};
