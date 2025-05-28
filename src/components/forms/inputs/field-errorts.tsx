import { useFieldContext } from "@/hooks/useAppForm";

export function FieldErrors() {
	const field = useFieldContext();

	if (field.state.meta.errors.length === 0) {
		return;
	}

	return (
		<>
			{field.state.meta.errors.map((error, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: Ignore for now, not many options
				<div key={i} className="text-red-500">
					{error.message}
				</div>
			))}
		</>
	);
}
