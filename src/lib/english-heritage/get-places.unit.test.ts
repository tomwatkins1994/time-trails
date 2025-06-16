import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { getPlaces } from "./get-places";
import { englishHeritageMockServer } from "test/mocks/english-heritage/server";
import { EH_BASE_URL } from "./constants";

describe("getPlaces", () => {
	beforeAll(() => {
		englishHeritageMockServer.listen({
			onUnhandledRequest: ({ url }) => {
				if (!url.startsWith(EH_BASE_URL)) return;
			},
		});
	});

	afterAll(() => {
		englishHeritageMockServer.close();
	});

	it("should fetch places data", async () => {
		const data = await getPlaces();
		expect(data).toHaveProperty("Total");
		expect(data.Total).toBe(388);
		expect(data).toHaveProperty("Results");
		expect(data.Results).toBeInstanceOf(Array);
		expect(data.Results.length).toBe(388);
	});
});
