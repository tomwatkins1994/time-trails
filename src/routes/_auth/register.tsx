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

export const Route = createFileRoute("/_auth/register")({
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
				<CardTitle className="flex justify-center items-center gap-2 text-2xl md:text-3xl font-medium font-[Cinzel]">
					<TimeTrailsIcon className="h-10 md:h-12" />
					Time Trails
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="font-[Cinzel] font-medium text-xl md:text-2xl flex justify-center">
					Register
				</div>
				<div className="flex justify-center mb-6 text-muted-foreground">
					Register an account and begin exploring the UK today!
				</div>
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
						<form.SubmitButton label="Register" className="w-full" />
					</form.AppForm>
				</form>
			</CardContent>
		</Card>
	);
}
