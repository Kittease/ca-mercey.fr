module.exports = {
  extends: [
    "plugin:@typescript-eslint/recommended",
    "airbnb",
    "airbnb-typescript",
    "plugin:@next/next/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:jsx-a11y/recommended",
    "plugin:react-hooks/recommended",
    "plugin:tailwindcss/recommended",
    "prettier",
  ],
  plugins: [
    "unused-imports",
    "no-relative-import-paths",
    "import",
    "react",
    "tailwindcss",
  ],
  parserOptions: {
    project: "./tsconfig.json",
  },
  ignorePatterns: [".eslintrc.js"],
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        project: ["tsconfig.json"],
      },
    },
    tailwindcss: {
      callees: ["twMerge", "clsx", "cn"],
    },
  },
  rules: {
    // eslint
    radix: "off",
    curly: "error",
    "no-console": "warn",
    "no-multiple-empty-lines": [
      "error",
      {
        max: 1,
        maxEOF: 1,
      },
    ],
    "arrow-body-style": "off",
    "max-classes-per-file": "off",
    "no-empty-function": [
      "error",
      {
        allow: ["constructors"],
      },
    ],
    // @typescript-eslint/eslint-plugin
    "@typescript-eslint/indent": "off",
    "@typescript-eslint/prefer-optional-chain": "error",
    "@typescript-eslint/prefer-nullish-coalescing": "error",
    // eslint-plugin-unused-imports
    "no-unused-vars": "warn",
    "unused-imports/no-unused-imports": "warn",
    "unused-imports/no-unused-vars": [
      "warn",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],
    // eslint-plugin-no-relative-import-paths
    "no-relative-import-paths/no-relative-import-paths": [
      "warn",
      {
        allowSameFolder: true,
        rootDir: "src",
        prefix: "@",
      },
    ],
    // eslint-plugin-import
    "import/prefer-default-export": "off",
    "import/order": [
      "warn",
      {
        groups: [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
        ],
        pathGroups: [
          {
            pattern: "{app,domain,lib}{,/**}",
            group: "internal",
          },
        ],
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
        "newlines-between": "always",
        warnOnUnassignedImports: true,
      },
    ],
    "import/first": "error",
    "import/newline-after-import": "error",
    "import/no-duplicates": "error",
    // eslint-plugin-react
    "react/jsx-key": "error",
    "react/require-default-props": "off",
    "react/function-component-definition": "off",
    "react/jsx-props-no-spreading": "off",
    "react/react-in-jsx-scope": "off",
    "react/jsx-filename-extension": [
      1,
      {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    ],
    "react/prop-types": "off", // prevent error in shadcn imported components
    "jsx-a11y/heading-has-content": "off", // prevent error in shadcn imported components
  },
};
