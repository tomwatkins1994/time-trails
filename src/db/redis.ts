import { Redis } from "@upstash/redis";
import { z } from "zod";

const { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } = z
	.object({
		UPSTASH_REDIS_REST_URL: z.string(),
		UPSTASH_REDIS_REST_TOKEN: z.string(),
	})
	.parse(process.env);

export const redis = new Redis({
	url: UPSTASH_REDIS_REST_URL,
	token: UPSTASH_REDIS_REST_TOKEN,
});
