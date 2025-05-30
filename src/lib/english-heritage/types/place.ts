import { z } from "zod";

export const EHPlaceSchema = z.object({
	ID: z.number(),
	Title: z.string(),
	Summary: z.string(),
	Path: z.string(),
	ImagePath: z.string(),
	ImageAlt: z.string().optional(),
	County: z.string().optional(),
	Region: z.string(),
	Latitude: z.number({ coerce: true }),
	Longitude: z.number({ coerce: true }),
	Distance: z.number(),
	HasValidLatLong: z.boolean(),
	IsTopHeritageSite: z.boolean(),
	IsFreeEntry: z.boolean(),
	PrimaryPropertyType: z.number(),
	SelectedPropertyTypeList: z.number().array(),
	SelectedFacilityList: z.number().array(),
});

export type EHPlace = z.infer<typeof EHPlaceSchema>;
