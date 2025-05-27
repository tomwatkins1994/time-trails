import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFieldContext } from "@/hooks/useAppForm";

export function TextField({
	label,
	secret,
}: { label: string; secret?: boolean }) {
	const field = useFieldContext<string>();

	return (
		<div className="space-y-2">
			<Label htmlFor={field.name}>{label}</Label>
			<Input
				id={field.name}
				type={secret ? "password" : "text"}
				value={field.state.value}
				onChange={(e) => field.handleChange(e.target.value)}
			/>
		</div>
	);
}
