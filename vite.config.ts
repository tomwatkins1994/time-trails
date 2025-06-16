import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

export default defineConfig({
	plugins: [
		tsConfigPaths({
			projects: ["./tsconfig.json"],
		}),
		tailwindcss(),
		tanstackStart(),
	],
	test: {
		projects: [
			{
				extends: true,
				test: {
					name: "unit",
					include: ["**/*.unit.test.ts"],
				},
			},
			{
				extends: true,
				test: {
					name: "integration",
					include: ["**/*.integration.test.ts"],
					setupFiles: ["./test/setup-test-db.ts"],
				},
			},
		],
	},
});
