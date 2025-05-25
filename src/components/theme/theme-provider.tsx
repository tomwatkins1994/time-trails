import {
	createContext,
	use,
	useCallback,
	useState,
	type PropsWithChildren,
} from "react";

const ThemeContext = createContext<{
	theme: string | null;
	toggleTheme: () => void;
} | null>(null);

export function useTheme() {
	const themeContext = use(ThemeContext);
	if (!themeContext) {
		throw new Error("Not in ThemeProvider");
	}
	return themeContext;
}

function getSystemTheme() {
	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

function getTheme() {
	if (typeof window === "undefined") return null;
	let theme: string | null = null;
	try {
		theme = localStorage.getItem("theme");
	} catch (_) {
		console.error("Local storage not supported");
	}
	if ((theme || "system") === "system") {
		return getSystemTheme();
	}
	return theme;
}

export function ThemeProvider({ children }: PropsWithChildren) {
	const [theme, setTheme] = useState(getTheme);

	const toggleTheme = useCallback(() => {
		if (!theme) return;
		document.documentElement.classList.toggle("dark", theme !== "dark");
		const newTheme = theme === "dark" ? "light" : "dark";
		setTheme(newTheme);
		try {
			localStorage.setItem("theme", newTheme);
		} catch (_) {
			console.error("Local storage not supported");
		}
	}, [theme]);

	return (
		<ThemeContext
			value={{
				theme,
				toggleTheme,
			}}
		>
			{children}
		</ThemeContext>
	);
}
