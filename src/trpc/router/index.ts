import { createCallerFactory } from "@trpc/server/unstable-core-do-not-import";
import { createTrpcRouter } from "../init";
import { authRouter } from "./auth";
import { placesRouter } from "./places";

export const trpcRouter = createTrpcRouter({
	auth: authRouter,
	places: placesRouter,
});

export type TRPCRouter = typeof trpcRouter;

export const createCaller = createCallerFactory()(trpcRouter);
