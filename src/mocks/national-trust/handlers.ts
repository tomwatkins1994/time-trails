import { http, HttpResponse } from "msw";

export const handlers = [
	http.get("https://www.nationaltrust.org.uk/api/search/places", () => {
		return HttpResponse.json({
			multiMatch: {
				input: "",
				results: [
					{
						id: {
							value: "375",
						},
						type: "PLACE",
						title: "Wimpole Estate",
						description:
							"A living working estate, guided by the seasons with an impressive mansion, parkland, gardens and rare breed farm.",
						town: "Royston",
						county: "Cambridgeshire",
						links: [
							{
								imageLink: {
									rel: "image",
									href: "https://nt.global.ssl.fastly.net/binaries/content/gallery/website/national/regions/cambridgeshire/places/wimpole-estate/library/spring/lambs-in-the-parkland-at-wimpole-estate-cambridgeshire.jpg",
									description:
										"Lambs in the parkland at Wimpole Estate, Cambridgeshire",
									caption:
										"Lambs in the parkland at Wimpole Estate, Cambridgeshire",
									credit: "Elliot Neale",
								},
							},
							{
								link: {
									rel: "website",
									href: "https://www.nationaltrust.org.uk/visit/cambridgeshire/wimpole-estate",
									description: null,
									caption: null,
									credit: null,
								},
							},
						],
						location: {
							lat: 52.1400038,
							lon: -0.0488461,
						},
						tagRefs: ["TAG000411"],
						websiteUrlPath: "/visit/cambridgeshire/wimpole-estate",
						dayOpeningStatus: [
							{
								date: "2025-05-08",
								openingTimeStatus: "FULLY_OPEN",
							},
						],
						publicationChannels: [
							"NATIONAL_TRUST_ORG_UK",
							"NATIONAL_TRUST_MOBILE_APPLICATION",
						],
						cmsRegion: "cambridge",
						websiteUrl:
							"https://www.nationaltrust.org.uk/visit/cambridgeshire/wimpole-estate",
						imageUrl:
							"https://nt.global.ssl.fastly.net/binaries/content/gallery/website/national/regions/cambridgeshire/places/wimpole-estate/library/spring/lambs-in-the-parkland-at-wimpole-estate-cambridgeshire.jpg",
						imageDescription:
							"Lambs in the parkland at Wimpole Estate, Cambridgeshire",
						subTitle: "Royston, Cambridgeshire",
					},
				],
				aggregations: null,
			},
		});
	}),
];
