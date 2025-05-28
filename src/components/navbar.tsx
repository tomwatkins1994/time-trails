import { Link } from "@tanstack/react-router";
import { ThemeSwitcher } from "./theme-switcher";
import { TimeTrailsIcon } from "./icons/time-trails-icon";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { userSessionQueryOptions } from "@/lib/queries/user-session";
import { Button } from "./ui/button";
import { Suspense } from "react";
import { authClient } from "@/lib/auth/client";

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
				<UserDisplay />
				<ThemeSwitcher />
			</div>
		</nav>
	);
}

function UserDisplay() {
	const session = authClient.useSession();

	if (session.isPending) {
		return null;
	}

	if (!session) {
		return <Button>Sign In</Button>;
	}

	return <>{session.data?.user.name}</>;
}
