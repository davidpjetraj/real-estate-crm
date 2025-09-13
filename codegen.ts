import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:4000/graphql", // Replace with your GraphQL endpoint
  documents: ["src/**/*.{ts,tsx}", "!src/lib/graphql/generated/**/*"],
  generates: {
    "src/lib/graphql/generated/graphql.tsx": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ],
      config: {
        withHooks: true,
        withComponent: false,
        withHOC: false,
        skipTypename: false,
        withResultType: true,
        withVariablesType: true,
        apolloReactHooksImportFrom: "@apollo/client",
        documentMode: "documentNode",
        pureMagicComment: true,
        namingConvention: {
          typeNames: "pascal-case#pascalCase",
          transformUnderscore: true,
        },
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
