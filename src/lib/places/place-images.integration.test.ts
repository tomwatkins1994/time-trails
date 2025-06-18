import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, beforeAll, describe, expect, it, beforeEach } from "vitest";
import fs from "node:fs/promises";
import path from "node:path";
import assert from "node:assert";
import {
	updatePlaceImageBlurhash,
	updatePlacesMissingImageBlurhash,
} from "./place-images";
import { db } from "@/db";
import { places } from "@/db/schema";

describe("Blurhashes", () => {
	const url = "https://localhost:3000/image.png";
	const mockServer = setupServer(
		...[
			http.get(url, async () => {
				const buffer = await fs.readFile(
					path.join(process.cwd(), "/src/assets/time-trails-icon.png"),
				);
				return HttpResponse.arrayBuffer(buffer);
			}),
		],
	);

	beforeAll(() => mockServer.listen());

	afterAll(() => mockServer.close());

	beforeEach(async () => db.delete(places));

	it("updatePlaceImageBlurhash should update an image blurhash", async () => {
		const place = await db
			.insert(places)
			.values({
				name: "Test place",
				description: "Test place",
				imageUrl: url,
				managedBy: "NATIONAL_TRUST",
				managerId: "1",
			})
			.returning();
		const placeId = place[0]?.id;
		assert(placeId);

		await updatePlaceImageBlurhash(placeId);
		const updatedPlace = await db.query.places.findFirst({
			where: (t, { eq }) => eq(t.id, placeId),
		});
		assert(updatedPlace);
		expect(updatedPlace.imageBlurhash?.length).toBeGreaterThan(0);
	});

	it("updatePlacesMissingImageBlurhash should update missing image blurhashes", async () => {
		const insertedPlaces = await db
			.insert(places)
			.values([
				{
					name: "Test place",
					description: "Test place",
					imageUrl: url,
					managedBy: "NATIONAL_TRUST",
					managerId: "1",
				},
				{
					name: "Test place",
					description: "Test place",
					imageUrl: url,
					managedBy: "NATIONAL_TRUST",
					managerId: "2",
				},
			])
			.returning();
		assert(insertedPlaces.length === 2);

		await updatePlacesMissingImageBlurhash();
		const updatedPlaces = await db.query.places.findMany({
			where: (t, { isNotNull }) => isNotNull(t.imageBlurhash),
		});
		expect(updatedPlaces.length).toBe(insertedPlaces.length);
		expect(updatedPlaces[0]?.imageBlurhash?.length).toBeGreaterThan(0);
		expect(updatedPlaces[1]?.imageBlurhash?.length).toBeGreaterThan(0);
	});
});
