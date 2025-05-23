import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/places/$id")({
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

	if (!place) return;

	return (
		<Card>
			<CardHeader>
				<CardTitle>{place.name}</CardTitle>
				<CardDescription>
					{[place.town, place.county].filter(Boolean).join(", ")}
				</CardDescription>
			</CardHeader>
			<CardContent className="text-sm">{place.description}</CardContent>
		</Card>
	);
}
