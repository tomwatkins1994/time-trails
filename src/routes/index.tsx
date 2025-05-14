import { createFileRoute } from "@tanstack/react-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import { z } from "zod";
import { useEffect } from "react";

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
	loader: async ({ context }) => {
		await context.queryClient.prefetchInfiniteQuery(
			context.trpc.places.infiniteList.infiniteQueryOptions({
				cursor: null,
			}),
		);
	},
});

function Home() {
	const trpc = useTRPC();
	const navigate = Route.useNavigate();
	const { pages } = Route.useLoaderDeps();
	const {
		data: places,
		isLoading,
		isFetchingNextPage,
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

	// biome-ignore lint/correctness/useExhaustiveDependencies: We only want this on component mount
	useEffect(() => {
		if (isFetchingNextPage) return;

		const preloadPages = async () => {
			for (let i = 1; i < pages; i++) {
				const result = await fetchNextPage();
				if (!result.hasNextPage) break;
			}
		};

		preloadPages();
	}, []);

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
