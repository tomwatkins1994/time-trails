import { auth } from "@/lib/auth";
import { initTRPC } from "@trpc/server";
import superjson from "superjson";

export interface CreateContextOptions {
	req: Request;
	res?: Response;
}

export const createContext = async (opts: CreateContextOptions) => {
	const session = await auth.api.getSession({ headers: opts.req.headers });

	return {
		req: opts.req,
		res: opts.res,
		session,
	};
};

const t = initTRPC.context<typeof createContext>().create({
	transformer: superjson,
});

export const createTrpcRouter = t.router;
export const publicProcedure = t.procedure;
export const callerFactory = t.createCallerFactory;
