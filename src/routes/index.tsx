import { createFileRoute } from "@tanstack/react-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import { z } from "zod";

import { useTRPC } from "../trpc/react";
import { PhotoCard } from "@/components/photo-card";
import { CardLayoutGrid } from "@/components/card-layout-grid";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
	component: Home,
	validateSearch: z.object({
		pages: z.number().optional().default(1),
	}),
	loaderDeps: ({ search }) => ({
		pages: search.pages,
	}),
	loader: async ({ context, deps }) => {
		await context.queryClient.prefetchInfiniteQuery({
			...context.trpc.places.infiniteList.infiniteQueryOptions({
				cursor: null,
			}),
			pages: deps.pages,
			getNextPageParam: (lastPage) => lastPage.nextCursor,
		});
	},
});

function Home() {
	const trpc = useTRPC();
	const navigate = Route.useNavigate();
	const {
		data: places,
		isLoading,
		fetchNextPage,
		hasNextPage,
	} = useInfiniteQuery(
		trpc.places.infiniteList.infiniteQueryOptions(
			{ cursor: null },
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
				<div className="w-full flex justify-center py-2">
					<Button
						type="button"
						onClick={async () => {
							await fetchNextPage();
							navigate({
								from: Route.fullPath,
								search: () => ({ pages: (places?.pages.length ?? 0) + 1 }),
								resetScroll: false,
							});
						}}
					>
						Load More
					</Button>
				</div>
			) : null}
		</>
	);
}
