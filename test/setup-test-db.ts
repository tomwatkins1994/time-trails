import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { RedisContainer } from "@testcontainers/redis";
import { GenericContainer } from "testcontainers";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import path from "node:path";
import { afterAll, vi } from "vitest";
import { setupDb } from "@/db";
import { createRedis } from "@/db/redis";

const dbContainer = await new PostgreSqlContainer("postgres:17.5").start();
const redisContainer = await new RedisContainer("redis:8.0.2").start();
const upstashUrl = redisContainer.getHost();
const upstashToken = "example_token";
const upstashContainer = await new GenericContainer(
	"hiett/serverless-redis-http:latest",
)
	.withExposedPorts(8079)
	.withEnvironment({
		SRH_MODE: "env",
		SRH_TOKEN: upstashToken,
		SRH_CONNECTION_STRING: upstashUrl,
	})
	.start();

const db = setupDb({
	url: dbContainer.getConnectionUri(),
	cache: {
		url: upstashUrl,
		token: upstashToken,
	},
});

await migrate(db, {
	migrationsFolder: path.join(process.cwd(), "drizzle"),
});

vi.doMock("@/db", async (importOriginal) => {
	return {
		...(await importOriginal()),
		db,
	};
});

vi.doMock("@/db/redis", async (importOriginal) => {
	return {
		...(await importOriginal()),
		redis: createRedis({
			url: upstashUrl,
			token: upstashToken,
		}),
	};
});

afterAll(async () => {
	dbContainer.stop();
	redisContainer.stop();
	upstashContainer.stop();
});
