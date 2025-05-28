import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimeTrailsIcon } from "@/components/icons/time-trails-icon";
import { useAppForm } from "@/hooks/useAppForm";
import { authClient } from "@/lib/auth/client";

export const Route = createFileRoute("/_auth/register")({
	component: RouteComponent,
});

const SignUpSchema = z.object({
	fullName: z.string().nonempty(),
	email: z.string().email(),
	password: z.string().min(8),
	confirmPassword: z.string().min(8),
});

function RouteComponent() {
	const navigate = useNavigate();
	const form = useAppForm({
		defaultValues: {
			fullName: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
		validators: {
			onSubmit: SignUpSchema.superRefine(
				({ password, confirmPassword }, ctx) => {
					if (password !== confirmPassword) {
						ctx.addIssue({
							code: "custom",
							message: "The passwords do not match",
							path: ["confirmPassword"],
						});
					}
				},
			),
		},
		onSubmit: async ({ value }) => {
			await saveUserMutation.mutateAsync(value);
		},
	});

	const saveUserMutation = useMutation({
		mutationFn: async ({
			fullName,
			email,
			password,
		}: z.infer<typeof SignUpSchema>) => {
			const { error } = await authClient.signUp.email(
				{
					email,
					name: fullName,
					password,
				},
				{ onSuccess: () => navigate({ to: "/" }) },
			);
			if (error) {
				throw Error(error.message);
			}
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
					{saveUserMutation.error ? (
						<div className="text-red-500 flex justify-center">
							{saveUserMutation.error.message}
						</div>
					) : null}
					<form.AppField
						name="fullName"
						children={(field) => <field.TextField label="Full name" />}
					/>
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
