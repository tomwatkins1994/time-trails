import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";
import { QueryClient } from "@tanstack/react-query";
import { createTRPCClient, httpBatchStreamLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import superjson from "superjson";

import { routeTree } from "./routeTree.gen";
import type { TRPCRouter } from "./trpc/router";
import { TRPCProvider } from "./trpc/react";

function getUrl() {
	const base = (() => {
		if (typeof window !== "undefined") return "";
		if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
		return `http://localhost:${process.env.PORT ?? 3000}`;
	})();
	return `${base}/api/trpc`;
}

export function createRouter() {
	const queryClient = new QueryClient({
		defaultOptions: {
			dehydrate: { serializeData: superjson.serialize },
			hydrate: { deserializeData: superjson.deserialize },
		},
	});

	const trpcClient = createTRPCClient<TRPCRouter>({
		links: [
			httpBatchStreamLink({
				transformer: superjson,
				url: getUrl(),
			}),
		],
	});

	const serverHelpers = createTRPCOptionsProxy({
		client: trpcClient,
		queryClient: queryClient,
	});

	const router = createTanStackRouter({
		routeTree,
		context: {
			queryClient,
			trpcQuery: serverHelpers,
		},
		defaultPreload: "intent",
		// defaultErrorComponent: DefaultCatchBoundary,
		// defaultNotFoundComponent: () => <NotFound />,
		scrollRestoration: true,
		defaultPreloadStaleTime: 0,
		Wrap: (props: { children: React.ReactNode }) => {
			return (
				<TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
					{props.children}
				</TRPCProvider>
			);
		},
	});

	return routerWithQueryClient(router, queryClient);
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof createRouter>;
	}
}
