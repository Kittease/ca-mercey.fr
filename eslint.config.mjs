import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import importPlugin from "eslint-plugin-import";
import a11yPlugin from "eslint-plugin-jsx-a11y";
import reactPlugin from "eslint-plugin-react";
import tailwindcssPlugin from "eslint-plugin-tailwindcss";
import unusedImports from "eslint-plugin-unused-imports";
import { dirname } from "path";
import tseslint from "typescript-eslint";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default tseslint.config(
  // Ignore typical build outputs and generated files
  { ignores: ["node_modules", ".next", "dist", "build", "next-env.d.ts"] },

  // Base JS recommended rules
  js.configs.recommended,

  // Next.js flat config (Core Web Vitals)
  nextPlugin.flatConfig.coreWebVitals,

  // Accessibility recommended flat config
  a11yPlugin.flatConfigs.recommended,

  // TailwindCSS flat recommended config
  tailwindcssPlugin.configs["flat/recommended"],

  // Project rules and plugins
  {
    name: "project/rules",
    plugins: {
      import: importPlugin,
      react: reactPlugin,
      "@typescript-eslint": tseslint.plugin,
      tailwindcss: tailwindcssPlugin,
      "unused-imports": unusedImports,
    },
    settings: {
      // Import resolver for TypeScript paths
      import: {
        resolver: {
          typescript: {
            project: "./tsconfig.json",
            alwaysTryTypes: true,
          },
        },
      },
      // React version detection for react rules
      react: { version: "detect" },
      tailwindcss: { config: `${__dirname}/src/app/globals.css` },
    },
    rules: {
      // Force import to be ordered correctly
      "import/order": [
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
      "import/no-relative-parent-imports": ["error", { ignore: ["@"] }],

      // Enforce newline between every TSX element
      "react/jsx-newline": ["error", { prevent: false }],

      // Enforce curly braces for all control flow statements
      curly: ["error", "all"],

      // Prevent unused imports and variables
      "@typescript-eslint/no-unused-vars": "error",
      "unused-imports/no-unused-imports": "error",

      // Configure no-unused-expressions rule properly
      "@typescript-eslint/no-unused-expressions": [
        "error",
        {
          allowShortCircuit: false,
          allowTernary: false,
          allowTaggedTemplates: false,
        },
      ],
    },
  },

  // TypeScript-specific: recommended, type-checked rules scoped to TS files
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      tseslint.configs.eslintRecommended,
      tseslint.configs.recommendedTypeChecked,
    ],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true,
      },
    },
    rules: {
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-return": "off",
    },
  }
);
