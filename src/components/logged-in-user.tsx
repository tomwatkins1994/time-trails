import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";
import { Button } from "./ui/button";

export function LoggedInUser() {
	const trpc = useTRPC();
	const { data: session } = useSuspenseQuery(
		trpc.auth.getSession.queryOptions(),
	);

	if (!session) {
		return <Button>Sign In</Button>;
	}

	return <>{session.user.name}</>;
}
