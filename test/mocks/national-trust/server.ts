import { setupServer } from "msw/node";
import { placesHandler } from "./places-handler";
import { NT_BASE_URL } from "@/lib/national-trust/constants";

const handlers = [placesHandler];

const nationalTrustMockServer = setupServer(...handlers);

export const startNationalTrustMockServer = () =>
	nationalTrustMockServer.listen({
		onUnhandledRequest: ({ url }, print) => {
			if (!url.startsWith(NT_BASE_URL)) return;
			print.error();
		},
	});

export const stopNationalTrustMockServer = () =>
	nationalTrustMockServer.close();
