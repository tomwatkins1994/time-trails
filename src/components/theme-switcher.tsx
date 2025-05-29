import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "./theme/theme-provider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { type UIEvent, useCallback } from "react";

export function ThemeSwitcher() {
	const { setTheme, theme } = useTheme();
	const switchTheme = useCallback(
		(e: UIEvent<HTMLButtonElement>, theme: string) => {
			e.stopPropagation();
			setTheme(theme);
		},
		[setTheme],
	);

	return (
		<ToggleGroup type="single" variant="outline" defaultValue={theme}>
			<ToggleGroupItem
				value="system"
				size="sm"
				aria-label="Toggle system"
				onClick={(e) => switchTheme(e, "system")}
			>
				<MonitorIcon size={16} />
			</ToggleGroupItem>
			<ToggleGroupItem
				value="light"
				size="sm"
				aria-label="Toggle light"
				onClick={(e) => switchTheme(e, "light")}
			>
				<SunIcon size={16} />
			</ToggleGroupItem>
			<ToggleGroupItem
				value="dark"
				size="sm"
				aria-label="Toggle dark"
				onClick={(e) => switchTheme(e, "dark")}
			>
				<MoonIcon size={16} />
			</ToggleGroupItem>
		</ToggleGroup>
	);
}
