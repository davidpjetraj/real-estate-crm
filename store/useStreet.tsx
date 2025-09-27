import { create } from "zustand";
import { IDataStore, TableColumn, SortItem } from "@/components/Table";
import {
  StreetModel,
  useStreetsQuery,
  useStreetQuery,
  useCreateStreetMutation,
  useUpdateStreetMutation,
  useDeleteStreetMutation,
  useUpdateStreetOrderMutation,
  CreateStreetInput,
  UpdateStreetInput,
  DeleteStreetInput,
  UpdateStreetOrderInput,
} from "@/lib/graphql/generated/graphql";

export const streetColumns: TableColumn<StreetModel>[] = [
  {
    accessorFn: (row) => row.name,
    label: "Street Name",
    accessorKey: "name",
    size: 200,
    cell: ({ row }: { row: { original: StreetModel } }) => (
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
    accessorFn: (row) => row.city?.name || "N/A",
    label: "City",
    accessorKey: "city.name",
    size: 150,
    cell: ({ row }: { row: { original: StreetModel } }) => (
      <div
        style={{
          fontSize: "13px",
          color: "#666",
        }}
      >
        {row.original.city?.name || "N/A"}
      </div>
    ),
  },
  {
    accessorFn: (row) => row.state?.name || "N/A",
    label: "State",
    accessorKey: "state.name",
    size: 120,
    cell: ({ row }: { row: { original: StreetModel } }) => (
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
    size: 100,
    cell: ({ row }: { row: { original: StreetModel } }) => {
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

export const simpleStreetColumns: any = streetColumns.map((column) => {
  return {
    id: column.accessorKey,
    label: column.label,
  };
});

export interface StreetState extends IDataStore {
  data: StreetModel[];
  loading: boolean;
  loadingMore: boolean;
  openCustomize: boolean;
  search: string;
  selectedState: string | null;
  selectedCity: string | null;
  streetStatus: any;
  selectedStreet: StreetModel | null;

  // Data manipulation methods
  addItem: (item: StreetModel) => void;
  removeItem: (id: string) => void;
  updateItem: (item: StreetModel) => void;
  setData: (data: StreetModel[]) => void;
  setSelectedStreet: (street: StreetModel | null) => void;

  // UI state methods
  setSearch: (payload: string) => void;
  setSelectedState: (stateId: string | null) => void;
  setSelectedCity: (cityId: string | null) => void;
  setOpenCustomize: (open: boolean) => void;
  setLoading: (loading: boolean) => void;
  changeStreetStatus: (status: any) => void;
}

export const useStreet = create<StreetState>()((set) => ({
  // IDataStore required properties
  startCursor: null,
  endCursor: null,
  hasNextPage: false,
  hasPreviousPage: false,
  columns: streetColumns,
  data: [],
  loading: false,
  filters: [],
  error: null,
  sort: [],

  // Additional street properties
  loadingMore: false,
  openCustomize: false,
  search: "",
  selectedState: null,
  selectedCity: null,
  streetStatus: null,
  selectedStreet: null,

  // IDataStore required methods
  clearData: () => {
    set({ data: [] });
  },

  getData: () => {
    // This will be handled by the useStreetOperations hook
  },

  setItem: (item: StreetModel) => {
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
  addItem: (item: StreetModel) => {
    set((state) => ({
      data: [...state.data, item],
    }));
  },

  removeItem: (id: string) => {
    set((state) => ({
      data: state.data.filter((item) => item.id !== id),
    }));
  },

  updateItem: (item: StreetModel) => {
    set((state) => ({
      data: state.data.map((existingItem) =>
        existingItem.id === item.id ? item : existingItem
      ),
    }));
  },

  setData: (data: StreetModel[]) => {
    set({ data });
  },

  setSelectedStreet: (selectedStreet: StreetModel | null) => {
    set({ selectedStreet });
  },

  // UI state methods
  setSearch: (search: string) => {
    set({ search });
  },

  setSelectedState: (selectedState: string | null) => {
    set({ selectedState });
  },

  setSelectedCity: (selectedCity: string | null) => {
    set({ selectedCity });
  },

  setOpenCustomize: (openCustomize: boolean) => {
    set({ openCustomize });
  },

  setLoading: (loading: boolean) => {
    set({ loading });
  },

  changeStreetStatus: (streetStatus: any) => {
    set({ streetStatus });
  },
}));

// Custom hooks for Street operations
export const useStreetOperations = () => {
  const streetStore = useStreet();

  // Queries
  const {
    data: streetsData,
    loading: streetsLoading,
    error: streetsError,
    refetch: refetchStreets,
  } = useStreetsQuery({
    variables: {
      input: {
        search: streetStore.search || undefined,
        state: streetStore.selectedState || undefined,
        city: streetStore.selectedCity || undefined,
      },
    },
    onCompleted: (data) => {
      streetStore.setData(data.streets);
    },
    onError: (error) => {
      console.error("Error fetching streets:", error);
    },
  });

  const {
    data: streetData,
    loading: streetLoading,
    error: streetError,
    refetch: refetchStreet,
  } = useStreetQuery({
    variables: {
      input: {
        id: streetStore.selectedStreet?.id || "",
      },
    },
    skip: !streetStore.selectedStreet?.id,
    onCompleted: (data) => {
      streetStore.setSelectedStreet(data.street);
    },
    onError: (error) => {
      console.error("Error fetching street:", error);
    },
  });

  // Mutations
  const [createStreetMutation, { loading: createLoading }] =
    useCreateStreetMutation({
      onCompleted: (data) => {
        streetStore.addItem(data.createStreet);
        refetchStreets();
      },
      onError: (error) => {
        console.error("Error creating street:", error);
      },
    });

  const [updateStreetMutation, { loading: updateLoading }] =
    useUpdateStreetMutation({
      onCompleted: (data) => {
        streetStore.updateItem(data.updateStreet);
        refetchStreets();
      },
      onError: (error) => {
        console.error("Error updating street:", error);
      },
    });

  const [deleteStreetMutation, { loading: deleteLoading }] =
    useDeleteStreetMutation({
      onCompleted: (data) => {
        if (data.deleteStreet) {
          refetchStreets();
        }
      },
      onError: (error) => {
        console.error("Error deleting street:", error);
      },
    });

  const [updateStreetOrderMutation, { loading: updateOrderLoading }] =
    useUpdateStreetOrderMutation({
      onCompleted: (data) => {
        if (data.updateStreetOrder) {
          refetchStreets();
        }
      },
      onError: (error) => {
        console.error("Error updating street order:", error);
      },
    });

  // Helper functions
  const createStreet = async (input: CreateStreetInput) => {
    try {
      streetStore.setLoading(true);
      await createStreetMutation({
        variables: { input },
      });
    } finally {
      streetStore.setLoading(false);
    }
  };

  const updateStreet = async (input: UpdateStreetInput) => {
    try {
      streetStore.setLoading(true);
      await updateStreetMutation({
        variables: { input },
      });
    } finally {
      streetStore.setLoading(false);
    }
  };

  const deleteStreet = async (input: DeleteStreetInput) => {
    try {
      streetStore.setLoading(true);
      const result = await deleteStreetMutation({
        variables: { input },
      });
      if (result.data?.deleteStreet) {
        streetStore.removeItem(input.id);
      }
    } finally {
      streetStore.setLoading(false);
    }
  };

  const updateStreetOrder = async (input: UpdateStreetOrderInput) => {
    try {
      streetStore.setLoading(true);
      await updateStreetOrderMutation({
        variables: { input },
      });
    } finally {
      streetStore.setLoading(false);
    }
  };

  const searchStreets = (searchTerm: string) => {
    streetStore.setSearch(searchTerm);
    refetchStreets();
  };

  const filterByState = (stateId: string | null) => {
    streetStore.setSelectedState(stateId);
    // Clear city filter when state changes
    if (stateId !== streetStore.selectedState) {
      streetStore.setSelectedCity(null);
    }
    refetchStreets();
  };

  const filterByCity = (cityId: string | null) => {
    streetStore.setSelectedCity(cityId);
    refetchStreets();
  };

  const selectStreet = (streetId: string) => {
    const street = streetStore.data.find((s) => s.id === streetId);
    streetStore.setSelectedStreet(street || null);
  };

  return {
    // Store state
    ...streetStore,

    // Query states
    streetsData,
    streetsLoading,
    streetsError,
    streetData,
    streetLoading,
    streetError,

    // Mutation loading states
    createLoading,
    updateLoading,
    deleteLoading,
    updateOrderLoading,

    // Operations
    createStreet,
    updateStreet,
    deleteStreet,
    updateStreetOrder,
    searchStreets,
    filterByState,
    filterByCity,
    selectStreet,
    refetchStreets,
    refetchStreet,
  };
};
