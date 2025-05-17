import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { upsertPlaces } from "./upsert-places";
import { nationalTrustMockServer } from "test/mocks/national-trust/server";
import { db } from "@/db";
import { places } from "@/db/schema";

describe("upsertPlaces", () => {
	beforeAll(() => {
		nationalTrustMockServer.listen();
	});

	afterAll(() => {
		nationalTrustMockServer.close();
	});

	it("Should get places data and add it to the database", async () => {
		expect(await db.$count(places)).toBe(0);
		await upsertPlaces();
		expect(await db.$count(places)).toBeGreaterThan(0);
	});
});
