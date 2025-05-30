import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimeTrailsIcon } from "@/components/icons/time-trails-icon";
import { useAppForm } from "@/hooks/useAppForm";
import { authClient } from "@/lib/auth/client";

export const Route = createFileRoute("/_auth/login")({
	component: RouteComponent,
});

const LoginSchema = z.object({
	email: z.string().email(),
	password: z.string().nonempty(),
});

function RouteComponent() {
	const navigate = useNavigate();
	const form = useAppForm({
		defaultValues: {
			email: "",
			password: "",
		},
		validators: {
			onSubmit: LoginSchema,
		},
		onSubmit: async ({ value }) => {
			await loginMutation.mutateAsync(value);
		},
	});

	const loginMutation = useMutation({
		mutationFn: async ({ email, password }: z.infer<typeof LoginSchema>) => {
			const { error } = await authClient.signIn.email(
				{
					email,
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
					Login
				</div>
				<form
					className="space-y-4"
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}
				>
					{loginMutation.error ? (
						<div className="text-red-500 flex justify-center">
							{loginMutation.error.message}
						</div>
					) : null}
					<form.AppField
						name="email"
						children={(field) => <field.TextField label="Email" />}
					/>
					<form.AppField
						name="password"
						children={(field) => <field.TextField label="Password" secret />}
					/>
					<form.AppForm>
						<form.SubmitButton label="Login" className="w-full" />
					</form.AppForm>
					<div className="text-center">
						Not got an account?{" "}
						<Link to="/register" className="underline">
							Register
						</Link>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
