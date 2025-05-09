import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";
import * as TanstackQuery from "./providers/query-client-provider";
import { routeTree } from "./routeTree.gen";
import { QueryClient } from "@tanstack/react-query";

export function createRouter() {
	const queryContext = TanstackQuery.getContext();

	const router = createTanStackRouter({
		routeTree,
		context: {
			...queryContext,
		},
		scrollRestoration: true,
		defaultPreloadStaleTime: 0,
		Wrap: (props: { children: React.ReactNode }) => {
			return <TanstackQuery.Provider>{props.children}</TanstackQuery.Provider>;
		},
	});

	return routerWithQueryClient(router, queryContext.queryClient);
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof createRouter>;
	}
}
