import { create } from "zustand";
import { IDataStore, TableColumn, SortItem } from "@/components/Table";
import {
  StateModel,
  useStatesQuery,
  useStateQuery,
  useCreateStateMutation,
  useUpdateStateMutation,
  useDeleteStateMutation,
  useUpdateStateOrderMutation,
  CreateStateInput,
  UpdateStateInput,
  DeleteStateInput,
  UpdateStateOrderInput,
} from "@/lib/graphql/generated/graphql";

export const stateColumns: TableColumn<StateModel>[] = [
  {
    accessorFn: (row) => row.name,
    label: "State Name",
    accessorKey: "name",
    size: 250,
    cell: ({ row }: { row: { original: StateModel } }) => (
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
    accessorFn: (row) => {
      const date = new Date(row.created_at);
      return date.toLocaleDateString();
    },
    label: "Created",
    accessorKey: "created_at",
    size: 150,
    cell: ({ row }: { row: { original: StateModel } }) => {
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

export const simpleStateColumns: any = stateColumns.map((column) => {
  return {
    id: column.accessorKey,
    label: column.label,
  };
});

export interface StateState extends IDataStore {
  data: StateModel[];
  loading: boolean;
  loadingMore: boolean;
  openCustomize: boolean;
  search: string;
  stateStatus: any;
  selectedState: StateModel | null;

  // Data manipulation methods
  addItem: (item: StateModel) => void;
  removeItem: (id: string) => void;
  updateItem: (item: StateModel) => void;
  setData: (data: StateModel[]) => void;
  setSelectedState: (state: StateModel | null) => void;

  // UI state methods
  setSearch: (payload: string) => void;
  setOpenCustomize: (open: boolean) => void;
  setLoading: (loading: boolean) => void;
  changeStateStatus: (status: any) => void;
}

export const useState = create<StateState>()((set) => ({
  // IDataStore required properties
  startCursor: null,
  endCursor: null,
  hasNextPage: false,
  hasPreviousPage: false,
  columns: stateColumns,
  data: [],
  loading: false,
  filters: [],
  error: null,
  sort: [],

  // Additional state properties
  loadingMore: false,
  openCustomize: false,
  search: "",
  stateStatus: null,
  selectedState: null,

  // IDataStore required methods
  clearData: () => {
    set({ data: [] });
  },

  getData: () => {
    // This will be handled by the useStateOperations hook
  },

  setItem: (item: StateModel) => {
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
  addItem: (item: StateModel) => {
    set((state) => ({
      data: [...state.data, item],
    }));
  },

  removeItem: (id: string) => {
    set((state) => ({
      data: state.data.filter((item) => item.id !== id),
    }));
  },

  updateItem: (item: StateModel) => {
    set((state) => ({
      data: state.data.map((existingItem) =>
        existingItem.id === item.id ? item : existingItem
      ),
    }));
  },

  setData: (data: StateModel[]) => {
    set({ data });
  },

  setSelectedState: (selectedState: StateModel | null) => {
    set({ selectedState });
  },

  // UI state methods
  setSearch: (search: string) => {
    set({ search });
  },

  setOpenCustomize: (openCustomize: boolean) => {
    set({ openCustomize });
  },

  setLoading: (loading: boolean) => {
    set({ loading });
  },

  changeStateStatus: (stateStatus: any) => {
    set({ stateStatus });
  },
}));

// Custom hooks for State operations
export const useStateOperations = () => {
  const stateStore = useState();

  // Queries
  const {
    data: statesData,
    loading: statesLoading,
    error: statesError,
    refetch: refetchStates,
  } = useStatesQuery({
    variables: {
      input: {
        search: stateStore.search || undefined,
      },
    },
    onCompleted: (data) => {
      stateStore.setData(data.states);
    },
    onError: (error) => {
      console.error("Error fetching states:", error);
    },
  });

  const {
    data: stateData,
    loading: stateLoading,
    error: stateError,
    refetch: refetchState,
  } = useStateQuery({
    variables: {
      input: {
        id: stateStore.selectedState?.id || "",
      },
    },
    skip: !stateStore.selectedState?.id,
    onCompleted: (data) => {
      stateStore.setSelectedState(data.state);
    },
    onError: (error) => {
      console.error("Error fetching state:", error);
    },
  });

  // Mutations
  const [createStateMutation, { loading: createLoading }] =
    useCreateStateMutation({
      onCompleted: (data) => {
        stateStore.addItem(data.createState);
        refetchStates();
      },
      onError: (error) => {
        console.error("Error creating state:", error);
      },
    });

  const [updateStateMutation, { loading: updateLoading }] =
    useUpdateStateMutation({
      onCompleted: (data) => {
        stateStore.updateItem(data.updateState);
        refetchStates();
      },
      onError: (error) => {
        console.error("Error updating state:", error);
      },
    });

  const [deleteStateMutation, { loading: deleteLoading }] =
    useDeleteStateMutation({
      onCompleted: (data) => {
        if (data.deleteState) {
          refetchStates();
        }
      },
      onError: (error) => {
        console.error("Error deleting state:", error);
      },
    });

  const [updateStateOrderMutation, { loading: updateOrderLoading }] =
    useUpdateStateOrderMutation({
      onCompleted: (data) => {
        if (data.updateStateOrder) {
          refetchStates();
        }
      },
      onError: (error) => {
        console.error("Error updating state order:", error);
      },
    });

  // Helper functions
  const createState = async (input: CreateStateInput) => {
    try {
      stateStore.setLoading(true);
      await createStateMutation({
        variables: { input },
      });
    } finally {
      stateStore.setLoading(false);
    }
  };

  const updateState = async (input: UpdateStateInput) => {
    try {
      stateStore.setLoading(true);
      await updateStateMutation({
        variables: { input },
      });
    } finally {
      stateStore.setLoading(false);
    }
  };

  const deleteState = async (input: DeleteStateInput) => {
    try {
      stateStore.setLoading(true);
      const result = await deleteStateMutation({
        variables: { input },
      });
      if (result.data?.deleteState) {
        stateStore.removeItem(input.id);
      }
    } finally {
      stateStore.setLoading(false);
    }
  };

  const updateStateOrder = async (input: UpdateStateOrderInput) => {
    try {
      stateStore.setLoading(true);
      await updateStateOrderMutation({
        variables: { input },
      });
    } finally {
      stateStore.setLoading(false);
    }
  };

  const searchStates = (searchTerm: string) => {
    stateStore.setSearch(searchTerm);
    refetchStates();
  };

  const selectState = (stateId: string) => {
    const state = stateStore.data.find((s) => s.id === stateId);
    stateStore.setSelectedState(state || null);
  };

  return {
    // Store state
    ...stateStore,

    // Query states
    statesData,
    statesLoading,
    statesError,
    stateData,
    stateLoading,
    stateError,

    // Mutation loading states
    createLoading,
    updateLoading,
    deleteLoading,
    updateOrderLoading,

    // Operations
    createState,
    updateState,
    deleteState,
    updateStateOrder,
    searchStates,
    selectState,
    refetchStates,
    refetchState,
  };
};
