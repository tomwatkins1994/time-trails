import type { PropsWithChildren } from "react";

export function CardLayoutGrid({ children }: PropsWithChildren) {
	return (
		<div className="@container w-full">
			<div className=" grid grid-cols-1 @2xl:grid-cols-2 @4xl:grid-cols-3 @6xl:grid-cols-4 gap-4">
				{children}
			</div>
		</div>
	);
}
