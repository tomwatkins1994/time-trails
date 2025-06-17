import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("cachedQuery", () => {
	const key = "query";
	const args = { arg1: "value" };
	const query = vi.fn(async () => "result");

	beforeEach(() => {
		vi.resetModules();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("Should get the value from the function call if not in the cache", async () => {
		const get = vi.fn(async () => null);
		const set = vi.fn(async () => null);
		vi.doMock("./redis", async (importOriginal) => {
			return {
				...(await importOriginal()),
				redis: {
					get,
					set,
				},
			};
		});

		const { cachedQuery } = await import("./cached-query");
		const result = await cachedQuery(key, args, query);
		expect(result).toBe("result");
		expect(get).toHaveBeenCalled();
		expect(query).toHaveBeenCalled();
		expect(set).toHaveBeenCalled();
	});

	it("Should get the value from the cache if found", async () => {
		const get = vi.fn(async () => "result");
		const set = vi.fn(async () => null);
		vi.doMock("./redis", async (importOriginal) => {
			return {
				...(await importOriginal()),
				redis: {
					get,
					set,
				},
			};
		});

		const { cachedQuery } = await import("./cached-query");
		const result = await cachedQuery(key, args, query);
		expect(result).toBe("result");
		expect(get).toHaveBeenCalled();
		expect(query).not.toHaveBeenCalled();
		expect(set).not.toHaveBeenCalled();
	});
});
