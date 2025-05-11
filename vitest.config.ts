import { defineConfig } from "vitest/config";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	test: {
		setupFiles: ["./test/setup-test-db.ts"],
	},
	plugins: [
		tsConfigPaths({
			projects: ["./tsconfig.json"],
		}),
	],
});
