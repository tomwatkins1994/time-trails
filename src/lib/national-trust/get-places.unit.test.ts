import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { getPlaces } from "./get-places";
import { nationalTrustMockServer } from "../../../test/mocks/national-trust/server";
import { NT_BASE_URL } from "./constants";

describe("getPlaces", () => {
	beforeAll(() => {
		nationalTrustMockServer.listen({
			onUnhandledRequest: ({ url }) => {
				if (!url.startsWith(NT_BASE_URL)) return;
			},
		});
	});

	afterAll(() => {
		nationalTrustMockServer.close();
	});

	it("should fetch places data", async () => {
		const data = await getPlaces();
		expect(data).toHaveProperty("multiMatch");
		expect(data.multiMatch).toHaveProperty("input");
		expect(data.multiMatch).toHaveProperty("results");
		expect(data.multiMatch.results).toBeInstanceOf(Array);
		expect(data.multiMatch.results.length).toBeGreaterThan(0);
	});
});
