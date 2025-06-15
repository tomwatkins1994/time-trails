import type { ComponentProps } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ManagedByWebsiteLink } from "./managed-by-website-link";
import { Image } from "./inage";

export interface PhotoCardProps extends ComponentProps<"div"> {
	imageUrl: string | null;
	imageBlurhash: string | null;
	title: string;
	subTitle: string;
	description: string;
	managedBy?: string | null;
	managerWebsiteUrl?: string | null;
}

export function PhotoCard({
	className,
	imageUrl,
	imageBlurhash,
	title,
	subTitle,
	description,
	managedBy,
	managerWebsiteUrl,
}: PhotoCardProps) {
	return (
		<Card className={cn("pt-0 gap-4 pb-4", className)}>
			{imageUrl ? (
				<Image
					src={imageUrl}
					className="max-h-[300px] min-w-full md:h-[200px] overflow-hidden rounded-t-xl"
					alt="TODO"
					blurhash={imageBlurhash}
				/>
			) : null}
			<CardHeader>
				<div className="grid grid-cols-[auto_max-content] gap-2">
					<div>
						<CardTitle>{title}</CardTitle>
						<CardDescription>{subTitle}</CardDescription>
					</div>
					{managedBy && managerWebsiteUrl ? (
						<ManagedByWebsiteLink
							managedBy={managedBy}
							managerWebsiteUrl={managerWebsiteUrl}
						/>
					) : null}
				</div>
			</CardHeader>
			<CardContent className="text-muted-foreground text-sm">
				{description}
			</CardContent>
		</Card>
	);
}
