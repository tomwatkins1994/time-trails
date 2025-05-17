import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/places/$id")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/places/$id"!</div>;
}
