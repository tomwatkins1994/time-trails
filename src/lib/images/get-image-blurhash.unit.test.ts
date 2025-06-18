import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import fs from "node:fs/promises";
import path from "node:path";
import { getImageBlurhash } from "./get-image-blurhash";

describe("getImageBlurhash", () => {
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

	beforeAll(() => mockServer.listen({ onUnhandledRequest: "bypass" }));

	afterAll(() => mockServer.close());

	it("Should fetch the image and generate a blurhash", async () => {
		const blurhash = await getImageBlurhash(url);
		expect(blurhash).not.toBeNull();
		expect(blurhash.length).toBeGreaterThan(0);
	});
});
