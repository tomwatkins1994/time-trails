import { useFormContext } from "@/hooks/useAppForm";
import { Button } from "@/components/ui/button";

export function SubmitButton({
	label,
	className,
}: { label: string; className?: string }) {
	const form = useFormContext();

	return (
		<form.Subscribe selector={(state) => state.isSubmitting}>
			{(isSubmitting) => (
				<Button type="submit" className={className} disabled={isSubmitting}>
					{label}
				</Button>
			)}
		</form.Subscribe>
	);
}
