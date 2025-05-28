import { auth } from "@/lib/auth";
import { initTRPC } from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import superjson from "superjson";

export const createContext = async (opts: CreateNextContextOptions) => {
	const session = await auth.api.getSession({ headers: opts.req.headers });

	return {
		session,
	};
};

const t = initTRPC.context<typeof createContext>().create({
	transformer: superjson,
});

export const createTrpcRouter = t.router;
export const publicProcedure = t.procedure;
export const callerFactory = t.createCallerFactory;
