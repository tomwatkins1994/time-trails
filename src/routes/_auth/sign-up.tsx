import { createFileRoute } from "@tanstack/react-router";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { TimeTrailsIcon } from "@/components/icons/time-trails-icon";
import { z } from "zod";
import { useAppForm } from "@/hooks/useAppForm";

export const Route = createFileRoute("/_auth/sign-up")({
	component: RouteComponent,
});

function RouteComponent() {
	const form = useAppForm({
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: "",
		},
		validators: {
			onChange: z
				.object({
					email: z.string().email(),
					password: z.string().min(8),
					confirmPassword: z.string().min(8),
				})
				.superRefine(({ password, confirmPassword }, ctx) => {
					if (password !== confirmPassword) {
						ctx.addIssue({
							code: "custom",
							message: "The passwords did not match",
							path: ["confirmPassword"],
						});
					}
				}),
		},
		onSubmit: ({ value }) => {
			// Do something with form data
			alert(JSON.stringify(value, null, 2));
		},
	});

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
			<CardContent>
				<form
					className="space-y-4"
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}
				>
					<form.AppField
						name="email"
						children={(field) => <field.TextField label="Email" />}
					/>
					<form.AppField
						name="password"
						children={(field) => <field.TextField label="Password" secret />}
					/>
					<form.AppField
						name="confirmPassword"
						children={(field) => (
							<field.TextField label="Confirm Password" secret />
						)}
					/>
					<form.AppForm>
						<form.SubmitButton label="Sign Up" className="w-full" />
					</form.AppForm>
				</form>
			</CardContent>
		</Card>
	);
}
