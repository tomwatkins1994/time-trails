import { createTrpcRouter } from "../init";
import { placesRouter } from "./places";

export const trpcRouter = createTrpcRouter({
	places: placesRouter,
});

export type TRPCRouter = typeof trpcRouter;
