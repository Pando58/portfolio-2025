import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import stylistic from "@stylistic/eslint-plugin";
import svelte from "eslint-plugin-svelte";
import globals from "globals";
import "eslint-plugin-only-warn";

export default [
	stylistic.configs.customize({
		indent: "tab",
		quotes: "double",
		semi: true,
		braceStyle: "1tbs",
		commaDangle: "always-multiline",
		arrowParens: true,
		quoteProps: "consistent-as-needed",
		blockSpacing: true,
		jsx: false,
	}),
	...tseslint.config(
		{
			ignores: [
				".svelte-kit/",
			],
		},
		eslint.configs.recommended,
		tseslint.configs.recommended,
		...svelte.configs["flat/recommended"],
		{
			languageOptions: {
				globals: {
					...globals.browser,
					...globals.node,
				},
				parserOptions: {
					extraFileExtensions: [".svelte"],
					projectService: true,
					parser: tseslint.parser,
				},
			},
			rules: {
				"@typescript-eslint/no-unused-vars": ["warn", {
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^_",
					caughtErrorsIgnorePattern: "^_",
				}],
				// "svelte/prefer-const": "warn", // Could not find "prefer-const" in plugin "svelte"
				"svelte/first-attribute-linebreak": "warn",
				"svelte/html-closing-bracket-new-line": "warn",
				"svelte/html-closing-bracket-spacing": "warn",
				"svelte/indent": ["warn", { indent: "tab" }],
				"svelte/html-quotes": "warn",
				"svelte/html-self-closing": ["warn", {
					void: "always",
					normal: "never",
					foreign: "always",
					component: "always",
					svelte: "always",
				}],
				"svelte/mustache-spacing": "warn",
				"svelte/no-spaces-around-equal-signs-in-attribute": "warn",
				"svelte/shorthand-attribute": "warn",
				"svelte/shorthand-directive": "warn",
				"svelte/sort-attributes": "warn",
				"svelte/spaced-html-comment": "warn",
			},
		},
	),
];
