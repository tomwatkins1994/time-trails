import { createFileRoute, Link, linkOptions } from "@tanstack/react-router";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { z } from "zod";
import { useCallback, useState } from "react";

import { useTRPC } from "@/trpc/react";
import { PhotoCard } from "@/components/photo-card";
import { CardLayoutGrid } from "@/components/card-layout-grid";
import { Button } from "@/components/ui/button";
import { CircleLoader } from "@/components/loaders/circle-loader";
import { SearchBox } from "@/components/search-box";

export const Route = createFileRoute("/(main)/places")({
	component: Home,
	validateSearch: z.object({
		pages: z.number().optional().default(1),
		name: z.string().optional(),
	}),
	loaderDeps: ({ search }) => ({ ...search }),
	loader: async ({ context: { queryClient, trpcQuery }, deps }) => {
		await queryClient.prefetchInfiniteQuery({
			...trpcQuery.places.infiniteList.infiniteQueryOptions({
				cursor: null,
				search: {
					name: deps.name,
				},
			}),
			pages: deps.pages,
			getNextPageParam: (lastPage) => lastPage.nextCursor,
		});
	},
});

const navigateOptions = linkOptions({
	from: Route.fullPath,
	resetScroll: false,
	replace: true,
});

function Home() {
	const deps = Route.useLoaderDeps();
	const navigate = Route.useNavigate();

	const trpc = useTRPC();
	const [submittedSearchValue, setSubmittedSearchValue] = useState(deps.name);
	const {
		data: places,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useSuspenseInfiniteQuery(
		trpc.places.infiniteList.infiniteQueryOptions(
			{
				cursor: null,
				search: {
					name: submittedSearchValue,
				},
			},
			{
				getNextPageParam: (lastPage) => lastPage.nextCursor,
				placeholderData: (prev) => prev,
			},
		),
	);

	const submitSearch = useCallback(
		(searchValue: string) => {
			setSubmittedSearchValue(searchValue);
			navigate({
				...navigateOptions,
				search: () => ({ name: searchValue || undefined }),
			});
		},
		[navigate],
	);

	return (
		<div className="flex flex-col gap-4">
			<SearchBox initialValue={deps.name} onSubmit={submitSearch} />
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
								...navigateOptions,
								search: (existing) => ({
									...existing,
									pages: (places?.pages.length ?? 0) + 1,
								}),
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
