import { createCallerFactory } from "@trpc/server/unstable-core-do-not-import";
import { createTrpcRouter } from "../init";
import { placesRouter } from "./places";

export const trpcRouter = createTrpcRouter({
	places: placesRouter,
});

export type TRPCRouter = typeof trpcRouter;

export const createCaller = createCallerFactory()(trpcRouter);
