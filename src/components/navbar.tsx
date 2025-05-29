import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";
import { Suspense } from "react";
import { ThemeSwitcher } from "./theme-switcher";
import { TimeTrailsIcon } from "./icons/time-trails-icon";
import { Button } from "./ui/button";

export function NavBar() {
	return (
		<nav className="flex justify-between items-center">
			<div className="flex gap-4 items-center">
				<Link to="/" className="flex gap-2 items-center">
					<TimeTrailsIcon />
					<div className="text-3xl font-medium font-[Cinzel] hidden md:inline-block">
						TIME TRAILS
					</div>
				</Link>
				<div>
					<Link
						to="/places"
						className="text-muted-foreground hover:text-foreground font-medium font-[Cinzel]"
					>
						PLACES
					</Link>
				</div>
			</div>
			<div className="flex gap-2 items-center">
				<Suspense>
					<UserDisplay />
				</Suspense>
				<ThemeSwitcher />
			</div>
		</nav>
	);
}

function UserDisplay() {
	const trpc = useTRPC();
	const { data: session } = useSuspenseQuery(
		trpc.auth.getSession.queryOptions(),
	);

	if (!session) {
		return <Button>Sign In</Button>;
	}

	return <>{session.user.name}</>;
}
