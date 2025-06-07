import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { RedisContainer } from "@testcontainers/redis";
import { GenericContainer, Network } from "testcontainers";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import path from "node:path";
import { afterAll, vi } from "vitest";
import { setupDb } from "@/db";
import { createRedis } from "@/db/redis";

const network = await new Network().start();

const dbContainer = await new PostgreSqlContainer("postgres:17.5")
	.withNetworkMode(network.getName())
	.withNetworkAliases("db")
	.start();

const redisContainer = await new RedisContainer("redis:8.0.2")
	.withNetworkMode(network.getName())
	.withNetworkAliases("redis")
	.start();

const upstashToken = "example_token";
const upstashContainer = await new GenericContainer(
	"hiett/serverless-redis-http:latest",
)
	.withExposedPorts(80)
	.withNetworkMode(network.getName())
	.withEnvironment({
		SRH_MODE: "env",
		SRH_TOKEN: upstashToken,
		SRH_CONNECTION_STRING: "redis://redis:6379",
	})
	.start();
const upstashUrl = `http://${upstashContainer.getHost()}:${upstashContainer.getMappedPort(80)}`;

const { db, pool } = setupDb({
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
	await pool.end();
	await Promise.all([
		dbContainer.stop(),
		upstashContainer.stop(),
		redisContainer.stop(),
	]);
	await network.stop();
});
