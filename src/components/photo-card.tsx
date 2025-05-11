import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import ntIcon from "../assets/national-trust.png";

export interface PhotoCardProps {
	imageUrl: string | null;
	title: string;
	subTitle: string;
	description: string;
	managedBy?: string | null;
}

export function PhotoCard(props: PhotoCardProps) {
	return (
		<Card className="pt-0">
			{props.imageUrl ? (
				<img src={props.imageUrl} alt="TODO" className="w-full rounded-t-xl" />
			) : null}
			<CardHeader>
				<div className="flex gap-2 justify-between">
					<div>
						<CardTitle>{props.title}</CardTitle>
						<CardDescription>{props.subTitle}</CardDescription>
					</div>
					{props.managedBy === "NATIONAL_TRUST" ? (
						<img src={ntIcon} alt="Go to website" className="size-10" />
					) : null}
				</div>
			</CardHeader>
			<CardContent>{props.description}</CardContent>
		</Card>
	);
}
