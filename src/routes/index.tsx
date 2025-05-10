import { createFileRoute } from "@tanstack/react-router";
import { useTRPC } from "../trpc/react";
import { useQuery } from "@tanstack/react-query";

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
			<h1 className="text-3xl font-bold underline">Hello world!</h1>
			{places?.map((place) => (
				<div key={place.id}>{place.name}</div>
			))}
		</>
	);
}
