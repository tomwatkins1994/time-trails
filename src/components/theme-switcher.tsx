import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "./theme/theme-provider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function ThemeSwitcher() {
	const { setTheme, theme } = useTheme();

	return (
		<ToggleGroup type="single" variant="outline" defaultValue={theme}>
			<ToggleGroupItem
				value="system"
				size="sm"
				aria-label="Toggle system"
				onClick={() => setTheme("system")}
			>
				<MonitorIcon size={16} />
			</ToggleGroupItem>
			<ToggleGroupItem
				value="light"
				size="sm"
				aria-label="Toggle light"
				onClick={() => setTheme("light")}
			>
				<SunIcon size={16} />
			</ToggleGroupItem>
			<ToggleGroupItem
				value="dark"
				size="sm"
				aria-label="Toggle dark"
				onClick={() => setTheme("dark")}
			>
				<MoonIcon size={16} />
			</ToggleGroupItem>
		</ToggleGroup>
	);
}
