import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { upstashCache } from "drizzle-orm/cache/upstash";
import { z } from "zod";
import * as schema from "./schema";

export interface DBOptions {
	url: string;
}
export function setupDb({ url }: DBOptions) {
	return drizzle(url, {
		schema,
		casing: "snake_case",
	});
}

const { DATABASE_URL } = z
	.object({
		DATABASE_URL: z.string(),
	})
	.parse(process.env);

export const db = setupDb({
	url: DATABASE_URL,
});
