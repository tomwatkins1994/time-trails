import {
	createTRPCClient,
	httpBatchStreamLink,
	experimental_localLink as localLink,
} from "@trpc/client";
import superjson from "superjson";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import { createContext } from "@/trpc/init";
import { trpcRouter } from "@/trpc/router";

import type { TRPCRouter } from "@/trpc/router";

const isomorphicLink = createIsomorphicFn()
	.client(() =>
		httpBatchStreamLink({
			transformer: superjson,
			url: "/api/trpc",
		}),
	)
	.server(() =>
		localLink({
			router: trpcRouter,
			transformer: superjson,
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
