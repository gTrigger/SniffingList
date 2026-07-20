import eslintJs from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import globals from "globals";

export default [
    {
        ignores: [
            ".next/**",
            "out/**",
            "node_modules/**",
            "public/**",
        ]
    },
    eslintJs.configs.recommended,
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        plugins: {
            "@next/next": nextPlugin,
        },
        rules: {
            ...nextPlugin.configs.recommended.rules,
            ...nextPlugin.configs["core-web-vitals"].rules,
        },
    },
];