import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "./theme/theme-provider";
import { Button } from "./ui/button";

export function ThemeSwitcher() {
	const { toggleTheme } = useTheme();

	return (
		<Button onClick={toggleTheme}>
			<SunIcon className="hidden dark:block" />
			<MoonIcon className="dark:hidden" />
		</Button>
	);
}
