import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";
import { QueryClient } from "@tanstack/react-query";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import superjson from "superjson";

import { routeTree } from "./routeTree.gen";
import { TRPCProvider } from "@/trpc/react";
import { trpcClient } from "@/trpc/client";

export function createRouter() {
	const queryClient = new QueryClient({
		defaultOptions: {
			dehydrate: { serializeData: superjson.serialize },
			hydrate: { deserializeData: superjson.deserialize },
		},
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
