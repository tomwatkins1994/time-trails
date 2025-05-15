import { Link } from "@tanstack/react-router";

export function NavBar() {
	return (
		<nav className="flex justify-between items-center">
			<div className="flex gap-4 items-center">
				<Link to="/">
					<div className="text-lg">Time Trails</div>
				</Link>
				<div>
					<Link to="/places" className="text-muted-foreground">
						Places
					</Link>
				</div>
			</div>
			<div>Search</div>
		</nav>
	);
}
