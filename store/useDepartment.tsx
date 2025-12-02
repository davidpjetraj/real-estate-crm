import { create } from "zustand";
import { IDataStore, TableColumn, SortItem } from "@/components/Table";
import {
  DepartmentModel,
  useDepartmentsQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  CreateDepartmentInput,
  UpdateDepartmentInput,
} from "@/lib/graphql/generated/graphql";

export const departmentColumns: TableColumn<DepartmentModel>[] = [
  {
    accessorFn: (row) => row.emri_departmentit,
    label: "Department Name",
    accessorKey: "emri_departmentit",
    size: 250,
    cell: ({ row }: { row: { original: DepartmentModel } }) => (
      <div
        style={{
          fontWeight: 500,
          color: "#1976d2",
          fontSize: "14px",
        }}
      >
        {row.original.emri_departmentit}
      </div>
    ),
  },
  {
    accessorFn: (row) => row.numri_i_zyreve,
    label: "Number of Positions",
    accessorKey: "numri_i_zyreve",
    size: 150,
    cell: ({ row }: { row: { original: DepartmentModel } }) => (
      <div
        style={{
          fontSize: "13px",
          color: "#666",
        }}
      >
        {row.original.numri_i_zyreve}
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
    cell: ({ row }: { row: { original: DepartmentModel } }) => {
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

export const simpleDepartmentColumns: any = departmentColumns.map((column) => {
  return {
    id: column.accessorKey,
    label: column.label,
  };
});

export interface DepartmentState extends IDataStore {
  data: DepartmentModel[];
  loading: boolean;
  loadingMore: boolean;
  openCustomize: boolean;
  search: string;
  departmentStatus: any;
  selectedDepartment: DepartmentModel | null;

  // Data manipulation methods
  addItem: (item: DepartmentModel) => void;
  removeItem: (id: string) => void;
  updateItem: (item: DepartmentModel) => void;
  setData: (data: DepartmentModel[]) => void;
  setSelectedDepartment: (department: DepartmentModel | null) => void;

  // UI state methods
  setSearch: (payload: string) => void;
  setOpenCustomize: (open: boolean) => void;
  setLoading: (loading: boolean) => void;
  changeDepartmentStatus: (status: any) => void;
}

export const useDepartment = create<DepartmentState>()((set) => ({
  // IDataStore required properties
  startCursor: null,
  endCursor: null,
  hasNextPage: false,
  hasPreviousPage: false,
  columns: departmentColumns,
  data: [],
  loading: false,
  filters: [],
  error: null,
  sort: [],

  // Additional department properties
  loadingMore: false,
  openCustomize: false,
  search: "",
  departmentStatus: null,
  selectedDepartment: null,

  // IDataStore required methods
  clearData: () => {
    set({ data: [] });
  },

  getData: () => {
    // This will be handled by the useDepartmentOperations hook
  },

  setItem: (item: DepartmentModel) => {
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
  addItem: (item: DepartmentModel) => {
    set((state) => ({
      data: [...state.data, item],
    }));
  },

  removeItem: (id: string) => {
    set((state) => ({
      data: state.data.filter((item) => item.id !== id),
    }));
  },

  updateItem: (item: DepartmentModel) => {
    set((state) => ({
      data: state.data.map((existingItem) =>
        existingItem.id === item.id ? item : existingItem
      ),
    }));
  },

  setData: (data: DepartmentModel[]) => {
    set({ data });
  },

  setSelectedDepartment: (selectedDepartment: DepartmentModel | null) => {
    set({ selectedDepartment });
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

  changeDepartmentStatus: (departmentStatus: any) => {
    set({ departmentStatus });
  },
}));

// Custom hooks for Department operations
export const useDepartmentOperations = () => {
  const departmentStore = useDepartment();

  // Queries
  const {
    data: departmentsData,
    loading: departmentsLoading,
    error: departmentsError,
    refetch: refetchDepartments,
  } = useDepartmentsQuery({
    variables: {
      input: {
        search: departmentStore.search || undefined,
      },
    },
    onCompleted: (data) => {
      departmentStore.setData(data.departments);
    },
    onError: (error) => {
      console.error("Error fetching departments:", error);
    },
  });

  // Mutations
  const [createDepartmentMutation, { loading: createLoading }] =
    useCreateDepartmentMutation({
      onCompleted: (data) => {
        departmentStore.addItem(data.createDepartment);
        refetchDepartments();
      },
      onError: (error) => {
        console.error("Error creating department:", error);
      },
    });

  const [updateDepartmentMutation, { loading: updateLoading }] =
    useUpdateDepartmentMutation({
      onCompleted: (data) => {
        departmentStore.updateItem(data.updateDepartment);
        refetchDepartments();
      },
      onError: (error) => {
        console.error("Error updating department:", error);
      },
    });

  // Helper functions
  const createDepartment = async (input: CreateDepartmentInput) => {
    try {
      departmentStore.setLoading(true);
      await createDepartmentMutation({
        variables: { input },
      });
    } finally {
      departmentStore.setLoading(false);
    }
  };

  const updateDepartment = async (input: UpdateDepartmentInput) => {
    try {
      departmentStore.setLoading(true);
      await updateDepartmentMutation({
        variables: { input },
      });
    } finally {
      departmentStore.setLoading(false);
    }
  };

  const searchDepartments = (searchTerm: string) => {
    departmentStore.setSearch(searchTerm);
    refetchDepartments();
  };

  const selectDepartment = (departmentId: string) => {
    const department = departmentStore.data.find((d) => d.id === departmentId);
    departmentStore.setSelectedDepartment(department || null);
  };

  return {
    // Store state
    ...departmentStore,

    // Query states
    departmentsData,
    departmentsLoading,
    departmentsError,

    // Mutation loading states
    createLoading,
    updateLoading,

    // Operations
    createDepartment,
    updateDepartment,
    searchDepartments,
    selectDepartment,
    refetchDepartments,
  };
};
