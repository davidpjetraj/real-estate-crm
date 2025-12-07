import { create } from "zustand";
import { IDataStore, TableColumn, SortItem } from "@/components/Table";
import {
  AsistentiModel,
  useAsistentetQuery,
  useCreateAsistentiMutation,
  useUpdateAsistentiMutation,
  CreateAsistent,
  UpdateAsistent,
} from "@/lib/graphql/generated/graphql";

export const asistentiColumns: TableColumn<AsistentiModel>[] = [
  {
    accessorFn: (row) => `${row.emri} ${row.mbiemri}`,
    label: "Name",
    accessorKey: "name",
    size: 200,
    cell: ({ row }: { row: { original: AsistentiModel } }) => (
      <div
        style={{
          fontWeight: 500,
          color: "#1976d2",
          fontSize: "14px",
        }}
      >
        {row.original.emri} {row.original.mbiemri}
      </div>
    ),
  },
  {
    accessorFn: (row) => row.emri,
    label: "First Name",
    accessorKey: "emri",
    size: 150,
    cell: ({ row }: { row: { original: AsistentiModel } }) => (
      <div
        style={{
          fontSize: "13px",
          color: "#666",
        }}
      >
        {row.original.emri}
      </div>
    ),
  },
  {
    accessorFn: (row) => row.mbiemri,
    label: "Last Name",
    accessorKey: "mbiemri",
    size: 150,
    cell: ({ row }: { row: { original: AsistentiModel } }) => (
      <div
        style={{
          fontSize: "13px",
          color: "#666",
        }}
      >
        {row.original.mbiemri}
      </div>
    ),
  },
  {
    accessorFn: (row) => row.department?.emri_departmentit || "N/A",
    label: "Department",
    accessorKey: "department.emri_departmentit",
    size: 200,
    cell: ({ row }: { row: { original: AsistentiModel } }) => (
      <div
        style={{
          fontSize: "13px",
          color: "#666",
        }}
      >
        {row.original.department?.emri_departmentit || "N/A"}
      </div>
    ),
  },
];

export const simpleAsistentiColumns: any = asistentiColumns.map((column) => {
  return {
    id: column.accessorKey,
    label: column.label,
  };
});

export interface AsistentiState extends IDataStore {
  data: AsistentiModel[];
  loading: boolean;
  loadingMore: boolean;
  openCustomize: boolean;
  search: string;
  selectedDepartment: string | null;
  asistentiStatus: any;
  selectedAsistenti: AsistentiModel | null;

  // Data manipulation methods
  addItem: (item: AsistentiModel) => void;
  removeItem: (id: string) => void;
  updateItem: (item: AsistentiModel) => void;
  setData: (data: AsistentiModel[]) => void;
  setSelectedAsistenti: (asistenti: AsistentiModel | null) => void;

  // UI state methods
  setSearch: (payload: string) => void;
  setSelectedDepartment: (departmentId: string | null) => void;
  setOpenCustomize: (open: boolean) => void;
  setLoading: (loading: boolean) => void;
  changeAsistentiStatus: (status: any) => void;
}

export const useAsistenti = create<AsistentiState>()((set) => ({
  // IDataStore required properties
  startCursor: null,
  endCursor: null,
  hasNextPage: false,
  hasPreviousPage: false,
  columns: asistentiColumns,
  data: [],
  loading: false,
  filters: [],
  error: null,
  sort: [],

  // Additional asistenti properties
  loadingMore: false,
  openCustomize: false,
  search: "",
  selectedDepartment: null,
  asistentiStatus: null,
  selectedAsistenti: null,

  // IDataStore required methods
  clearData: () => {
    set({ data: [] });
  },

  getData: () => {
    // This will be handled by the useAsistentiOperations hook
  },

  setItem: (item: AsistentiModel) => {
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
  addItem: (item: AsistentiModel) => {
    set((state) => ({
      data: [...state.data, item],
    }));
  },

  removeItem: (id: string) => {
    set((state) => ({
      data: state.data.filter((item) => item.id !== id),
    }));
  },

  updateItem: (item: AsistentiModel) => {
    set((state) => ({
      data: state.data.map((existingItem) =>
        existingItem.id === item.id ? item : existingItem
      ),
    }));
  },

  setData: (data: AsistentiModel[]) => {
    set({ data });
  },

  setSelectedAsistenti: (selectedAsistenti: AsistentiModel | null) => {
    set({ selectedAsistenti });
  },

  // UI state methods
  setSearch: (search: string) => {
    set({ search });
  },

  setSelectedDepartment: (selectedDepartment: string | null) => {
    set({ selectedDepartment });
  },

  setOpenCustomize: (openCustomize: boolean) => {
    set({ openCustomize });
  },

  setLoading: (loading: boolean) => {
    set({ loading });
  },

  changeAsistentiStatus: (asistentiStatus: any) => {
    set({ asistentiStatus });
  },
}));

// Custom hooks for Asistenti operations
export const useAsistentiOperations = () => {
  const asistentiStore = useAsistenti();

  // Queries
  const {
    data: asistentetData,
    loading: asistentetLoading,
    error: asistentetError,
    refetch: refetchAsistentet,
  } = useAsistentetQuery({
    variables: {
      input: {
        search: asistentiStore.search || undefined,
        department_id: asistentiStore.selectedDepartment || undefined,
      },
    },
    onCompleted: (data) => {
      asistentiStore.setData(data.asistentet);
    },
    onError: (error) => {
      console.error("Error fetching asistentet:", error);
    },
  });

  // Mutations
  const [createAsistentiMutation, { loading: createLoading }] =
    useCreateAsistentiMutation({
      onCompleted: (data) => {
        asistentiStore.addItem(data.createAsistenti);
        refetchAsistentet();
      },
      onError: (error) => {
        console.error("Error creating asistenti:", error);
      },
    });

  const [updateAsistentiMutation, { loading: updateLoading }] =
    useUpdateAsistentiMutation({
      onCompleted: (data) => {
        asistentiStore.updateItem(data.updateAsistenti);
        refetchAsistentet();
      },
      onError: (error) => {
        console.error("Error updating asistenti:", error);
      },
    });

  // Helper functions
  const createAsistenti = async (input: CreateAsistent) => {
    try {
      asistentiStore.setLoading(true);
      await createAsistentiMutation({
        variables: { input },
      });
    } finally {
      asistentiStore.setLoading(false);
    }
  };

  const updateAsistenti = async (input: UpdateAsistent) => {
    try {
      asistentiStore.setLoading(true);
      await updateAsistentiMutation({
        variables: { input },
      });
    } finally {
      asistentiStore.setLoading(false);
    }
  };

  const searchAsistentet = (searchTerm: string) => {
    asistentiStore.setSearch(searchTerm);
    refetchAsistentet();
  };

  const filterByDepartment = (departmentId: string | null) => {
    asistentiStore.setSelectedDepartment(departmentId);
    refetchAsistentet();
  };

  const selectAsistenti = (asistentiId: string) => {
    const asistenti = asistentiStore.data.find((a) => a.id === asistentiId);
    asistentiStore.setSelectedAsistenti(asistenti || null);
  };

  return {
    // Store state
    ...asistentiStore,

    // Query states
    asistentetData,
    asistentetLoading,
    asistentetError,

    // Mutation loading states
    createLoading,
    updateLoading,

    // Operations
    createAsistenti,
    updateAsistenti,
    searchAsistentet,
    filterByDepartment,
    selectAsistenti,
    refetchAsistentet,
  };
};
