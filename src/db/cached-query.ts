import type { SetCommandOptions } from "@upstash/redis";
import { createHash } from "node:crypto";
import { redis } from "./redis";

// biome-ignore lint/suspicious/noExplicitAny: Could be anything
function generateCacheKey(key: string, args: any): string {
	const raw = `${key}:${JSON.stringify(args)}`;
	return `query_cache:${createHash("sha256").update(raw).digest("hex")}`;
}

export async function cachedQuery<T>(
	key: string,
	// biome-ignore lint/suspicious/noExplicitAny: Could be anything
	args: any,
	query: () => Promise<T>,
	opts?: SetCommandOptions,
): Promise<T> {
	const cacheKey = generateCacheKey(key, args);
	const cachedResult = await redis.get<T>(cacheKey);
	if (cachedResult) {
		return cachedResult;
	}

	const result = await query();
	await redis.set(cacheKey, result, opts);

	return result;
}
