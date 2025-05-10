import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import path from "node:path";
import { afterEach, beforeEach } from "node:test";
import { afterAll, beforeAll, vi } from "vitest";
import { db } from "@/db";

const POSTGRES_USER = "postgres";
const POSTGRES_PASSWORD = "postgres";
const POSTGRES_DB = "time_trails";

const container = await new PostgreSqlContainer()
	.withEnvironment({
		POSTGRES_USER: POSTGRES_USER,
		POSTGRES_PASSWORD: POSTGRES_PASSWORD,
		POSTGRES_DB: POSTGRES_DB,
	})
	.withExposedPorts(5432)
	.start();

vi.mock("@/db", async (importOriginal) => {
	const db = await setupTestDb();
	return {
		...(await importOriginal()),
		db,
	};
});

beforeAll(async () => {
	const migrationPath = path.join(process.cwd(), "drizzle");
	await migrate(db, {
		migrationsFolder: migrationPath,
	});
});

afterAll(async () => {
	container.stop();
});

async function setupTestDb() {
	const connectionString = `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${container.getHost()}:${container.getFirstMappedPort()}/${POSTGRES_DB}`;
	const db = drizzle(connectionString);
	return db;
}
