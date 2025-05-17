import type { ComponentProps } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import ntIcon from "@/assets/national-trust.png";
import { cn } from "@/lib/utils";

export interface PhotoCardProps extends ComponentProps<"div"> {
	imageUrl: string | null;
	title: string;
	subTitle: string;
	description: string;
	managedBy?: string | null;
	managerWebsiteUrl?: string | null;
}

export function PhotoCard(props: PhotoCardProps) {
	return (
		<Card className={cn("pt-0 gap-4 pb-4", props.className)}>
			{props.imageUrl ? (
				<img src={props.imageUrl} alt="TODO" className="w-full rounded-t-xl" />
			) : null}
			<CardHeader>
				<div className="flex gap-2 justify-between">
					<div className="font-[Cinzel]">
						<CardTitle>{props.title}</CardTitle>
						<CardDescription>{props.subTitle}</CardDescription>
					</div>
					{props.managedBy && props.managerWebsiteUrl ? (
						<a
							href={props.managerWebsiteUrl}
							target="_blank"
							rel="noopener noreferrer"
						>
							{props.managedBy === "NATIONAL_TRUST" ? (
								<img src={ntIcon} alt="Go to website" className="size-10" />
							) : null}
						</a>
					) : null}
				</div>
			</CardHeader>
			<CardContent className="text-muted-foreground text-sm">
				{props.description}
			</CardContent>
		</Card>
	);
}
