import { create } from "zustand";
import { IDataStore, TableColumn, SortItem } from "@/components/Table";
import {
  RastiLigjorModel,
  useRastetLigjoreQuery,
  useRastiLigjorQuery,
  useCreateRastiLigjorMutation,
  useUpdateRastiLigjorMutation,
  useDeleteRastiLigjorMutation,
  CreateRastiLigjorInput,
  UpdateRastiLigjorInput,
} from "@/lib/graphql/generated/graphql";

export const rastiLigjorColumns: TableColumn<RastiLigjorModel>[] = [
  {
    accessorFn: (row) => row.emri,
    label: "Emri i Rastit Ligjor",
    accessorKey: "emri",
    size: 250,
    cell: ({ row }: { row: { original: RastiLigjorModel } }) => (
      <div
        style={{
          fontWeight: 500,
          color: "#1976d2",
          fontSize: "14px",
        }}
      >
        {row.original.emri}
      </div>
    ),
  },
  {
    accessorFn: (row) => row.lloji_rastit,
    label: "Lloji i Rastit",
    accessorKey: "lloji_rastit",
    size: 150,
    cell: ({ row }: { row: { original: RastiLigjorModel } }) => (
      <div
        style={{
          fontSize: "13px",
          color: "#666",
        }}
      >
        {row.original.lloji_rastit}
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
    cell: ({ row }: { row: { original: RastiLigjorModel } }) => {
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

export const simpleRastiLigjorColumns: any = rastiLigjorColumns.map(
  (column) => {
    return {
      id: column.accessorKey,
      label: column.label,
    };
  }
);

export interface RastiLigjorState extends IDataStore {
  data: RastiLigjorModel[];
  loading: boolean;
  loadingMore: boolean;
  openCustomize: boolean;
  search: string;
  rastiLigjorStatus: any;
  selectedRastiLigjor: RastiLigjorModel | null;

  addItem: (item: RastiLigjorModel) => void;
  removeItem: (id: string) => void;
  updateItem: (item: RastiLigjorModel) => void;
  setData: (data: RastiLigjorModel[]) => void;
  setSelectedRastiLigjor: (rastiLigjor: RastiLigjorModel | null) => void;

  setSearch: (payload: string) => void;
  setOpenCustomize: (open: boolean) => void;
  setLoading: (loading: boolean) => void;
  changeRastiLigjorStatus: (status: any) => void;
}

export const useRastiLigjor = create<RastiLigjorState>()((set) => ({
  startCursor: null,
  endCursor: null,
  hasNextPage: false,
  hasPreviousPage: false,
  columns: rastiLigjorColumns,
  data: [],
  loading: false,
  filters: [],
  error: null,
  sort: [],

  loadingMore: false,
  openCustomize: false,
  search: "",
  rastiLigjorStatus: null,
  selectedRastiLigjor: null,

  clearData: () => {
    set({ data: [] });
  },

  getData: () => {},

  setItem: (item: RastiLigjorModel) => {
    set((state) => ({
      data: state.data.map((existingItem) =>
        existingItem.id === item.id ? item : existingItem
      ),
    }));
  },

  setState: (payload: any) => {
    set(payload);
  },

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

  addItem: (item: RastiLigjorModel) => {
    set((state) => ({
      data: [...state.data, item],
    }));
  },

  removeItem: (id: string) => {
    set((state) => ({
      data: state.data.filter((item) => item.id !== id),
    }));
  },

  updateItem: (item: RastiLigjorModel) => {
    set((state) => ({
      data: state.data.map((existingItem) =>
        existingItem.id === item.id ? item : existingItem
      ),
    }));
  },

  setData: (data: RastiLigjorModel[]) => {
    set({ data });
  },

  setSelectedRastiLigjor: (selectedRastiLigjor: RastiLigjorModel | null) => {
    set({ selectedRastiLigjor });
  },

  setSearch: (search: string) => {
    set({ search });
  },

  setOpenCustomize: (openCustomize: boolean) => {
    set({ openCustomize });
  },

  setLoading: (loading: boolean) => {
    set({ loading });
  },

  changeRastiLigjorStatus: (rastiLigjorStatus: any) => {
    set({ rastiLigjorStatus });
  },
}));

export const useRastiLigjorOperations = () => {
  const rastiLigjorStore = useRastiLigjor();

  const {
    data: rastetLigjoreData,
    loading: rastetLigjoreLoading,
    error: rastetLigjoreError,
    refetch: refetchRastetLigjore,
  } = useRastetLigjoreQuery({
    variables: {
      input: {
        search: rastiLigjorStore.search || undefined,
      },
    },
    onCompleted: (data) => {
      rastiLigjorStore.setData(data.rastetLigjore);
    },
    onError: (error) => {
      console.error("Error fetching rastetLigjore:", error);
    },
  });

  const {
    data: rastiLigjorData,
    loading: rastiLigjorLoading,
    error: rastiLigjorError,
    refetch: refetchRastiLigjor,
  } = useRastiLigjorQuery({
    variables: {
      input: {
        id: rastiLigjorStore.selectedRastiLigjor?.id || "",
      },
    },
    skip: !rastiLigjorStore.selectedRastiLigjor?.id,
    onCompleted: (data) => {
      rastiLigjorStore.setSelectedRastiLigjor(data.rastiLigjor);
    },
    onError: (error) => {
      console.error("Error fetching rastiLigjor:", error);
    },
  });

  const [createRastiLigjorMutation, { loading: createLoading }] =
    useCreateRastiLigjorMutation({
      onCompleted: (data) => {
        rastiLigjorStore.addItem(data.createRastiLigjor);
        refetchRastetLigjore();
      },
      onError: (error) => {
        console.error("Error creating rastiLigjor:", error);
      },
    });

  const [updateRastiLigjorMutation, { loading: updateLoading }] =
    useUpdateRastiLigjorMutation({
      onCompleted: (data) => {
        rastiLigjorStore.updateItem(data.updateRastiLigjor);
        refetchRastetLigjore();
      },
      onError: (error) => {
        console.error("Error updating rastiLigjor:", error);
      },
    });

  const [deleteRastiLigjorMutation, { loading: deleteLoading }] =
    useDeleteRastiLigjorMutation({
      onCompleted: (data) => {
        if (data.deleteRastiLigjor) {
          refetchRastetLigjore();
        }
      },
      onError: (error) => {
        console.error("Error deleting rastiLigjor:", error);
      },
    });

  const createRastiLigjor = async (input: CreateRastiLigjorInput) => {
    try {
      rastiLigjorStore.setLoading(true);
      await createRastiLigjorMutation({
        variables: { input },
      });
    } finally {
      rastiLigjorStore.setLoading(false);
    }
  };

  const updateRastiLigjor = async (input: UpdateRastiLigjorInput) => {
    try {
      rastiLigjorStore.setLoading(true);
      await updateRastiLigjorMutation({
        variables: { input },
      });
    } finally {
      rastiLigjorStore.setLoading(false);
    }
  };

  const deleteRastiLigjor = async (input: UpdateRastiLigjorInput) => {
    try {
      rastiLigjorStore.setLoading(true);
      const result = await deleteRastiLigjorMutation({
        variables: { input },
      });
      if (result.data?.deleteRastiLigjor) {
        rastiLigjorStore.removeItem(input.id);
      }
    } finally {
      rastiLigjorStore.setLoading(false);
    }
  };

  const searchRastetLigjore = (searchTerm: string) => {
    rastiLigjorStore.setSearch(searchTerm);
    refetchRastetLigjore();
  };

  const selectRastiLigjor = (rastiLigjorId: string) => {
    const rastiLigjor = rastiLigjorStore.data.find(
      (r) => r.id === rastiLigjorId
    );
    rastiLigjorStore.setSelectedRastiLigjor(rastiLigjor || null);
  };

  return {
    ...rastiLigjorStore,

    rastetLigjoreData,
    rastetLigjoreLoading,
    rastetLigjoreError,
    rastiLigjorData,
    rastiLigjorLoading,
    rastiLigjorError,

    createLoading,
    updateLoading,
    deleteLoading,

    createRastiLigjor,
    updateRastiLigjor,
    deleteRastiLigjor,
    searchRastetLigjore,
    selectRastiLigjor,
    refetchRastetLigjore,
    refetchRastiLigjor,
  };
};
