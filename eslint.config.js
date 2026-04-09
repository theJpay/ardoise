import { defineConfig, globalIgnores } from "eslint/config";
import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import prettierPlugin from "eslint-plugin-prettier";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
    globalIgnores(["dist"]),
    {
        files: ["**/*.{ts,tsx}"],
        extends: [
            js.configs.recommended,
            tseslint.configs.recommended,
            reactHooks.configs.flat.recommended,
            reactRefresh.configs.vite,
            prettier
        ],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser
        },
        plugins: {
            react,
            import: importPlugin,
            prettier: prettierPlugin
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
            "prettier/prettier": "error",
            "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
            curly: "error",
            "react/jsx-sort-props": [
                "warn",
                {
                    reservedFirst: true,
                    callbacksLast: true,
                    shorthandLast: true,
                    ignoreCase: true
                }
            ],
            "sort-imports": ["warn", { ignoreDeclarationSort: true, ignoreCase: true }],
            "import/order": [
                "error",
                {
                    groups: [
                        "builtin",
                        "external",
                        "internal",
                        ["parent", "sibling", "index"],
                        "type"
                    ],
                    pathGroups: [
                        {
                            pattern:
                                "@{assets,components,entities,hooks,queries,services,stores,utils}{,/**}",
                            group: "internal"
                        }
                    ],
                    pathGroupsExcludedImportTypes: ["type"],
                    alphabetize: { order: "asc", caseInsensitive: true },
                    "newlines-between": "always"
                }
            ]
        }
    }
]);
