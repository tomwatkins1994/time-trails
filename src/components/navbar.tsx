import { Link } from "@tanstack/react-router";
import ttIcon from "@/assets/time-trails-icon.png";
import { ThemeSwitcher } from "./theme-switcher";

export function NavBar() {
	return (
		<nav className="flex justify-between items-center">
			<div className="flex gap-4 items-center">
				<Link to="/" className="flex gap-2 items-center">
					<img src={ttIcon} alt="Home" className="h-10" />
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
			<div>
				<ThemeSwitcher />
			</div>
		</nav>
	);
}
