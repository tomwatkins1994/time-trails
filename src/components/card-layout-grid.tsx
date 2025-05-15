import type { PropsWithChildren } from "react";

export function CardLayoutGrid({ children }: PropsWithChildren) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
			{children}
		</div>
	);
}
