import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "./theme/theme-provider";
import { Button } from "./ui/button";
import { useEffect, useLayoutEffect, useState } from "react";

export function ThemeSwitcher() {
	const { toggleTheme } = useTheme();

	return (
		<Button className="w-[36px]" onClick={toggleTheme}>
			<ThemeIcon />
		</Button>
	);
}

function ThemeIcon() {
	const [mounted, setMounted] = useState(false);
	const { theme } = useTheme();

	useLayoutEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	return theme === "dark" ? <SunIcon /> : <MoonIcon />;
}
