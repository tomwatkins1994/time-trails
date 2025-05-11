import { createFileRoute } from "@tanstack/react-router";
import { useTRPC } from "../trpc/react";
import { useQuery } from "@tanstack/react-query";
import { PhotoCard } from "@/components/photo-card";
import { CardLayoutGrid } from "@/components/card-layout-grid";

export const Route = createFileRoute("/")({
	component: Home,
	loader: async ({ context }) => {
		await context.queryClient.prefetchQuery(
			context.trpc.places.list.queryOptions(),
		);
	},
});

function Home() {
	const trpc = useTRPC();
	const { data: places, isLoading } = useQuery(trpc.places.list.queryOptions());

	if (isLoading) {
		return "Loading...";
	}

	return (
		<CardLayoutGrid>
			{places?.map((place) => (
				<PhotoCard
					key={place.id}
					imageUrl={place.imageUrl}
					title={place.name}
					subTitle={`${place.town}, ${place.county}`}
					description={place.description}
				/>
			))}
		</CardLayoutGrid>
	);
}
