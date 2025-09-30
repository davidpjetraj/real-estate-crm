import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { TableColumn, TRCell, IDataStore } from "../src/components/Table";
import { apolloClient } from "@/lib/graphql/ApolloWrapper";
import {
  RequestDetailsDocument,
  RequestModel,
  RequestsDocument,
} from "@/lib/graphql/generated/graphql";

export const requestColumns: TableColumn<RequestModel>[] = [
  {
    accessorFn: (row) => row,
    label: "Short ID",
    accessorKey: "short_id",
    size: 100,
    minSize: 80,
    filterOptions: {
      enabled: true,
      quickFilter: true,
      type: "search",
    },
    sortOptions: {
      enabled: true,
      quickSort: false,
    },
    cell: ({ getValue }) => {
      const info = getValue() as RequestModel;
      return <TRCell>#{info.short_id}</TRCell>;
    },
  },

  {
    accessorFn: (row) => row,
    label: "Client",
    accessorKey: "client",
    size: 150,
    minSize: 120,
    filterOptions: {
      enabled: true,
      quickFilter: true,
      type: "search",
    },
    sortOptions: {
      enabled: true,
      quickSort: false,
    },
    cell: ({ getValue }) => {
      const info = getValue() as RequestModel;

      return (
        <TRCell style={{ display: "flex", cursor: "pointer" }} s>
          {info.client?.name || info.full_name || "—"}
        </TRCell>
      );
    },
  },

  {
    accessorFn: (row) => row,
    label: "Type",
    accessorKey: "type",
    size: 100,
    minSize: 80,
    filterOptions: {
      enabled: true,
      quickFilter: true,
      type: "search",
    },
    sortOptions: {
      enabled: true,
      quickSort: false,
    },
    cell: ({ getValue }) => {
      const info = getValue() as RequestModel;
      const typeLabel =
        info.type === "to_buy" ? "Buy" : info.type === "to_rent" ? "Rent" : "—";
      return <TRCell>{typeLabel}</TRCell>;
    },
  },

  {
    accessorFn: (row) => row,
    label: "Category",
    accessorKey: "category",
    size: 120,
    minSize: 100,
    filterOptions: {
      enabled: true,
      quickFilter: true,
      type: "search",
    },
    sortOptions: {
      enabled: true,
      quickSort: false,
    },
    cell: ({ getValue }) => {
      const info = getValue() as RequestModel;
      return (
        <TRCell>
          {info.category && info.category.length > 0
            ? info.category
                .map((cat) => cat.charAt(0).toUpperCase() + cat.slice(1))
                .join(", ")
            : "—"}
        </TRCell>
      );
    },
  },

  {
    accessorFn: (row) => row,
    label: "Location",
    accessorKey: "location",
    size: 200,
    minSize: 150,
    filterOptions: {
      enabled: true,
      type: "search",
      quickFilter: true,
    },
    sortOptions: {
      enabled: true,
      quickSort: false,
    },
    cell: ({ getValue }) => {
      const info = getValue() as RequestModel;
      const cityNames = info.city?.map((c) => c.name).join(", ");
      return (
        <TRCell>
          <div style={{ fontSize: "0.875rem" }}>
            {cityNames && info.state?.name
              ? `${cityNames}, ${info.state.name}`
              : cityNames || info.state?.name || "—"}
          </div>
        </TRCell>
      );
    },
  },

  {
    accessorFn: (row) => row,
    label: "Surface",
    accessorKey: "surface",
    size: 120,
    minSize: 100,
    sortOptions: {
      enabled: true,
      quickSort: false,
    },
    cell: ({ getValue }) => {
      const info = getValue() as RequestModel;
      const surfaceRange =
        info.surface_min && info.surface_max
          ? `${info.surface_min}-${info.surface_max} m²`
          : info.surface_min
          ? `${info.surface_min}+ m²`
          : info.surface_max
          ? `Up to ${info.surface_max} m²`
          : "—";
      return <TRCell>{surfaceRange}</TRCell>;
    },
  },

  {
    accessorFn: (row) => row,
    label: "Rooms",
    accessorKey: "rooms",
    size: 100,
    minSize: 80,
    sortOptions: {
      enabled: true,
      quickSort: false,
    },
    cell: ({ getValue }) => {
      const info = getValue() as RequestModel;
      const roomsRange =
        info.rooms_min && info.rooms_max
          ? `${info.rooms_min}-${info.rooms_max}`
          : info.rooms_min
          ? `${info.rooms_min}+`
          : info.rooms_max
          ? `Up to ${info.rooms_max}`
          : "—";
      return <TRCell>{roomsRange}</TRCell>;
    },
  },

  {
    accessorFn: (row) => row,
    label: "Budget",
    accessorKey: "budget",
    size: 140,
    minSize: 120,
    filterOptions: {
      enabled: true,
      quickFilter: true,
      type: "search",
    },
    sortOptions: {
      enabled: true,
      quickSort: false,
    },
    cell: ({ getValue }) => {
      const info = getValue() as RequestModel;
      const budgetText = info.budget
        ? `€${info.budget.toLocaleString()}${
            info.budget_type === "m2"
              ? "/m²"
              : info.budget_type === "acre"
              ? "/acre"
              : info.budget_type === "area"
              ? "/area"
              : ""
          }`
        : "—";
      return <TRCell>{budgetText}</TRCell>;
    },
  },

  {
    accessorFn: (row) => row,
    label: "Assignee",
    accessorKey: "assignee",
    size: 140,
    minSize: 120,
    filterOptions: {
      enabled: true,
      quickFilter: true,
      type: "search",
    },
    sortOptions: {
      enabled: true,
      quickSort: false,
    },
    cell: ({ getValue }) => {
      const info = getValue() as RequestModel;
      return <TRCell>{info.assignee?.name || "—"}</TRCell>;
    },
  },

  {
    accessorFn: (row) => row,
    label: "Status",
    accessorKey: "status",
    size: 120,
    minSize: 100,
    sortOptions: {
      enabled: true,
      quickSort: false,
    },
    filterOptions: {
      enabled: true,
      quickFilter: true,
      type: "search",
    },
    cell: ({ getValue }) => {
      const info = getValue() as RequestModel;
      return <TRCell>{info.status}</TRCell>;
    },
  },

  {
    accessorFn: (row) => row,
    label: "Created",
    accessorKey: "created_at",
    size: 120,
    minSize: 100,
    sortOptions: {
      enabled: true,
      quickSort: false,
    },
    filterOptions: {
      enabled: true,
      quickFilter: true,
      type: "search",
    },
    cell: ({ getValue }) => {
      const info = getValue() as RequestModel;
      return (
        <TRCell>
          <div style={{ fontSize: "0.875rem" }}>
            {new Date(info.created_at).toLocaleDateString()}
          </div>
        </TRCell>
      );
    },
  },
];

