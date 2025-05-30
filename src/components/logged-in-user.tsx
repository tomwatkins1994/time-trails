import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { authClient } from "@/lib/auth/client";
import { useNavigate } from "@tanstack/react-router";

export function LoggedInUser() {
	const navigate = useNavigate();
	const trpc = useTRPC();
	const { data: session } = useSuspenseQuery(
		trpc.auth.getSession.queryOptions(),
	);

	if (!session) {
		return <Button onClick={() => navigate({ to: "/login" })}>Login</Button>;
	}

	const initials = session.user.name
		.split(" ")
		.map((w) => w[0]?.toUpperCase())
		.join("");

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="size-10" asChild>
				<Avatar className="cursor-pointer">
					{session.user.image ? <AvatarImage src={session.user.image} /> : null}
					<AvatarFallback className="text-sm">{initials}</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="end">
				<DropdownMenuLabel>{session.user.name}</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem>Profile</DropdownMenuItem>
					<DropdownMenuItem>Settings</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<a
					href="https://github.com/tomwatkins1994/time-trails"
					target="_blank"
					rel="noreferrer"
				>
					<DropdownMenuItem>GitHub</DropdownMenuItem>
				</a>
				<DropdownMenuItem>Support</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem className="flex justify-between">
					<div>Theme</div>
					<ThemeSwitcher />
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={() => {
						authClient.signOut(
							{},
							{
								onSuccess: () => {
									navigate({ to: "/login" });
								},
							},
						);
					}}
				>
					Log out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
