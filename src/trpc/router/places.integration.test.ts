import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { seed } from "drizzle-seed";
import assert from "node:assert";
import { createCaller } from "@/trpc/router";
import { db } from "@/db";
import { places } from "@/db/schema";
import { redis } from "@/db/redis";

describe("getById", () => {
	const ctx = {};
	const caller = createCaller(ctx);

	it("should get a place by ID", async () => {
		const insertedPlace = await db
			.insert(places)
			.values({
				name: "Test place",
				description: "Test place",
				managedBy: "NATIONAL_TRUST",
				managerId: "1",
			})
			.returning();
		const placeId = insertedPlace[0]?.id;
		assert(placeId);

		const place = await caller.places.getById({ id: placeId });
		expect(place).not.toBeUndefined();
		expect(place?.id).toBe(placeId);
	});
});

describe("infiniteList", () => {
	const ctx = {};
	const caller = createCaller(ctx);

	const pages = 5;
	const limit = 10;

	beforeAll(async () => {
		await db.delete(places);
		await seed(db, { places }, { count: pages * limit });
	});

	it("should get a page of data with the correct size and with a next cursor", async () => {
		const { items, nextCursor } = await caller.places.infiniteList({
			cursor: null,
			limit,
		});
		expect(items).toHaveLength(limit);
		expect(nextCursor).toBeTruthy();
	});

	it("should get all pages of data", async () => {
		let cursor: string | null = null;
		for (let i = 1; i <= pages; i++) {
			const { items, nextCursor } = await caller.places.infiniteList({
				cursor,
				limit,
			});
			expect(items).toHaveLength(limit);
			if (i > 1) {
				expect(items[0]?.id).toBe(cursor);
			}
			if (i === pages) {
				expect(nextCursor).toBe(null);
			}
			cursor = nextCursor;
		}
	});
});

describe("getRandomImages", () => {
	const ctx = {};
	const caller = createCaller(ctx);

	const numberOfImages = 4;

	beforeEach(async () => {
		await db.delete(places);
		await redis.flushall();

		await seed(db, { places }, { count: 100 });
	});

	it("should get the amount images requested", async () => {
		const images = await caller.places.getRandomImages({
			number: numberOfImages,
		});
		expect(images).toHaveLength(numberOfImages);
	});

	it("should get no images if there are none with image URLs", async () => {
		await db.update(places).set({ imageUrl: null });

		const images = await caller.places.getRandomImages({
			number: numberOfImages,
		});
		expect(images).toHaveLength(0);
	});

	it("should get the same images requested due to caching", async () => {
		const images1 = await caller.places.getRandomImages({
			number: numberOfImages,
		});
		const images2 = await caller.places.getRandomImages({
			number: numberOfImages,
		});
		expect(images1).toEqual(images2);
	});

	it("should get different images when cache is cleared", async () => {
		const images1 = await caller.places.getRandomImages({
			number: numberOfImages,
		});
		await redis.flushall();
		const images2 = await caller.places.getRandomImages({
			number: numberOfImages,
		});
		expect(images1).not.toEqual(images2);
	});
});
