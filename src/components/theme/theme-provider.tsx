import {
	createContext,
	use,
	useCallback,
	useEffect,
	useMemo,
	useState,
	type PropsWithChildren,
} from "react";

const ThemeContext = createContext<{
	theme: string;
	setTheme: (newTheme: string) => void;
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

function resolveTheme(theme: string) {
	if (theme === "system") {
		return getSystemTheme();
	}
	return theme;
}

export function ThemeProvider({ children }: PropsWithChildren) {
	const [theme, setThemeValue] = useState(() => getTheme() || "system");

	const applyTheme = useCallback((newTheme: string) => {
		document.documentElement.classList.toggle("dark", newTheme === "dark");
	}, []);

	const setTheme = useCallback(
		(newTheme: string) => {
			setThemeValue(newTheme);
			applyTheme(resolveTheme(newTheme));
			try {
				localStorage.setItem("theme", newTheme);
			} catch (_) {
				console.error("Local storage not supported");
			}
		},
		[applyTheme],
	);

	const toggleTheme = useCallback(() => {
		const newTheme = resolveTheme(theme) === "dark" ? "light" : "dark";
		setTheme(newTheme);
	}, [theme, setTheme]);

	const handleSystemThemeChanged = useCallback(() => {
		if (theme === "system") {
			return applyTheme(getSystemTheme());
		}
	}, [theme, applyTheme]);

	useEffect(() => {
		const media = window.matchMedia("(prefers-color-scheme: dark)");
		media.addEventListener("change", handleSystemThemeChanged);
		return () => media.removeEventListener("change", handleSystemThemeChanged);
	}, [handleSystemThemeChanged]);

	const contextValue = useMemo(
		() => ({ theme, setTheme, toggleTheme }),
		[theme, setTheme, toggleTheme],
	);

	return <ThemeContext value={contextValue}>{children}</ThemeContext>;
}
