import { ESLint } from "eslint";

export default [
	{
		files: ["front-end/**/*.{js,jsx,ts,tsx}"],
		languageOptions: {
			parser: require.resolve("@typescript-eslint/parser"),
			ecmaVersion: 2021,
			sourceType: "module",
			ecmaFeatures: {
				jsx: true, // Enable JSX support for React
			},
		},
		plugins: {
			react: require("eslint-plugin-react"),
			"react-hooks": require("eslint-plugin-react-hooks"),
			"@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
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
		languageOptions: {
			ecmaVersion: 2021,
			sourceType: "script",
		},
		env: {
			node: true, // Enable Node.js globals and features
		},
		plugins: {
			node: require("eslint-plugin-node"),
		},
		rules: {
			// Node-specific rules
			"node/no-unsupported-features/es-syntax": "off", // Use Babel or transpiler if needed
			"node/no-missing-require": "error",
			"node/no-extraneous-require": "error",
			// Add more backend-specific rules
		},
	},
];
