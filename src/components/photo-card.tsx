import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export interface PhotoCardProps {
	imageUrl: string | null;
	title: string;
	subTitle: string;
	description: string;
}

export function PhotoCard(props: PhotoCardProps) {
	return (
		<Card className="pt-0">
			{props.imageUrl ? (
				<img src={props.imageUrl} alt="TODO" className="w-full rounded-t-xl" />
			) : null}
			<CardHeader>
				<CardTitle>{props.title}</CardTitle>
				<CardDescription>{props.subTitle}</CardDescription>
			</CardHeader>
			<CardContent>{props.description}</CardContent>
		</Card>
	);
}
