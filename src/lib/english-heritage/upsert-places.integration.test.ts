import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { upsertPlaces } from "./upsert-places";
import { db } from "@/db";
import { places } from "@/db/schema";
import {
	startEnglishHeritageMockServer,
	stopEnglishHeritageMockServer,
} from "test/mocks/english-heritage/server";

describe("upsertPlaces", () => {
	beforeAll(() => {
		startEnglishHeritageMockServer();
	});

	afterAll(() => {
		stopEnglishHeritageMockServer();
	});

	it("Should get places data and add it to the database", async () => {
		expect(await db.$count(places)).toBe(0);
		await upsertPlaces();
		expect(await db.$count(places)).toBeGreaterThan(0);
	});
});
