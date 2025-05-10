import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";
import { QueryClient } from "@tanstack/react-query";
import { createTRPCClient, httpBatchStreamLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import superjson from "superjson";

import { routeTree } from "./routeTree.gen";
import type { TRPCRouter } from "./trpc/router";
import { TRPCProvider } from "./trpc/react";

export function createRouter() {
	const queryClient = new QueryClient({
		defaultOptions: {
			dehydrate: { serializeData: superjson.serialize },
			hydrate: { deserializeData: superjson.deserialize },
		},
	});

	function getUrl() {
		const base = (() => {
			if (typeof window !== "undefined") return "";
			return `http://localhost:${process.env.PORT ?? 3000}`;
		})();
		return `${base}/api/trpc`;
	}

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
			trpc: serverHelpers,
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
