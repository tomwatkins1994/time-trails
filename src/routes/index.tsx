import { createFileRoute } from "@tanstack/react-router";
import { useTRPC } from "../trpc/react";
import { useQuery } from "@tanstack/react-query";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

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
		<>
			{places?.map((place) => (
				<Card key={place.id}>
					<CardHeader>
						<CardTitle>{place.name}</CardTitle>
						<CardDescription>{place.description}</CardDescription>
					</CardHeader>
					<CardContent>hello</CardContent>
				</Card>
			))}
		</>
	);
}
