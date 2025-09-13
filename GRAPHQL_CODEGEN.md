# GraphQL Code Generation Setup

This project is configured with GraphQL Code Generation to automatically generate TypeScript types and React Apollo hooks from your GraphQL queries and mutations.

## Configuration

The codegen configuration is defined in `codegen.ts` and includes:

- **Schema**: Points to your GraphQL endpoint (currently set to `http://localhost:4000/graphql`)
- **Documents**: Scans all TypeScript files in `src/` for GraphQL operations
- **Output**: Generates files in `src/lib/graphql/generated/`

## Generated Files

- `graphql.tsx` - Complete GraphQL types and React Apollo hooks in a single file

## Usage

### 1. Update Schema URL

Before running codegen, update the schema URL in `codegen.ts`:

```typescript
schema: "https://your-graphql-endpoint.com/graphql",
```

### 2. Run Code Generation

```bash
# Generate types and hooks once
yarn codegen
# or use the shorter command
yarn gen

# Watch for changes and regenerate automatically
yarn codegen:watch
```

### 3. Use Generated Hooks

After running codegen, you can use the generated hooks in your components:

```typescript
import {
  useGetPropertiesQuery,
  useCreatePropertyMutation,
} from "@/lib/graphql/generated/graphql";

function PropertyList() {
  const { data, loading, error } = useGetPropertiesQuery();
  const [createProperty] = useCreatePropertyMutation();

  // Your component logic
}
```

### 4. Writing GraphQL Operations

Write your GraphQL operations in `.ts` or `.tsx` files using the `gql` template literal:

```typescript
import { gql } from "@apollo/client";

export const GET_PROPERTIES = gql`
  query GetProperties {
    properties {
      id
      title
      price
    }
  }
`;
```

## File Structure

```
src/
├── lib/
│   └── graphql/
│       ├── generated/          # Generated files (don't edit)
│       │   └── graphql.tsx     # All types and hooks in one file
│       ├── user.ts            # Your GraphQL operations
│       └── property.ts        # Your GraphQL operations
```

## Notes

- The generated files are automatically ignored by git
- Run `yarn codegen` after adding new GraphQL operations
- Use `yarn codegen:watch` during development for automatic regeneration
