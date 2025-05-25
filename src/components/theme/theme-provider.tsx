import {
	createContext,
	use,
	useCallback,
	useEffect,
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
	return theme || "system";
}

export function ThemeProvider({ children }: PropsWithChildren) {
	const [theme, setTheme] = useState(getTheme);
	const usingSystemTheme = (theme || "system") === "system";

	const getResolvedTheme = useCallback(() => {
		if (usingSystemTheme) {
			return getSystemTheme();
		}
		return theme;
	}, [theme, usingSystemTheme]);

	const applyTheme = useCallback((newTheme: string) => {
		document.documentElement.classList.toggle("dark", newTheme === "dark");
	}, []);

	const toggleTheme = useCallback(() => {
		const newTheme = getResolvedTheme() === "dark" ? "light" : "dark";
		setTheme(newTheme);
		applyTheme(newTheme);
		try {
			localStorage.setItem("theme", newTheme);
		} catch (_) {
			console.error("Local storage not supported");
		}
	}, [getResolvedTheme, applyTheme]);

	const handleSystemThemeChanged = useCallback(() => {
		if (usingSystemTheme) {
			return applyTheme(getSystemTheme());
		}
	}, [usingSystemTheme, applyTheme]);

	useEffect(() => {
		const media = window.matchMedia("(prefers-color-scheme: dark)");
		media.addEventListener("change", handleSystemThemeChanged);
		return () => media.removeEventListener("change", handleSystemThemeChanged);
	}, [handleSystemThemeChanged]);

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
