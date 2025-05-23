import { createFileRoute, Link } from "@tanstack/react-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import { z } from "zod";

import { useTRPC } from "@/trpc/react";
import { PhotoCard } from "@/components/photo-card";
import { CardLayoutGrid } from "@/components/card-layout-grid";
import { Button } from "@/components/ui/button";
import { CircleLoader } from "@/components/loaders/circle-loader";

export const Route = createFileRoute("/places/")({
	component: Home,
	validateSearch: z.object({
		pages: z.number().optional().default(1),
	}),
	loaderDeps: ({ search }) => ({
		pages: search.pages,
	}),
	loader: async ({ context, deps }) => {
		await context.queryClient.prefetchInfiniteQuery({
			...context.trpcQuery.places.infiniteList.infiniteQueryOptions({
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
		isFetchingNextPage,
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
		<div className="flex flex-col gap-4">
			<CardLayoutGrid>
				{places?.pages.map((page) =>
					page.items.map((place) => (
						<Link key={place.id} to="/places/$id" params={{ id: place.id }}>
							<PhotoCard
								className="h-full"
								imageUrl={place.imageUrl}
								title={place.name}
								subTitle={[place.town, place.county].filter(Boolean).join(", ")}
								description={place.description}
								managedBy={place.managedBy}
								managerWebsiteUrl={place.managerWebsiteUrl}
							/>
						</Link>
					)),
				)}
			</CardLayoutGrid>
			{isFetchingNextPage ? (
				<div className="w-full flex justify-center">
					<CircleLoader />
				</div>
			) : null}
			{hasNextPage && !isFetchingNextPage ? (
				<div className="w-full flex justify-center">
					<Button
						type="button"
						disabled={isFetchingNextPage}
						onClick={async () => {
							await fetchNextPage();
							navigate({
								from: Route.fullPath,
								search: () => ({ pages: (places?.pages.length ?? 0) + 1 }),
								resetScroll: false,
								replace: true,
							});
						}}
					>
						Load More
					</Button>
				</div>
			) : null}
		</div>
	);
}
