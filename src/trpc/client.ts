import {
	createTRPCClient,
	httpBatchStreamLink,
	TRPCClientError,
} from "@trpc/client";
import type { OperationResultEnvelope, TRPCLink } from "@trpc/client";
import { trpcRouter, type TRPCRouter } from "./router";
import superjson from "superjson";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { observable } from "@trpc/server/observable";
import type { AnyTRPCRouter } from "@trpc/server";
import { auth } from "@/lib/auth";

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

export function serverLink<
	TRouter extends AnyTRPCRouter,
	TContext extends TRouter["_def"]["_config"]["$types"]["ctx"],
>({
	router,
	createContext,
}: {
	router: TRouter;
	createContext: () => TContext | Promise<TContext>;
}): TRPCLink<TRouter> {
	return () =>
		({ op }) =>
			observable<
				OperationResultEnvelope<unknown, unknown>,
				TRPCClientError<TRouter>
			>((observer) => {
				async function execute() {
					const context = { ...op.context, ...(await createContext()) };
					const caller = router.createCaller(context);
					try {
						const procedure = caller[op.path];
						if (typeof procedure === "function") {
							const data = await procedure(op.input);
							observer.next({
								context,
								result: { data, type: "data" },
							});
						}
						observer.complete();
					} catch (err) {
						observer.error(TRPCClientError.from(err as Error));
					}
				}

				void execute();
			});
}
