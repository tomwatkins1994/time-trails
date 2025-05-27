import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<main className="p-4 md:px-8 md:py-12 flex justify-center">
			<Outlet />
		</main>
	);
}
