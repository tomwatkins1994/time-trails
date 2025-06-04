import { createTRPCClient, httpBatchStreamLink } from "@trpc/client";
import { trpcRouter, type TRPCRouter } from "./router";
import superjson from "superjson";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import { serverLink } from "./server-link";
import { createContext } from "./init";

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
				return await createContext({
					req,
					res: undefined,
				});
			},
		}),
	);

export const trpcClient = createTRPCClient<TRPCRouter>({
	links: [isomorphicLink()],
});
