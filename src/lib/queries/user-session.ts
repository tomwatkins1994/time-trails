import { queryOptions } from "@tanstack/react-query";
import { authClient } from "../auth/client";

export const userSessionQueryOptions = queryOptions({
	queryKey: ["user_session"],
	queryFn: () => authClient.getSession(),
});
