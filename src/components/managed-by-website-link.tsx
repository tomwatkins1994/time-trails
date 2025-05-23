import type { UIEvent } from "react";
import ntIcon from "@/assets/national-trust.png";

export interface ManagedByWebsiteLinkProps {
	managedBy: string;
	managerWebsiteUrl: string;
}

export function ManagedByWebsiteLink({
	managedBy,
	managerWebsiteUrl,
}: ManagedByWebsiteLinkProps) {
	const openWebsite = (e: UIEvent<HTMLImageElement>) => {
		e.preventDefault();
		e.stopPropagation();
		window.open(managerWebsiteUrl, "_blank");
	};

	const iconSrc = managedBy === "NATIONAL_TRUST" ? ntIcon : null;
	if (!iconSrc) return null;

	return (
		<img
			src={iconSrc}
			alt="Go to website"
			className="size-10 cursor-pointer"
			onClick={openWebsite}
			onKeyUp={openWebsite}
		/>
	);
}
