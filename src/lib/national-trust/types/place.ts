import { z } from "zod";
import { NTLinkSchema } from "./link";

export const NTPlaceSchema = z.object({
	id: z.object({
		value: z.string(),
	}),
	type: z.literal("PLACE"),
	title: z.string(),
	description: z.string(),
	town: z.string().optional(),
	county: z.string().optional(),
	links: z.array(
		z.union([
			z.object({ imageLink: NTLinkSchema }),
			z.object({ link: NTLinkSchema }),
		]),
	),
	location: z.object({
		lat: z.number(),
		lon: z.number(),
	}),
	tagRefs: z.array(z.string()),
	websiteUrlPath: z.string(),
	dayOpeningStatus: z
		.array(
			z.object({
				date: z.string(),
				openingTimeStatus: z.string(),
			}),
		)
		.optional(),
	publicationChannels: z.string().array().optional(),
	cmsRegion: z.string(),
	websiteUrl: z.string(),
	imageUrl: z.string(),
	imageDescription: z.string(),
	subTitle: z.string().optional(),
});

export type NTPlace = z.infer<typeof NTPlaceSchema>;
