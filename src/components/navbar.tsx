import { Link } from "@tanstack/react-router";
import { Suspense } from "react";
import { TimeTrailsIcon } from "./icons/time-trails-icon";
import { LoggedInUser } from "./logged-in-user";

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
					<LoggedInUser />
				</Suspense>
			</div>
		</nav>
	);
}
