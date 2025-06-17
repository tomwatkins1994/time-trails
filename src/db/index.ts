import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { upstashCache } from "drizzle-orm/cache/upstash";
import { Pool } from "pg";
import { z } from "zod";
import * as schema from "./schema";

const isTest = process.env.NODE_ENV === "test";

export interface DBOptions {
	url: string;
	cache: {
		url: string;
		token: string;
	};
}

export function setupDb({ url, cache }: DBOptions) {
	const pool = new Pool({
		connectionString: url,
	});
	return {
		pool,
		db: drizzle(pool, {
			schema,
			casing: "snake_case",
			cache: upstashCache({
				url: cache.url,
				token: cache.token,
			}),
		}),
	};
}

export const { db } = (() => {
	if (process.env.NODE_ENV === "test") {
		return {} as ReturnType<typeof setupDb>;
	}

	const { DATABASE_URL, UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } = z
		.object({
			DATABASE_URL: z.string(),
			UPSTASH_REDIS_REST_URL: z.string(),
			UPSTASH_REDIS_REST_TOKEN: z.string(),
		})
		.parse(process.env);

	return setupDb({
		url: DATABASE_URL,
		cache: {
			url: UPSTASH_REDIS_REST_URL,
			token: UPSTASH_REDIS_REST_TOKEN,
		},
	});
})();
