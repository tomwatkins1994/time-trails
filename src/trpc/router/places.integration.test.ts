import { beforeAll, describe, expect, it } from "vitest";
import { seed } from "drizzle-seed";
import assert from "node:assert";
import { createCaller } from "@/trpc/router";
import { db } from "@/db";
import { places } from "@/db/schema";

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
