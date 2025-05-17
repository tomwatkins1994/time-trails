import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { z } from "zod";
import * as schema from "./schema";

export function setupDb(url: string) {
	return drizzle(url, { schema, casing: "snake_case" });
}

const DATABASE_URL = z.string().parse(process.env.DATABASE_URL);

export const db = setupDb(DATABASE_URL);
