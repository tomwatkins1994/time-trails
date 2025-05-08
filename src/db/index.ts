import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { z } from "zod";

const DATABASE_URL = z.string().parse(process.env.DATABASE_URL);

export const db = drizzle(DATABASE_URL);
