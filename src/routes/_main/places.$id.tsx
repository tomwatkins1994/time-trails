import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ArrowLeftIcon, InfoIcon } from "lucide-react";
import { useCallback } from "react";

import { useTRPC } from "@/trpc/react";
import { ManagedByWebsiteLink } from "@/components/managed-by-website-link";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export const Route = createFileRoute("/_main/places/$id")({
	loader: async ({ context, params }) => {
		await context.queryClient.prefetchQuery(
			context.trpcQuery.places.getById.queryOptions({ id: params.id }),
		);
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { id } = Route.useParams();
	const trpc = useTRPC();
	const { data: place } = useQuery(trpc.places.getById.queryOptions({ id }));

	const router = useRouter();
	const returnToPlaces = useCallback(() => {
		if (router.history.canGoBack()) {
			router.history.back();
		} else {
			router.navigate({ to: "/places" });
		}
	}, [router]);

	if (!place) return;

	const managedBy = place.managedBy
		?.split("_")
		.map(
			(text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase(),
		)
		.join(" ");

	return (
		<Card className="flex flex-col sm:flex-row sm:gap-0">
			<div className="flex flex-col gap-6 flex-grow">
				<CardHeader className="gap-0">
					<div
						className="flex gap-2 items-center text-muted-foreground text-sm mb-2"
						onClick={() => returnToPlaces()}
						onKeyUp={() => returnToPlaces}
					>
						<ArrowLeftIcon size={20} />
						Back to places
					</div>
					<CardTitle className="text-2xl">{place.name}</CardTitle>
					<CardDescription className="text-lg">
						{[place.town, place.county].filter(Boolean).join(", ")}
					</CardDescription>
				</CardHeader>
				<CardContent className="text-sm">
					{place.description}
					{place.managedBy && place.managerWebsiteUrl ? (
						<ManagedByWebsiteLink
							className="mt-4"
							managedBy={place.managedBy}
							managerWebsiteUrl={place.managerWebsiteUrl}
							showText
						/>
					) : null}
				</CardContent>
			</div>
			{place.imageUrl ? (
				<CardContent className="w-full sm:max-w-[50%]">
					<img src={place.imageUrl} alt="TODO" className="rounded-xl" />
					<div className="flex gap-2 items-center text-xs text-muted-foreground mt-2 px-2">
						<InfoIcon size={24} />
						<div>
							{place.imageDescription} | © {place.imageCredit || managedBy}
						</div>
					</div>
				</CardContent>
			) : null}
		</Card>
	);
}
