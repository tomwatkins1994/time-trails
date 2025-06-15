import { SearchBox } from "@/components/search-box";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRightIcon } from "lucide-react";
import { useCallback } from "react";

export const Route = createFileRoute("/_main/")({
	component: RouteComponent,
	loader: async ({ context: { queryClient, trpcQuery } }) => {
		await queryClient.prefetchQuery({
			...trpcQuery.places.getRandomImages.queryOptions({
				number: 4,
			}),
		});
	},
});

function RouteComponent() {
	const trpc = useTRPC();
	const { data: images } = useSuspenseQuery(
		trpc.places.getRandomImages.queryOptions({ number: 4 }),
	);

	const navigate = Route.useNavigate();
	const submitSearch = useCallback(
		(searchValue: string) => {
			navigate({
				to: "/places",
				search: {
					name: searchValue,
				},
				viewTransition: true,
			});
		},
		[navigate],
	);

	return (
		<div>
			<Card className="grid md:grid-cols-2 gap-0 space-y-6">
				<div>
					<CardHeader>
						<CardTitle className="text-2xl">Find a Trail</CardTitle>
					</CardHeader>
					<CardContent>
						<div>
							<div className="mb-6">
								Search through over 1000 properties and walks all over the UK
							</div>
							<SearchBox
								placeholder="Search for a place"
								className="mb-4"
								onSubmit={submitSearch}
							/>
							<div className="px-2">
								<Link
									to="/places"
									className="inline-flex gap-2 items-center text-muted-foreground hover:underline"
								>
									<div>View all places</div>
									<ArrowRightIcon size={20} />
								</Link>{" "}
							</div>
						</div>
					</CardContent>
				</div>
				<div className="grid grid-cols-2 gap-2 px-6">
					{images.map((image) => (
						<Link
							key={image.id}
							to="/places/$id"
							params={{ id: image.id }}
							viewTransition
						>
							<img
								className="rounded w-full h-[100px] sm:h-[150px] lg:h-[200px]"
								src={image.imageUrl || ""}
								alt={image.imageDescription || ""}
								title={image.name}
							/>
						</Link>
					))}
				</div>
			</Card>
		</div>
	);
}
