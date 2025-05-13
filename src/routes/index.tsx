import { createFileRoute, Router } from "@tanstack/react-router";
import { useTRPC } from "../trpc/react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { PhotoCard } from "@/components/photo-card";
import { CardLayoutGrid } from "@/components/card-layout-grid";
import { z } from "zod";

export const Route = createFileRoute("/")({
	component: Home,
	validateSearch: z.object({
		cursor: z.string().optional(),
	}),
	loaderDeps: ({ search }) => ({
		cursor: search.cursor,
	}),
	loader: async ({ context, deps }) => {
		await context.queryClient.prefetchInfiniteQuery(
			context.trpc.places.infiniteList.infiniteQueryOptions({
				cursor: deps.cursor ?? null,
			}),
		);
	},
});

function Home() {
	const trpc = useTRPC();
	const { cursor } = Route.useLoaderDeps();
	const {
		data: places,
		isLoading,
		fetchNextPage,
		hasNextPage,
	} = useInfiniteQuery(
		trpc.places.infiniteList.infiniteQueryOptions(
			{ cursor: cursor ?? null },
			{
				getNextPageParam: (lastPage) => lastPage.nextCursor,
			},
		),
	);

	if (isLoading) {
		return "Loading...";
	}

	return (
		<>
			<CardLayoutGrid>
				{places?.pages.map((page) =>
					page.items.map((place) => (
						<PhotoCard
							key={place.id}
							imageUrl={place.imageUrl}
							title={place.name}
							subTitle={[place.town, place.county].filter(Boolean).join(", ")}
							description={place.description}
							managedBy={place.managedBy}
						/>
					)),
				)}
			</CardLayoutGrid>
			{hasNextPage ? (
				<button
					type="button"
					onClick={() => {
						console.log("Pressed");
						fetchNextPage();
					}}
				>
					Fetch next page
				</button>
			) : null}
		</>
	);
}
