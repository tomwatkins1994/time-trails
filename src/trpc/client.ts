import { createTRPCClient, httpBatchStreamLink } from "@trpc/client";
import { trpcRouter, type TRPCRouter } from "./router";
import superjson from "superjson";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "@/lib/auth";
import { serverLink } from "./server-link";

const isomorphicLink = createIsomorphicFn()
	.client(() =>
		httpBatchStreamLink({
			transformer: superjson,
			url: "/api/trpc",
		}),
	)
	.server(() =>
		serverLink({
			router: trpcRouter,
			createContext: async () => {
				const headers = new Headers(
					Object.entries(getRequestHeaders())
						.filter(([_, value]) => Boolean(value))
						.map(([name, value]) => [name, value ?? ("" as const)]),
				);
				const session = await auth.api.getSession({
					headers,
				});
				return {
					session,
				};
			},
		}),
	);

export const trpcClient = createTRPCClient<TRPCRouter>({
	links: [isomorphicLink()],
});
