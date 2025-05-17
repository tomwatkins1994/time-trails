import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import path from "node:path";
import { afterAll, beforeAll, vi } from "vitest";
import { setupDb } from "@/db";

const container = await new PostgreSqlContainer("postgres:17.5").start();
const db = setupDb(container.getConnectionUri());

vi.doMock("@/db", async (importOriginal) => {
	return {
		...(await importOriginal()),
		db,
	};
});

beforeAll(async () => {
	await migrate(db, {
		migrationsFolder: path.join(process.cwd(), "drizzle"),
	});
});

afterAll(async () => {
	container.stop();
});
