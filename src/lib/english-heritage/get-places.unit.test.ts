import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { getPlaces } from "./get-places";
import {
	startEnglishHeritageMockServer,
	stopEnglishHeritageMockServer,
} from "test/mocks/english-heritage/server";

describe("getPlaces", () => {
	beforeAll(() => {
		startEnglishHeritageMockServer();
	});

	afterAll(() => {
		stopEnglishHeritageMockServer();
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
