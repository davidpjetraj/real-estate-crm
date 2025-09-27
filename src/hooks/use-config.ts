import useAuth from "../../store/useAuth";

/**
 * Hook to access config data from components
 * All config logic is now in useAuth like paloka_crm
 */
export function useConfigData() {
  const configData = useAuth((state) => state.config_data);
  const configVersion = useAuth((state) => state.config_version);
  const configLoading = useAuth((state) => state.config_loading);
  const configError = useAuth((state) => state.config_error);
  const loadConfig = useAuth((state) => state.loadConfig);

  return {
    // Config data
    users: configData.users || [],
    states: configData.states || [],
    cities: configData.cities || [],
    streets: configData.streets || [],
    version: configVersion || 1,

    // Config state
    loading: configLoading,
    error: configError,

    // Config actions
    loadConfig,

    // Raw config data
    configData,
  };
}

/**
 * Hook to get specific config arrays
 */
export function useConfigArrays() {
  const { users, states, cities, streets } = useConfigData();

  return {
    users,
    states,
    cities,
    streets,
  };
}

/**
 * Hook to get config options for dropdowns/selects
 */
export function useConfigOptions() {
  const { users, states, cities, streets } = useConfigData();

  return {
    userOptions: users.map((user: any) => ({
      value: user.id,
      label: user.name || `${user.first_name} ${user.last_name}`,
      ...user,
    })),
    stateOptions: states.map((state: any) => ({
      value: state.id,
      label: state.name,
      ...state,
    })),
    cityOptions: cities.map((city: any) => ({
      value: city.id,
      label: city.name,
      ...city,
    })),
    streetOptions: streets.map((street: any) => ({
      value: street.id,
      label: street.name,
      ...street,
    })),
  };
}
