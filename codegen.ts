import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  // schema: "http://192.168.0.102:8080/graphql",
  schema: "https://real-estate-server-ornc.onrender.com/graphql",
  documents: [
    "src/**/*.{ts,tsx,gql,graphql}",
    "!src/lib/graphql/generated/**/*",
  ],
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
