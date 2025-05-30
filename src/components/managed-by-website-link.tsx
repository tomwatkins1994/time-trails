import type { UIEvent, ComponentProps } from "react";
import ntIcon from "@/assets/national-trust.png";
import { cn } from "@/lib/utils";

export interface ManagedByWebsiteLinkProps extends ComponentProps<"div"> {
	managedBy: string;
	managerWebsiteUrl: string;
	showText?: boolean;
}

export function ManagedByWebsiteLink({
	className,
	managedBy,
	managerWebsiteUrl,
	showText,
}: ManagedByWebsiteLinkProps) {
	const openWebsite = (e: UIEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		window.open(managerWebsiteUrl, "_blank");
	};

	const iconSrc = managedBy === "NATIONAL_TRUST" ? ntIcon : null;
	if (!iconSrc) return null;

	const linkText = managedBy === "NATIONAL_TRUST" ? "National Trust" : null;

	return (
		<div
			className={cn(
				"flex gap-2 items-center cursor-pointer hover:underline hover:font-bold",
				className,
			)}
			onClick={openWebsite}
			onKeyUp={openWebsite}
		>
			<img src={iconSrc} alt="Go to website" className="size-10" />
			{showText ? (
				<span className="font-[Cinzel] text-md font-semibold">
					View on {linkText} website
				</span>
			) : null}
		</div>
	);
}
