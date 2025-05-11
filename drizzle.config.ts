import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { z } from "zod";

const DATABASE_URL = z.string().parse(process.env.DATABASE_URL);

export default defineConfig({
	out: "./drizzle",
	schema: "./src/db/schema",
	dialect: "postgresql",
	dbCredentials: {
		url: DATABASE_URL,
	},
	casing: "snake_case",
});
