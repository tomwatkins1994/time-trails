import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { z } from "zod";
import * as schema from "./schema";

const DATABASE_URL = z.string().parse(process.env.DATABASE_URL);

export const db = drizzle(DATABASE_URL, { schema });
