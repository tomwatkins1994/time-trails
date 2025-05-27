import { createFileRoute, Outlet } from "@tanstack/react-router";
import { NavBar } from "@/components/navbar";

export const Route = createFileRoute("/_main")({
	component: MainLayout,
});

function MainLayout() {
	return (
		<>
			<header className="sticky top-0 p-4 md:px-8 bg-background">
				<NavBar />
			</header>
			<main className="p-4 md:px-8 md:py-6">
				<Outlet />
			</main>
		</>
	);
}
