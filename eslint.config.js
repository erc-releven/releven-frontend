/** @typedef {import("typescript-eslint").Config} Config */

import baseConfig from "@acdh-oeaw/eslint-config";
import nextConfig from "@acdh-oeaw/eslint-config-next";
import playwrightConfig from "@acdh-oeaw/eslint-config-playwright";
import reactConfig from "@acdh-oeaw/eslint-config-react";
import tailwindcssConfig from "@acdh-oeaw/eslint-config-tailwindcss";
import gitignore from "eslint-config-flat-gitignore";

/** @type {Config} */
const config = [
	gitignore({ strict: false }),
	...baseConfig,
	...reactConfig,
	...nextConfig,
	...tailwindcssConfig,
	...playwrightConfig,
	{
		rules: {
			"arrow-body-style": ["error", "always"],
			"no-restricted-imports": [
				"error",
				{
					name: "next/link",
					message: "Please use @/components/link instead.",
				},
				{
					name: "next/navigation",
					importNames: ["redirect", "permanentRedirect", "useRouter", "usePathname"],
					message: "Please use @/lib/navigation instead.",
				},
				{
					name: "next/router",
					message: "Please use @/lib/navigation instead.",
				},
			],
			"prefer-arrow-callback": ["error", { allowNamedFunctions: true }],
			// "@typescript-eslint/explicit-module-boundary-types": "error",
			"@typescript-eslint/require-array-sort-compare": "error",
			// "@typescript-eslint/strict-boolean-expressions": "error",
			"react/jsx-sort-props": ["error", { reservedFirst: true }],
		},
	},
];

export default config;
