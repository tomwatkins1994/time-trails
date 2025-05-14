import { LoaderCircleIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function CircleLoader({
	className,
	...props
}: ComponentProps<typeof LoaderCircleIcon>) {
	return (
		<LoaderCircleIcon
			className={cn("animate-spin w-6 h-6", className)}
			{...props}
		/>
	);
}
