import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "./providers/theme-provider";
import { Button } from "./ui/button";

export function ThemeSwitcher() {
	const { theme, toggleTheme } = useTheme();

	return (
		<Button onClick={toggleTheme}>
			{theme === "dark" ? <SunIcon /> : <MoonIcon />}
		</Button>
	);
}
