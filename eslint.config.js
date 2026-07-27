import { defineConfig, globalIgnores } from "eslint/config";
import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import perfectionist from "eslint-plugin-perfectionist";
import prettierPlugin from "eslint-plugin-prettier";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
    globalIgnores(["**/dist"]),
    {
        files: ["**/*.{ts,tsx}"],
        extends: [js.configs.recommended, tseslint.configs.recommended, prettier],
        plugins: {
            perfectionist,
            prettier: prettierPlugin
        },
        rules: {
            "prettier/prettier": "error",
            "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
            curly: "error",
            "sort-imports": ["warn", { ignoreDeclarationSort: true, ignoreCase: true }],
            "perfectionist/sort-imports": [
                "error",
                {
                    type: "alphabetical",
                    order: "asc",
                    ignoreCase: true,
                    newlinesBetween: 1,
                    internalPattern: ["^@ardoise/"],
                    groups: [
                        "builtin",
                        "external",
                        "internal",
                        ["parent", "sibling", "index"],
                        "type"
                    ]
                }
            ]
        }
    },
    {
        files: ["apps/api/**/*.ts"],
        languageOptions: {
            globals: globals.node
        }
    },
    {
        files: ["apps/client/**/*.{ts,tsx}"],
        extends: [reactHooks.configs.flat.recommended, reactRefresh.configs.vite],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
            "react-hooks/refs": "off",
            "perfectionist/sort-jsx-props": [
                "warn",
                {
                    type: "alphabetical",
                    order: "asc",
                    ignoreCase: true,
                    groups: ["reserved", "unknown", "shorthand-prop", "callback"],
                    customGroups: [
                        { groupName: "reserved", elementNamePattern: "^(key|ref)$" },
                        { groupName: "callback", elementNamePattern: "^on[A-Z]" }
                    ]
                }
            ],
            "perfectionist/sort-imports": [
                "error",
                {
                    type: "alphabetical",
                    order: "asc",
                    ignoreCase: true,
                    newlinesBetween: 1,
                    internalPattern: [
                        "^@ardoise/",
                        "^@(assets|components|editor|entities|hooks|services|stores|utils)(/|$)"
                    ],
                    groups: [
                        "builtin",
                        "external",
                        "internal",
                        ["parent", "sibling", "index"],
                        "type"
                    ]
                }
            ]
        }
    }
]);
