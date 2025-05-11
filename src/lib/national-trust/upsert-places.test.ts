import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { upsertPlaces } from "./upsert-places";
import { nationalTrustMockServer } from "@/mocks/national-trust/server";
import { db } from "@/db";
import { places } from "@/db/schema";

describe("upsertPlaces", () => {
	beforeAll(() => {
		nationalTrustMockServer.listen();
		db.delete(places);
	});

	afterAll(() => {
		nationalTrustMockServer.close();
	});

	afterEach(() => {
		db.delete(places);
	});

	it("Should get places data and add it to the database", async () => {
		await upsertPlaces();

		expect(await db.$count(places)).toBeGreaterThan(0);
	});
});
