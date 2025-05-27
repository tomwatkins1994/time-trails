import { createFileRoute } from "@tanstack/react-router";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { TimeTrailsIcon } from "@/components/icons/time-trails-icon";

export const Route = createFileRoute("/_auth/sign-up")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<Card className="w-full max-w-[600px]">
			<CardHeader>
				<div className="flex gap-2">
					<TimeTrailsIcon className="h-13 md:h-15" />
					<div>
						<CardTitle className="text-xl md:text-2xl font-medium font-[Cinzel]">
							Time Trails
						</CardTitle>
						<CardDescription className="text-md md:text-lg">
							Sign Up
						</CardDescription>
					</div>
				</div>
			</CardHeader>
		</Card>
	);
}
