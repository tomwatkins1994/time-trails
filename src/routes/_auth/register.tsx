import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimeTrailsIcon } from "@/components/icons/time-trails-icon";
import { useAppForm } from "@/hooks/useAppForm";
import { authClient } from "@/lib/auth/client";

export const Route = createFileRoute("/_auth/register")({
	component: RouteComponent,
});

const RegisterSchema = z.object({
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
			onSubmit: RegisterSchema.superRefine(
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
			await registerMutation.mutateAsync(value);
		},
	});

	const registerMutation = useMutation({
		mutationFn: async ({
			fullName,
			email,
			password,
		}: z.infer<typeof RegisterSchema>) => {
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
				<CardTitle className="flex justify-center">
					<Link
						to="/"
						className="flex items-center gap-2 text-2xl md:text-3xl font-medium font-[Cinzel]"
					>
						<TimeTrailsIcon className="h-10 md:h-12" />
						Time Trails
					</Link>
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
					{registerMutation.error ? (
						<div className="text-red-500 flex justify-center">
							{registerMutation.error.message}
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
					<div className="text-center">
						Already got an account?{" "}
						<Link to="/login" className="underline">
							Login
						</Link>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
