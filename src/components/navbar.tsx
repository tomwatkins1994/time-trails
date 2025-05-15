import { Link } from "@tanstack/react-router";
import ttIcon from "@/assets/time-trails-icon.png";

export function NavBar() {
	return (
		<nav className="flex justify-between items-center">
			<div className="flex gap-4 items-center">
				<Link to="/" className="flex gap-2">
					<img src={ttIcon} alt="Home" className="h-10" />
					<div className="text-3xl">TIME TRAILS</div>
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
