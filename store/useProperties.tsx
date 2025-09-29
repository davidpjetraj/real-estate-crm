import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  PropertyModel,
  PropertyDetailsDocument,
  PropertiesDocument,
} from "../src/lib/graphql/generated/graphql";
import { TableColumn, TRCell, IDataStore } from "../src/components/Table";
import { apolloClient } from "@/lib/graphql/ApolloWrapper";
import { Actions } from "../src/components/Property/Actions";
import useParams from "@/hooks/useParams";
import Status from "@/components/Property/Status";

export const propertyColumns: TableColumn<PropertyModel>[] = [
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
      const info = getValue() as PropertyModel;
      return <TRCell>#{info.short_id}</TRCell>;
    },
  },

  {
    accessorFn: (row) => row,
    label: "Property",
    accessorKey: "title",
    size: 150,
    minSize: 150,
    filterOptions: {
      enabled: true,
      quickFilter: true,
      type: "search",
    },
    sortOptions: {
      enabled: true,
      quickSort: false,
    },
    footer: (props) => props.column.id,
    cell: ({ getValue }) => {
      const info = getValue() as PropertyModel;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { setParams } = useParams();
      return (
        <TRCell
          style={{ display: "flex", cursor: "pointer" }}
          onClick={() => {
            setParams({
              type: "property",
              tab: "details",
              id: info.id,
            });
          }}
        >
          {info.title}
        </TRCell>
      );
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
      const info = getValue() as PropertyModel;
      return (
        <TRCell>
          {info.category.charAt(0).toUpperCase() + info.category.slice(1)}
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
      const info = getValue() as PropertyModel;
      return (
        <TRCell>
          <div style={{ fontSize: "0.875rem" }}>
            {info.city?.name && info.state?.name
              ? `${info.city.name}, ${info.state.name}`
              : info.city?.name || info.state?.name || "—"}
          </div>
        </TRCell>
      );
    },
  },
  {
    accessorFn: (row) => row,
    label: "Surface",
    accessorKey: "surface",
    size: 100,
    minSize: 80,
    sortOptions: {
      enabled: true,
      quickSort: false,
    },
    cell: ({ getValue }) => {
      const info = getValue() as PropertyModel;
      return <TRCell>{info.surface ? `${info.surface} m²` : "—"}</TRCell>;
    },
  },
  {
    accessorFn: (row) => row,
    label: "Price",
    accessorKey: "price",
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
      const info = getValue() as PropertyModel;
      const prices = [];

      if (info.for_sale && info.sell_price) {
        prices.push(`€${info.sell_price.toLocaleString()} (Sale)`);
      }
      if (info.for_rent && info.rent_price) {
        prices.push(`€${info.rent_price.toLocaleString()}/mo (Rent)`);
      }

      return <TRCell>{prices.length > 0 ? prices.join(" | ") : "—"}</TRCell>;
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
      type: "multiselect",
    },
    cell: ({ getValue }) => {
      const info = getValue() as PropertyModel;

      return (
        <TRCell>
          <Status data={info} />
        </TRCell>
      );
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
      const info = getValue() as PropertyModel;
      return (
        <TRCell>
          <div style={{ fontSize: "0.875rem" }}>
            {new Date(info.created_at).toLocaleDateString()}
          </div>
        </TRCell>
      );
    },
  },

  {
    accessorFn: (row) => row,
    label: "Actions",
    accessorKey: "actions",
    size: 120,
    minSize: 100,
    disableHidable: true,
    footer: (props) => props.column.id,
    cell: ({ getValue }) => {
      const property = getValue() as PropertyModel;
      return (
        <TRCell>
          <Actions property={property} />
        </TRCell>
      );
    },
  },
];

export const simpleTeamColumns: any = propertyColumns.map((column) => {
  return {
    id: column.accessorKey,
    label: column.label,
    disableHidable: column.disableHidable,
    hidden: column.hidden,
  };
});

export interface PropertyState extends IDataStore {
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
  addItem: (item: PropertyModel) => void;
  removeItem: (id: string) => void;
  updateItem: (item: PropertyModel) => void;
  setSearch: (payload: string) => void;
  setOpenCustomize: (open: boolean) => void;
  changePropertyStatus: (status: any) => void;
  getPropertyDetails: (id: string) => Promise<PropertyModel>;
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

export const useProperty = create<PropertyState>()(
  persist(
    (set, get) => ({
      columns: propertyColumns,
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
            query: PropertyDetailsDocument,
            fetchPolicy: "no-cache",
            variables: {
              input: {
                id: id,
              },
            },
          });

          return res.data.propertyDetails;
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
            query: PropertiesDocument,
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

          const items = extractNodes(res.data.properties);
          const pageInfo = extractPageInfo(res.data.properties);

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
            query: PropertiesDocument,
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

          const items = extractNodes(res.data.properties);
          const pageInfo = extractPageInfo(res.data.properties);

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
        set({ data: [item, ...get().data] });
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
      name: "property-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state: PropertyState) => {
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
