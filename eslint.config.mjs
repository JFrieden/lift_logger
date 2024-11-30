import { ESLint } from "eslint";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginTypescript from "@typescript-eslint/eslint-plugin";
import pluginTypescriptParser from "@typescript-eslint/parser";
import pluginNode from "eslint-plugin-node";
import { fixupPluginRules } from "@eslint/compat";

export default [
	{
		ignores: ["node_modules/**/*", "front-end/build/**/*"],
		files: ["front-end/**/*.{js,jsx,ts,tsx}"],
		languageOptions: {
			parser: pluginTypescriptParser,
			ecmaVersion: 2021,
			sourceType: "module",
			globals: {
				...globals.browser,
			},
		},
		plugins: {
			react: pluginReact,
			"react-hooks": pluginReactHooks,
			"@typescript-eslint": pluginTypescript,
		},
		rules: {
			// React-specific rules
			"react/react-in-jsx-scope": "off", // React 17+ doesn't require React in scope
			"react-hooks/rules-of-hooks": "error", // Checks rules of Hooks
			"react-hooks/exhaustive-deps": "warn", // Checks effect dependencies
			"@typescript-eslint/no-unused-vars": [
				"warn",
				{ argsIgnorePattern: "^_" },
			],
			// Add more React/TypeScript rules as needed
		},
		settings: {
			react: {
				version: "detect", // Automatically detect the React version
			},
		},
	},
	{
		files: ["back-end/**/*.js"],
		ignores: ["node_modules/**/*", "**/authMiddleware.js"],
		languageOptions: {
			ecmaVersion: 2021,
			sourceType: "script",
		},
		languageOptions: {
			globals: {
				...globals.node,
			},
		},
		plugins: {
			node: fixupPluginRules(pluginNode),
		},
		rules: {
			// Node-specific rules
			"node/no-unsupported-features/es-syntax": "off", // Use Babel or transpiler if needed
			"node/no-missing-require": "warn",
			"node/no-extraneous-require": "warn",
			// Add more backend-specific rules
		},
	},
];
