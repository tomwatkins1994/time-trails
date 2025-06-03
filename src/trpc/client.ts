import { createTRPCClient, httpBatchStreamLink } from "@trpc/client";
import { trpcRouter, type TRPCRouter } from "./router";
import superjson from "superjson";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
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
				const req = getWebRequest();
				if (!req) throw Error("No request found");
				const session = await auth.api.getSession({
					headers: req.headers,
				});
				return {
					req,
					session,
				};
			},
		}),
	);

export const trpcClient = createTRPCClient<TRPCRouter>({
	links: [isomorphicLink()],
});
