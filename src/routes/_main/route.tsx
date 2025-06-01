import { createFileRoute, Outlet } from "@tanstack/react-router";
import { NavBar } from "@/components/navbar";

export const Route = createFileRoute("/_main")({
	component: MainLayout,
	loader: async ({ context: { queryClient, trpcQuery } }) => {
		// Prefetch top-level so session info is available everywhere
		await queryClient.prefetchQuery(trpcQuery.auth.getSession.queryOptions());
	},
});

function MainLayout() {
	return (
		<>
			<header className="sticky top-0 p-4 md:px-8 bg-background h-[72px]">
				<NavBar />
			</header>
			<main className="p-4 md:px-8 md:py-6 h-[calc(100vh-72px)]">
				<Outlet />
			</main>
		</>
	);
}
