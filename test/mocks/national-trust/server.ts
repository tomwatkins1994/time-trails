import { setupServer } from "msw/node";
import { placesHandler } from "./places-handler";

const handlers = [placesHandler];

export const nationalTrustMockServer = setupServer(...handlers);
