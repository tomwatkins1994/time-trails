import { useFieldContext } from "@/hooks/useAppForm";

export function FieldErrors() {
	const field = useFieldContext();

	if (field.state.meta.errors.length === 0) {
		return;
	}

	return (
		<>
			{field.state.meta.errors.map((error) => (
				<div key={error.message} className="text-red-500">
					{error.message}
				</div>
			))}
		</>
	);
}
