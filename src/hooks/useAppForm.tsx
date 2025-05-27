import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { TextField } from "@/components/forms/inputs/text-field";
import { SubmitButton } from "@/components/forms/submit-button";

export const { fieldContext, formContext, useFieldContext, useFormContext } =
	createFormHookContexts();

export const { useAppForm } = createFormHook({
	fieldComponents: {
		TextField,
	},
	formComponents: {
		SubmitButton,
	},
	fieldContext,
	formContext,
});
