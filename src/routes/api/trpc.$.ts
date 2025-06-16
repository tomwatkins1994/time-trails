import { createServerFileRoute } from "@tanstack/react-start/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { trpcRouter } from "@/trpc/router";
import { createContext } from "@/trpc/init";

function handler({ request }: { request: Request }) {
	return fetchRequestHandler({
		req: request,
		router: trpcRouter,
		endpoint: "/api/trpc",
		createContext: async () => {
			return createContext({
				req: request,
				res: undefined,
			});
		},
	});
}

export const ServerRoute = createServerFileRoute("/api/trpc/$").methods({
	GET: handler,
	POST: handler,
});
