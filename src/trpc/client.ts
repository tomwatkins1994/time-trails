import { createTRPCClient, httpBatchStreamLink } from "@trpc/client";
import type { TRPCRouter } from "./router";
import superjson from "superjson";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getHeaders } from "@tanstack/react-start/server";

const getIncomingHeaders = createIsomorphicFn()
	.client(() => ({}))
	.server(() => getHeaders());

function getUrl() {
	const base = (() => {
		if (typeof window !== "undefined") return "";
		if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
		return `http://localhost:${process.env.PORT ?? 3000}`;
	})();
	return `${base}/api/trpc`;
}

export const trpcClient = createTRPCClient<TRPCRouter>({
	links: [
		httpBatchStreamLink({
			headers: getIncomingHeaders(),
			transformer: superjson,
			url: getUrl(),
		}),
	],
});
