import { setupServer } from "msw/node";
import { placesHandler } from "./places-handler";
import { EH_BASE_URL } from "@/lib/english-heritage/constants";

const handlers = [placesHandler];

const englishHeritageMockServer = setupServer(...handlers);

export const startEnglishHeritageMockServer = () =>
	englishHeritageMockServer.listen({
		onUnhandledRequest: ({ url }, print) => {
			if (!url.startsWith(EH_BASE_URL)) return;
			print.error();
		},
	});

export const stopEnglishHeritageMockServer = () =>
	englishHeritageMockServer.close();
