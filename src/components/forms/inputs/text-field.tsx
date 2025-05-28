import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFieldContext } from "@/hooks/useAppForm";
import { FieldErrors } from "./field-errorts";

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
				className={field.state.meta.errors.length > 0 ? "border-red-500" : ""}
				value={field.state.value}
				onChange={(e) => field.handleChange(e.target.value)}
			/>
			<FieldErrors />
		</div>
	);
}