export const simpleTeamColumns: any = requestColumns.map((column) => {
  return {
    id: column.accessorKey,
    label: column.label,
    disableHidable: column.disableHidable,
    hidden: column.hidden,
  };
});

export interface RequestState extends IDataStore {
  data: any;
  loading: boolean;
  loadingMore: boolean;
  openCustomize: boolean;
  search: string;
  propertyStatus: any;
  detailsModalOpen: boolean;
  selectedPropertyId: string | null;
  archived: boolean;
  changeArchivedStatus: (archived: boolean) => void;
  addItem: (item: RequestModel) => void;
  removeItem: (id: string) => void;
  updateItem: (item: RequestModel) => void;
  setSearch: (payload: string) => void;
  setOpenCustomize: (open: boolean) => void;
  changePropertyStatus: (status: any) => void;
  getPropertyDetails: (id: string) => Promise<RequestModel>;
  openDetailsModal: (id: string) => void;
  closeDetailsModal: () => void;
}

// Helper functions
const extractNodes = (data: any) => {
  return data?.edges?.map((edge: any) => edge.node) || [];
};

const extractPageInfo = (data: any) => {
  return data?.pageInfo || {};
};

const prepareFilters = (filters: any[]) => {
  return filters
    .filter(
      (filter) =>
        filter.value !== undefined &&
        filter.value !== null &&
        filter.value !== ""
    )
    .map((filter) => ({
      id: filter.id,
      type: filter.type,
      [filter.type]: filter.value,
    }));
};

