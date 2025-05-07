import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { getPlaces } from "./get-places";
import { nationalTrustMockServer } from "../../mocks/national-trust/server";

describe("getPlaces", () => {
	beforeAll(() => {
		nationalTrustMockServer.listen();
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
