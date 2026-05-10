import js from "@eslint/js";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import nextPlugin from "@next/eslint-plugin-next";
import prettierConfig from "eslint-config-prettier/flat";
import importPlugin from "eslint-plugin-import-x";
import a11yPlugin from "eslint-plugin-jsx-a11y";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import tailwindcssPlugin from "eslint-plugin-tailwindcss";
import unusedImports from "eslint-plugin-unused-imports";
import tseslint from "typescript-eslint";

const SOURCE_FILES = ["**/*.{js,mjs,cjs,jsx,ts,tsx}"];

export default tseslint.config(
  // Ignore typical build outputs and generated files
  { ignores: ["node_modules", ".next", "next-env.d.ts"] },

  // JS/TS/JSX/TSX shared configs — scoped explicitly so they don't bleed into JSON/Markdown
  { files: SOURCE_FILES, extends: [js.configs.recommended] },
  { files: SOURCE_FILES, extends: [nextPlugin.configs["core-web-vitals"]] },
  { files: SOURCE_FILES, extends: [a11yPlugin.flatConfigs.recommended] },
  {
    files: SOURCE_FILES,
    extends: [tailwindcssPlugin.configs["flat/recommended"]],
  },
  { files: SOURCE_FILES, extends: [reactPlugin.configs.flat.recommended] },
  { files: SOURCE_FILES, extends: [reactPlugin.configs.flat["jsx-runtime"]] },

  // React Hooks v7 — Rules of Hooks, exhaustive deps, and React Compiler rules
  // (the v7 release absorbed eslint-plugin-react-compiler).
  // v7 ships `configs.recommended` in the legacy `{ plugins, rules }` shape,
  // so we only spread `.rules` and register the plugin ourselves.
  {
    name: "react-hooks",
    files: SOURCE_FILES,
    plugins: { "react-hooks": reactHooksPlugin },
    rules: reactHooksPlugin.configs.recommended.rules,
  },

  // Lint JSON / JSONC (`json/jsonc` parses plain JSON too, so one block covers both)
  {
    name: "json",
    files: ["**/*.json", "**/*.jsonc"],
    language: "json/jsonc",
    plugins: { json },
    rules: json.configs.recommended.rules,
  },

  // Lint Markdown
  {
    name: "markdown",
    files: ["**/*.md"],
    language: "markdown/gfm",
    plugins: { markdown },
    rules: markdown.configs.recommended[0].rules,
  },

  // Project rules and plugins
  {
    name: "project/rules",
    files: SOURCE_FILES,
    plugins: {
      "import-x": importPlugin,
      react: reactPlugin,
      tailwindcss: tailwindcssPlugin,
      "unused-imports": unusedImports,
    },
    settings: {
      // Import resolver for TypeScript paths
      "import-x/resolver": {
        typescript: {
          project: "./tsconfig.json",
          alwaysTryTypes: true,
        },
      },
      // Pin React version explicitly: "detect" hits an eslint-plugin-react v7
      // code path incompatible with ESLint v10 (contextOrFilename.getFilename)
      react: { version: "19" },
      tailwindcss: { config: `${import.meta.dirname}/src/app/globals.css` },
    },
    rules: {
      // Force import to be ordered correctly
      "import-x/order": [
        "error",
        {
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
          groups: [
            ["builtin", "external"],
            "internal",
            "parent",
            ["sibling", "index"],
            "type",
          ],
          pathGroups: [
            {
              pattern: "@/**",
              group: "internal",
              position: "before",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
        },
      ],

      // Forbid the use of relative parent imports
      "import-x/no-relative-parent-imports": ["error", { ignore: ["@"] }],

      // Enforce newline between every TSX element
      "react/jsx-newline": "error",

      // PropTypes are unnecessary in a TypeScript project — types cover this
      "react/prop-types": "off",

      // Enforce curly braces for all control flow statements
      curly: ["error", "all"],

      // Prevent unused imports and variables (autofixes imports on --fix)
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": "error",

      // Tailwind class ordering is handled by prettier-plugin-tailwindcss
      "tailwindcss/classnames-order": "off",
    },
  },

  // TypeScript-specific: strict + stylistic type-checked rules scoped to TS files
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
    ],
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Handled by unused-imports/no-unused-vars (which is auto-fixable for imports)
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-unused-expressions": [
        "error",
        {
          allowShortCircuit: false,
          allowTernary: false,
          allowTaggedTemplates: false,
        },
      ],
      // Allow passing async functions to JSX event handler attributes
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: { attributes: false } },
      ],
      // Numbers and booleans in `${x}` are everyday patterns — disallowing them is noise
      "@typescript-eslint/restrict-template-expressions": [
        "error",
        { allowNumber: true, allowBoolean: true },
      ],
      // `type` and `interface` are both fine — choice should be local, not enforced
      "@typescript-eslint/consistent-type-definitions": "off",
      // Enforce `??` in place of `||` / ternaries, but not the `??=` if-statement rewrite
      "@typescript-eslint/prefer-nullish-coalescing": [
        "error",
        { ignoreIfStatements: true },
      ],
    },
  },

  // Untyped external API boundaries — response payloads are `any`
  {
    files: ["src/lib/spotify-client/**", "src/lib/statsfm-client/**"],
    rules: {
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-return": "off",
    },
  },

  // Disable stylistic rules that conflict with Prettier (must come last)
  prettierConfig,
);
