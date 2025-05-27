import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_main")({
	component: MainLayout,
});

function MainLayout() {
	return (
		<div>
			Hello "/(main)/_layout"!
			<Outlet />
		</div>
	);
}
