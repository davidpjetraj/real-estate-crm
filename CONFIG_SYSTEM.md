# Configuration System Documentation

This document explains how to use the configuration system in the real estate application, **exactly like the paloka_crm project**.

## Overview

The configuration system provides a centralized way to manage application configuration data such as users, states, cities, and streets. It includes:

- **Automatic loading** of config data on authentication
- **Real-time updates** via GraphQL subscriptions
- **Persistent storage** with Zustand
- **Easy-to-use hooks** for components
- **Background refresh** every 5 minutes

## Architecture - Single Store Pattern (like paloka_crm)

### Core Components

1. **`useAuth` Store** (`/store/useAuth.tsx`) - **ALL config logic here**

   - Contains authentication AND configuration in one store
   - Manages config data, loading state, and subscriptions
   - Handles GraphQL queries and subscriptions
   - No separate config store - everything in useAuth

2. **Config Hooks** (`/src/hooks/use-config.ts`)

   - `useConfigData()` - Access raw config data from useAuth
   - `useConfigArrays()` - Get config arrays from useAuth
   - `useConfigOptions()` - Get formatted options for dropdowns

3. **ConfigProvider** (`/src/components/ConfigProvider/index.tsx`)
   - Initializes config system when user is authenticated
   - Sets up periodic background refresh
   - Manages subscription lifecycle

## Usage

### 1. Basic Usage in Components

```tsx
import { useConfigData } from "@/hooks/use-config";

function MyComponent() {
  const { users, states, cities, streets, loading, error } = useConfigData();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h3>Users: {users.length}</h3>
      <h3>States: {states.length}</h3>
      <h3>Cities: {cities.length}</h3>
      <h3>Streets: {streets.length}</h3>
    </div>
  );
}
```

### 2. Using Config Options for Dropdowns

```tsx
import { useConfigOptions } from "@/hooks/use-config";
import { Select, MenuItem } from "@mui/material";

function LocationSelector() {
  const { stateOptions, cityOptions } = useConfigOptions();

  return (
    <div>
      <Select>
        {stateOptions.map((state) => (
          <MenuItem key={state.value} value={state.value}>
            {state.label}
          </MenuItem>
        ))}
      </Select>

      <Select>
        {cityOptions.map((city) => (
          <MenuItem key={city.value} value={city.value}>
            {city.label}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
}
```

### 3. Manual Config Loading

```tsx
import { useConfigData } from "@/hooks/use-config";
import { Button } from "@mui/material";

function ConfigManager() {
  const { loadConfig, loading } = useConfigData();

  return (
    <Button onClick={loadConfig} disabled={loading}>
      Refresh Config
    </Button>
  );
}
```

### 4. Direct Access from useAuth Store

```tsx
import useAuth from "@/store/useAuth";

function MyComponent() {
  const configData = useAuth((state) => state.config_data);
  const configVersion = useAuth((state) => state.config_version);
  const configLoading = useAuth((state) => state.config_loading);
  const loadConfig = useAuth((state) => state.loadConfig);

  return (
    <div>
      <p>Config Version: {configVersion}</p>
      <p>Users: {configData.users.length}</p>
      <button onClick={loadConfig} disabled={configLoading}>
        {configLoading ? "Loading..." : "Refresh Config"}
      </button>
    </div>
  );
}
```

## GraphQL Queries

### AppConfigs Query

```graphql
query AppConfigs {
  appConfigs {
    users {
      id
      first_name
      last_name
      name
      email
      phone
      birthday
      status
      avatar
      created_at
    }
    states {
      id
      name
      created_at
    }
    cities {
      id
      name
      created_at
    }
    streets {
      id
      name
      created_at
    }
    version
  }
}
```

### Config Version Subscription

```graphql
subscription AppConfigVersionUpdated {
  appConfigVersionUpdated {
    version
  }
}
```

## Configuration Flow

1. **User Authentication**: When user logs in, `useAuth.initData()` is called
2. **Config Loading**: `useAuth.loadConfig()` fetches fresh config data
3. **Subscription Start**: Real-time subscription for version updates begins
4. **Background Refresh**: Every 5 minutes, config is refreshed in background
5. **Version Updates**: When server config version changes, subscription triggers reload

## useAuth Store Structure

```typescript
interface StoreState {
  // Auth data
  user: any;
  loading: boolean;
  error?: string;
  isAuthenticated?: boolean;

  // Config data - ALL IN useAuth like paloka_crm
  config_data: ConfigData;
  config_version: number;
  config_loading: boolean;
  config_error?: string;
  config_subscription?: any;

  // Auth actions
  login: (values: LoginInput) => Promise<void>;
  logout: () => Promise<void>;

  // Config actions - ALL IN useAuth
  loadConfig: () => Promise<void>;
  startConfigSubscription: () => void;
  stopConfigSubscription: () => void;
  initData: () => Promise<void>;
  setBackgroundInitData: () => Promise<void>;
}
```

## Data Structure

```typescript
interface ConfigData {
  users: Array<{
    id: string;
    first_name: string;
    last_name: string;
    name: string;
    email: string;
    phone?: string;
    birthday?: string;
    status: string;
    avatar?: string;
    created_at: string;
  }>;
  states: Array<{
    id: string;
    name: string;
    created_at: string;
  }>;
  cities: Array<{
    id: string;
    name: string;
    created_at: string;
  }>;
  streets: Array<{
    id: string;
    name: string;
    created_at: string;
  }>;
  version: number;
}
```

## Key Differences from Separate Store Pattern

### ✅ **Paloka_CRM Style (Current Implementation)**

- **Single Store**: All config logic in `useAuth`
- **Simpler**: No store synchronization needed
- **Cleaner**: Config tied to authentication lifecycle
- **Consistent**: Matches paloka_crm architecture

### ❌ **Separate Store Pattern (Avoided)**

- Two stores: `useAuth` + `useConfig`
- Complex synchronization between stores
- More code to maintain
- Different from paloka_crm

## Best Practices

1. **Use Hooks**: Always use the provided hooks (`useConfigData`, `useConfigOptions`) for components
2. **Direct Access**: For complex logic, access `useAuth` store directly
3. **Handle Loading States**: Always handle loading and error states in your components
4. **Optimize Renders**: Use specific selectors to avoid unnecessary re-renders

## Integration Points

- **Layout**: ConfigProvider is integrated in the root layout (`/src/app/layout.tsx`)
- **Authentication**: Config loading is triggered on login/authentication
- **Persistence**: Config data is persisted in localStorage via Zustand
- **Real-time**: Automatic updates via GraphQL subscriptions

## Troubleshooting

### Config Not Loading

- Check if user is authenticated
- Verify GraphQL endpoint is accessible
- Check browser console for errors

### Subscription Not Working

- Ensure WebSocket connection is established
- Check GraphQL subscription endpoint
- Verify authentication tokens are valid

### Stale Data

- Config refreshes every 5 minutes automatically
- Manual refresh available via `loadConfig()` function
- Version-based updates via subscription

## Example Component

See `/src/components/ConfigExample/index.tsx` for a complete example of using the config system.

---

**Note**: This implementation exactly matches the paloka_crm pattern where all config logic is contained within the `useAuth` store, providing a simpler and more maintainable architecture.
