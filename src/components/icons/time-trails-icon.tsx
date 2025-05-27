import type { ComponentProps } from "react";
import ttIcon from "@/assets/time-trails-icon.png";
import { cn } from "@/lib/utils";

export function TimeTrailsIcon({ className, ...props }: ComponentProps<"img">) {
	return (
		// biome-ignore lint/a11y/useAltText: Ignore as being implemented
		<img src={ttIcon} className={cn("h-10", className)} alt="Home" {...props} />
	);
}
