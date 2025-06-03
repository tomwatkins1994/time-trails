import { TRPCClientError } from "@trpc/client";
import { observable } from "@trpc/server/observable";

import type { OperationResultEnvelope, TRPCLink } from "@trpc/client";
import type { AnyTRPCRouter } from "@trpc/server";

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
