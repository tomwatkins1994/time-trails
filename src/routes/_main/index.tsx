import { SearchBox } from "@/components/search-box";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRightIcon } from "lucide-react";
import { useCallback } from "react";

export const Route = createFileRoute("/_main/")({
	component: RouteComponent,
});

function RouteComponent() {
	const submitSearch = useCallback(() => {}, []);

	return (
		<div>
			<Card>
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
			</Card>
		</div>
	);
}
