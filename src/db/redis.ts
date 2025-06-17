import "dotenv/config";
import { Redis, type RedisConfigNodejs } from "@upstash/redis";
import { z } from "zod";

export function createRedis(options: RedisConfigNodejs) {
	return new Redis(options);
}

export const redis = (() => {
	if (process.env.NODE_ENV === "test") {
		return {} as ReturnType<typeof createRedis>;
	}

	const { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } = z
		.object({
			UPSTASH_REDIS_REST_URL: z.string(),
			UPSTASH_REDIS_REST_TOKEN: z.string(),
		})
		.parse(process.env);

	return createRedis({
		url: UPSTASH_REDIS_REST_URL,
		token: UPSTASH_REDIS_REST_TOKEN,
	});
})();
