import { create } from "zustand";
import { IDataStore, TableColumn, SortItem } from "@/components/Table";
import {
  CityModel,
  useCitiesQuery,
  useCityQuery,
  useCreateCityMutation,
  useUpdateCityMutation,
  useDeleteCityMutation,
  CreateCityInput,
  UpdateCityInput,
  DeleteCityInput,
} from "@/lib/graphql/generated/graphql";

export const cityColumns: TableColumn<CityModel>[] = [
  {
    accessorFn: (row) => row.name,
    label: "City Name",
    accessorKey: "name",
    size: 200,
    cell: ({ row }: { row: { original: CityModel } }) => (
      <div
        style={{
          fontWeight: 500,
          color: "#1976d2",
          fontSize: "14px",
        }}
      >
        {row.original.name}
      </div>
    ),
  },
  {
    accessorFn: (row) => row.state?.name || "N/A",
    label: "State",
    accessorKey: "state.name",
    size: 150,
    cell: ({ row }: { row: { original: CityModel } }) => (
      <div
        style={{
          fontSize: "13px",
          color: "#666",
        }}
      >
        {row.original.state?.name || "N/A"}
      </div>
    ),
  },
  {
    accessorFn: (row) => {
      const date = new Date(row.created_at);
      return date.toLocaleDateString();
    },
    label: "Created",
    accessorKey: "created_at",
    size: 120,
    cell: ({ row }: { row: { original: CityModel } }) => {
      const date = new Date(row.original.created_at);
      return (
        <div
          style={{
            fontSize: "12px",
            color: "#888",
          }}
        >
          {date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      );
    },
  },
];

export const simpleCityColumns: any = cityColumns.map((column) => {
  return {
    id: column.accessorKey,
    label: column.label,
  };
});

export interface CityState extends IDataStore {
  data: CityModel[];
  loading: boolean;
  loadingMore: boolean;
  openCustomize: boolean;
  search: string;
  selectedState: string | null;
  cityStatus: any;
  selectedCity: CityModel | null;

  // Data manipulation methods
  addItem: (item: CityModel) => void;
  removeItem: (id: string) => void;
  updateItem: (item: CityModel) => void;
  setData: (data: CityModel[]) => void;
  setSelectedCity: (city: CityModel | null) => void;

  // UI state methods
  setSearch: (payload: string) => void;
  setSelectedState: (stateId: string | null) => void;
  setOpenCustomize: (open: boolean) => void;
  setLoading: (loading: boolean) => void;
  changeCityStatus: (status: any) => void;
}

export const useCity = create<CityState>()((set) => ({
  // IDataStore required properties
  startCursor: null,
  endCursor: null,
  hasNextPage: false,
  hasPreviousPage: false,
  columns: cityColumns,
  data: [],
  loading: false,
  filters: [],
  error: null,
  sort: [],

  // Additional city properties
  loadingMore: false,
  openCustomize: false,
  search: "",
  selectedState: null,
  cityStatus: null,
  selectedCity: null,

  // IDataStore required methods
  clearData: () => {
    set({ data: [] });
  },

  getData: () => {
    // This will be handled by the useCityOperations hook
  },

  setItem: (item: CityModel) => {
    set((state) => ({
      data: state.data.map((existingItem) =>
        existingItem.id === item.id ? item : existingItem
      ),
    }));
  },

  setState: (payload: any) => {
    set(payload);
  },

  // Sort methods
  addSortItem: (item: SortItem) => {
    set((state) => ({
      sort: [...state.sort, item],
    }));
  },

  removeSortItem: (item: SortItem) => {
    set((state) => ({
      sort: state.sort.filter((sortItem) => sortItem.id !== item.id),
    }));
  },

  updateSortItem: (item: SortItem) => {
    set((state) => ({
      sort: state.sort.map((sortItem) =>
        sortItem.id === item.id ? item : sortItem
      ),
    }));
  },

  clearSort: () => {
    set({ sort: [] });
  },

  reorderSort: (items: SortItem[]) => {
    set({ sort: items });
  },

  // Filter methods
  addFilterItem: (item: any) => {
    set((state) => ({
      filters: [...state.filters, item],
    }));
  },

  removeFilterItem: (item: any) => {
    set((state) => ({
      filters: state.filters.filter((filterItem) => filterItem.id !== item.id),
    }));
  },

  updateFilterItem: (item: any) => {
    set((state) => ({
      filters: state.filters.map((filterItem) =>
        filterItem.id === item.id ? item : filterItem
      ),
    }));
  },

  clearFilters: () => {
    set({ filters: [] });
  },

  // Column visibility and reordering
  toggleColumnVisibility: (id: string) => {
    set((state) => ({
      columns: state.columns.map((column: any) =>
        column.accessorKey === id
          ? { ...column, visible: !column.visible }
          : column
      ),
    }));
  },

  reorderColumns: (columns: any[]) => {
    set({ columns });
  },

  // Data manipulation methods
  addItem: (item: CityModel) => {
    set((state) => ({
      data: [...state.data, item],
    }));
  },

  removeItem: (id: string) => {
    set((state) => ({
      data: state.data.filter((item) => item.id !== id),
    }));
  },

  updateItem: (item: CityModel) => {
    set((state) => ({
      data: state.data.map((existingItem) =>
        existingItem.id === item.id ? item : existingItem
      ),
    }));
  },

  setData: (data: CityModel[]) => {
    set({ data });
  },

  setSelectedCity: (selectedCity: CityModel | null) => {
    set({ selectedCity });
  },

  // UI state methods
  setSearch: (search: string) => {
    set({ search });
  },

  setSelectedState: (selectedState: string | null) => {
    set({ selectedState });
  },

  setOpenCustomize: (openCustomize: boolean) => {
    set({ openCustomize });
  },

  setLoading: (loading: boolean) => {
    set({ loading });
  },

  changeCityStatus: (cityStatus: any) => {
    set({ cityStatus });
  },
}));

// Custom hooks for City operations
export const useCityOperations = () => {
  const cityStore = useCity();

  // Queries
  const {
    data: citiesData,
    loading: citiesLoading,
    error: citiesError,
    refetch: refetchCities,
  } = useCitiesQuery({
    variables: {
      input: {
        search: cityStore.search || undefined,
        state: cityStore.selectedState || undefined,
      },
    },
    onCompleted: (data) => {
      cityStore.setData(data.cities);
    },
    onError: (error) => {
      console.error("Error fetching cities:", error);
    },
  });

  const {
    data: cityData,
    loading: cityLoading,
    error: cityError,
    refetch: refetchCity,
  } = useCityQuery({
    variables: {
      input: {
        id: cityStore.selectedCity?.id || "",
      },
    },
    skip: !cityStore.selectedCity?.id,
    onCompleted: (data) => {
      cityStore.setSelectedCity(data.city);
    },
    onError: (error) => {
      console.error("Error fetching city:", error);
    },
  });

  // Mutations
  const [createCityMutation, { loading: createLoading }] =
    useCreateCityMutation({
      onCompleted: (data) => {
        cityStore.addItem(data.createCity);
        refetchCities();
      },
      onError: (error) => {
        console.error("Error creating city:", error);
      },
    });

  const [updateCityMutation, { loading: updateLoading }] =
    useUpdateCityMutation({
      onCompleted: (data) => {
        cityStore.updateItem(data.updateCity);
        refetchCities();
      },
      onError: (error) => {
        console.error("Error updating city:", error);
      },
    });

  const [deleteCityMutation, { loading: deleteLoading }] =
    useDeleteCityMutation({
      onCompleted: (data) => {
        if (data.deleteCity) {
          refetchCities();
        }
      },
      onError: (error) => {
        console.error("Error deleting city:", error);
      },
    });

  // Helper functions
  const createCity = async (input: CreateCityInput) => {
    try {
      cityStore.setLoading(true);
      await createCityMutation({
        variables: { input },
      });
    } finally {
      cityStore.setLoading(false);
    }
  };

  const updateCity = async (input: UpdateCityInput) => {
    try {
      cityStore.setLoading(true);
      await updateCityMutation({
        variables: { input },
      });
    } finally {
      cityStore.setLoading(false);
    }
  };

  const deleteCity = async (input: DeleteCityInput) => {
    try {
      cityStore.setLoading(true);
      const result = await deleteCityMutation({
        variables: { input },
      });
      if (result.data?.deleteCity) {
        cityStore.removeItem(input.id);
      }
    } finally {
      cityStore.setLoading(false);
    }
  };

  const searchCities = (searchTerm: string) => {
    cityStore.setSearch(searchTerm);
    refetchCities();
  };

  const filterByState = (stateId: string | null) => {
    cityStore.setSelectedState(stateId);
    refetchCities();
  };

  const selectCity = (cityId: string) => {
    const city = cityStore.data.find((c) => c.id === cityId);
    cityStore.setSelectedCity(city || null);
  };

  return {
    // Store state
    ...cityStore,

    // Query states
    citiesData,
    citiesLoading,
    citiesError,
    cityData,
    cityLoading,
    cityError,

    // Mutation loading states
    createLoading,
    updateLoading,
    deleteLoading,

    // Operations
    createCity,
    updateCity,
    deleteCity,
    searchCities,
    filterByState,
    selectCity,
    refetchCities,
    refetchCity,
  };
};
