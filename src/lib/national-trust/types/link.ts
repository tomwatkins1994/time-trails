import { z } from "zod";

export const NTLinkSchema = z.object({
	rel: z.string(),
	href: z.string(),
	description: z.string().nullable(),
	caption: z.string().nullable(),
	credit: z.string().nullable(),
});

export type NTLink = z.infer<typeof NTLinkSchema>;
