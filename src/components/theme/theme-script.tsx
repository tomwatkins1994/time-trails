function setThemeScript() {
	try {
		const theme = localStorage.getItem("theme") || "system";
		if (
			theme === "dark" ||
			(theme === "system" &&
				window.matchMedia("(prefers-color-scheme: dark)").matches)
		) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	} catch (_) {}
}

export function ThemeScript() {
	return (
		<script
			// biome-ignore lint/security/noDangerouslySetInnerHtml: Needed to avoid FOUC
			dangerouslySetInnerHTML={{
				__html: `(${setThemeScript.toString()})()`,
			}}
		/>
	);
}
