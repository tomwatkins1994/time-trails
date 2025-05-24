import { Button } from "./ui/button";

export function ThemeSwitcher() {
	return (
		<Button
			onClick={() => {
				const usingDarkTheme =
					document.documentElement.classList.contains("dark");
				document.documentElement.classList.toggle("dark");
				document.cookie = `theme=${usingDarkTheme ? "light" : "dark"}`;
			}}
		>
			Change
		</Button>
	);
}
