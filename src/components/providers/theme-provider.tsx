import { createContext, use, useState, type PropsWithChildren } from "react";

const ThemeContext = createContext<{
	theme: string;
	toggleTheme: () => void;
} | null>(null);

export function useTheme() {
	const themeContext = use(ThemeContext);
	if (!themeContext) {
		throw new Error("Not in ThemeProvider");
	}
	return themeContext;
}

export function ThemeProvider({
	initialTheme,
	children,
}: { initialTheme: string } & PropsWithChildren) {
	const [theme, setTheme] = useState(initialTheme);

	return (
		<ThemeContext
			value={{
				theme,
				toggleTheme: () => {
					const newTheme = theme === "dark" ? "light" : "dark";
					document.documentElement.classList.toggle("dark");
					document.cookie = `theme=${newTheme}`;
					setTheme(newTheme);
				},
			}}
		>
			{children}
		</ThemeContext>
	);
}
