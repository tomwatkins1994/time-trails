import { publicProcedure } from "../init";

export const authRouter = {
	getSession: publicProcedure.query(({ ctx }) => ctx.session),
};