export const useRequest = create<RequestState>()(
  persist(
    (set, get) => ({
      columns: requestColumns,
      data: null,
      loading: false,
      loadingMore: false,
      filters: [],
      error: null,
      sort: [],
      startCursor: null,
      endCursor: null,
      hasNextPage: false,
      search: "",
      hasPreviousPage: false,
      openCustomize: false,
      propertyStatus: null,
      detailsModalOpen: false,
      selectedPropertyId: null,
      archived: false,
      changeArchivedStatus: (archived: boolean) => {
        set({ archived });
        get().getData();
      },

      changePropertyStatus: (status: any) => {
        set({ propertyStatus: status });
        get().getData();
      },

      getPropertyDetails: async (id: string) => {
        try {
          const res = await apolloClient.query<any>({
            query: RequestDetailsDocument,
            fetchPolicy: "no-cache",
            variables: {
              input: {
                id: id,
              },
            },
          });

          return res.data.requestDetails;
        } catch (error) {
          throw new Error(`Failed to fetch property details: ${error}`);
        }
      },

      openDetailsModal: (id: string) => {
        set({ detailsModalOpen: true, selectedPropertyId: id });
      },

      closeDetailsModal: () => {
        set({ detailsModalOpen: false, selectedPropertyId: null });
      },

      setOpenCustomize: (open: any) => {
        set({ openCustomize: open });
      },

      setSearch: (payload: any) => {
        set({
          loading: true,
          search: payload,
        });
        get().getData();
      },

      clearData: () => {
        set({ data: null, loading: true, error: null });
      },

      getData: async () => {
        set({ loading: true });

        const sort = get().sort;
        const filters = get().filters;
        const search = get().search;
        const propertyStatus = get().propertyStatus;
        const archived = get().archived;

        const buildFilters = prepareFilters(filters);

        // Add teamStatus as a filter if it exists
        if (propertyStatus) {
          buildFilters.push({
            id: "status",
            type: "multiselect",
            multiselect: [propertyStatus],
          } as any);
        }

        try {
          const res = await apolloClient.query<any>({
            query: RequestsDocument,
            fetchPolicy: "no-cache",
            variables: {
              input: {
                limit: 20,
                cursor: null,
                sort: sort.map((s: any) => ({
                  id: s.id,
                  value: s.value,
                })),
                filters: buildFilters,
                search: search,
                deleted: archived,
              },
            },
          });

          const items = extractNodes(res.data.requests);
          const pageInfo = extractPageInfo(res.data.requests);

          set({
            data: items,
            loading: false,
            startCursor: pageInfo?.startCursor,
            endCursor: pageInfo?.endCursor,
            hasNextPage: pageInfo?.hasNextPage,
            hasPreviousPage: pageInfo?.hasPreviousPage,
            error: null,
          });
        } catch (error) {
          set({
            loading: false,
            error: error,
          });
        }
      },

      getNextData: async () => {
        const {
          sort,
          endCursor,
          loading,
          loadingMore,
          hasNextPage,
          filters,
          search,
          propertyStatus,
          archived,
        } = get();

        const buildFilters = prepareFilters(filters);

        // Add teamStatus as a filter if it exists
        if (propertyStatus) {
          buildFilters.push({
            id: "status",
            type: "multiselect",
            multiselect: [propertyStatus],
          } as any);
        }

        if (loading || loadingMore || !hasNextPage) return;

        set({ loadingMore: true });

        try {
          const res = await apolloClient.query<any>({
            query: RequestsDocument,
            fetchPolicy: "no-cache",
            variables: {
              input: {
                limit: 20,
                cursor: endCursor,
                sort: sort.map((s: any) => ({
                  id: s.id,
                  value: s.value,
                })),
                filters: buildFilters,
                search: search,
                deleted: archived,
              },
            },
          });

          const items = extractNodes(res.data.requests);
          const pageInfo = extractPageInfo(res.data.requests);

          set({
            data: [...get().data, ...items],
            loadingMore: false,
            startCursor: pageInfo?.startCursor,
            endCursor: pageInfo?.endCursor,
            hasNextPage: pageInfo?.hasNextPage,
            hasPreviousPage: pageInfo?.hasPreviousPage,
          });
        } catch (error) {
          set({
            loadingMore: false,
            error: error,
          });
        }
      },

      setItem: (item: any) => {
        set({ data: item, loading: false });
      },

      setState: (payload: any) => {
        set({ ...get(), ...payload });
      },

      // Sort
      addSortItem: (item: any) => {
        const sort = get().sort.filter((s: any) => s.id !== item.id);
        set({ sort: [...sort, item] });
        get().getData();
      },

      removeSortItem: (item: any) => {
        const sort = get().sort.filter((s: any) => s.id !== item.id);
        set({ sort });
        get().getData();
      },

      updateSortItem: (item: any) => {
        const sort = get().sort.map((s: any) => {
          if (s.id === item.id) {
            return item;
          }
          return s;
        });
        set({ sort });
        get().getData();
      },

      clearSort: () => {
        set({ sort: [] });
        get().getData();
      },

      reorderSort: (items: any[]) => {
        set({ sort: items });
        get().getData();
      },

      // Filters
      addFilterItem: (item: any) => {
        set({ filters: [...get().filters, item] });
        get().getData();
      },

      removeFilterItem: (item: any) => {
        const filters = get().filters.filter((f: any) => f.id !== item.id);
        set({ filters });
        get().getData();
      },

      updateFilterItem: (item: any) => {
        const filters = get().filters.map((f: any) => {
          if (f.id === item.id) {
            return item;
          }
          return f;
        });
        set({ filters });
        get().getData();
      },

      clearFilters: () => {
        set({ filters: [] });
        get().getData();
      },

      // Hide and ordering
      toggleColumnVisibility: (id: string) => {
        const columns = get().columns.map((column: any) => {
          if (column.id === id) {
            return { ...column, hidden: !column.hidden };
          }
          return column;
        });
        set({ columns });
      },

      reorderColumns: (columns: any) => {
        set({ columns });
      },

      addItem: (item: any) => {
        set({ data: [item, ...(get().data || [])] });
      },

      removeItem: (id: string) => {
        set({ data: get()?.data?.filter((item: any) => item.id !== id) });
      },

      updateItem: (item: any) => {
        const items = get().data.map((i: any) => {
          if (i.id === item.id) {
            return item;
          }
          return i;
        });
        set({ data: items });
      },
    }),
    {
      name: "request-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state: RequestState) => {
        return {
          data: state.data,
          filters: state.filters,
          sort: state.sort,
          archived: state.archived,
        };
      },
    }
  )
);
