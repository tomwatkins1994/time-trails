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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import ntIcon from "@/assets/national-trust.png";
import ehIcon from "@/assets/english-heritage.png";

export const Route = createFileRoute("/_main/places/")({
	component: Home,
	validateSearch: z.object({
		pages: z.number().optional().default(1),
		name: z.string().optional(),
		managedBy: z.string().optional(),
	}),
	loaderDeps: ({ search }) => ({
		...search,
		managedBy: search.managedBy?.split(",") || [],
	}),
	loader: async ({ context: { queryClient, trpcQuery }, deps }) => {
		await queryClient.prefetchInfiniteQuery({
			...trpcQuery.places.infiniteList.infiniteQueryOptions({
				cursor: null,
				search: {
					name: deps.name,
					managedBy: deps.managedBy,
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

const managedByOptions = [
	{
		name: "NATIONAL_TRUST",
		displayName: "National Trust",
		icon: ntIcon,
	},
	{
		name: "ENGLISH_HERITAGE",
		displayName: "English Heritage",
		icon: ehIcon,
	},
];

function Home() {
	const deps = Route.useLoaderDeps();
	const navigate = Route.useNavigate();

	const trpc = useTRPC();
	const [submittedSearchValue, setSubmittedSearchValue] = useState(deps.name);
	const [managedByFilter, setManagedByFilter] = useState(deps.managedBy);
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
					managedBy: managedByFilter,
				},
			},
			{
				getNextPageParam: (lastPage) => lastPage.nextCursor,
				placeholderData: (prev) => prev,
			},
		),
	);
	const resultsFound = places.pages[0]?.count || 0;

	const submitSearch = useCallback(
		(searchValue: string) => {
			setSubmittedSearchValue(searchValue);
			navigate({
				...navigateOptions,
				search: (existing) => ({
					...existing,
					name: searchValue || undefined,
					pages: undefined,
				}),
			});
		},
		[navigate],
	);

	const changeManagedByFilter = useCallback(
		(newFilter: string[]) => {
			setManagedByFilter(newFilter);
			navigate({
				...navigateOptions,
				search: (existing) => ({
					...existing,
					managedBy: newFilter.join(",") || undefined,
					pages: undefined,
				}),
			});
		},
		[navigate],
	);

	return (
		<div className="grid grid-cols-[250px_auto] grid-rows-[max-content_auto] gap-4 h-full">
			<div className="flex justify-between items-center col-span-2">
				<div className="font-[Cinzel] text-xl font-semibold px-6">
					{resultsFound > 0
						? `Places Found: ${resultsFound}`
						: "No places found"}
				</div>
				<SearchBox initialValue={deps.name} onSubmit={submitSearch} />
			</div>
			<div>
				<Card>
					<CardHeader>
						<CardTitle>Filter</CardTitle>
					</CardHeader>
					<CardContent className="font-[Cinzel]">
						<div className="space-y-2">
							<div className="font-semibold">Managed by</div>
							{managedByOptions.map(({ name, displayName, icon }) => (
								<div key={name} className="flex gap-2 items-center">
									<Checkbox
										id={name}
										checked={managedByFilter.includes(name)}
										onCheckedChange={(checked) => {
											const newManagedByFilter = checked
												? [...managedByFilter, name]
												: managedByFilter.filter((value) => value !== name);
											changeManagedByFilter(newManagedByFilter);
										}}
									/>
									<Label htmlFor={name}>
										<img src={icon} className="size-8" alt={displayName} />
										{displayName}
									</Label>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
			<div className="flex flex-col gap-4 overflow-auto pr-4">
				<CardLayoutGrid>
					{places?.pages.map((page) =>
						page.items.map((place) => (
							<Link
								key={place.id}
								to="/places/$id"
								params={{ id: place.id }}
								viewTransition
							>
								<PhotoCard
									className="h-full"
									imageUrl={place.imageUrl}
									imageBlurhash={place.imageBlurhash}
									title={place.name}
									subTitle={[place.town, place.county]
										.filter(Boolean)
										.join(", ")}
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
		</div>
	);
}
