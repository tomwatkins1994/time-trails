import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import path from "node:path";
import { afterAll, beforeAll, vi } from "vitest";

const POSTGRES_USER = "test";
const POSTGRES_PASSWORD = "test";
const POSTGRES_DB = "test";

const container = await new PostgreSqlContainer()
	.withEnvironment({
		POSTGRES_USER: POSTGRES_USER,
		POSTGRES_PASSWORD: POSTGRES_PASSWORD,
		POSTGRES_DB: POSTGRES_DB,
	})
	.withExposedPorts(5432)
	.start();

const connectionString = `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${container.getHost()}:${container.getFirstMappedPort()}/${POSTGRES_DB}`;
const db = drizzle(connectionString);

vi.doMock("@/db", async (importOriginal) => {
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
