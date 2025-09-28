import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  TeamModel,
  TeamsDocument,
  TeamDetailsDocument,
} from "../src/lib/graphql/generated/graphql";
import {
  TableColumn,
  TRCell,
  IDataStore,
  UserCell,
} from "../src/components/Table";
import { apolloClient } from "@/lib/graphql/ApolloWrapper";
import { Actions } from "../src/components/Team";
import useParams from "@/hooks/useParams";
import Status from "@/components/Team/Status";

export const teamColumns: TableColumn<TeamModel>[] = [
  {
    accessorFn: (row) => row,
    label: "Name",
    accessorKey: "name",
    size: 180,
    minSize: 140,
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
      const info = getValue() as TeamModel;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { setParams } = useParams();
      return (
        <TRCell
          style={{
            display: "flex",
            cursor: "pointer",
          }}
          onClick={() => {
            setParams({
              type: "team",
              tab: "details",
              id: info.id,
            });
          }}
        >
          <UserCell data={info} />
        </TRCell>
      );
    },
  },
  {
    accessorFn: (row) => row,
    label: "Email",
    accessorKey: "email",
    size: 200,
    minSize: 150,
    filterOptions: {
      enabled: true,
      quickFilter: true,
      type: "search",
    },
    footer: (props) => props.column.id,
    cell: ({ getValue }) => {
      const info = getValue() as TeamModel;
      return <TRCell>{info?.email || "-"}</TRCell>;
    },
  },
  {
    accessorFn: (row) => row,
    label: "Phone",
    accessorKey: "phone",
    size: 150,
    minSize: 120,
    footer: (props) => props.column.id,
    cell: ({ getValue }) => {
      const info = getValue() as TeamModel;
      return <TRCell>{info?.phone || "-"}</TRCell>;
    },
  },
  {
    accessorFn: (row) => row,
    label: "Status",
    accessorKey: "status",
    size: 120,
    minSize: 100,
    filterOptions: {
      enabled: true,
      quickFilter: true,
      type: "multiselect",
      options: [
        { label: "Active", value: "active" },
        { label: "Invited", value: "invited" },
        { label: "Deactivated", value: "deactivated" },
      ],
    },
    footer: (props) => props.column.id,
    cell: ({ getValue }) => {
      const info = getValue() as TeamModel;
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
    size: 150,
    minSize: 120,
    sortOptions: {
      enabled: true,
      quickSort: false,
    },
    footer: (props) => props.column.id,
    cell: ({ getValue }) => {
      const info = getValue() as TeamModel;
      const date = info?.created_at
        ? new Date(info.created_at).toLocaleDateString("en-US")
        : "-";
      return <TRCell>{date}</TRCell>;
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
      const teamMember = getValue() as TeamModel;
      return (
        <TRCell>
          <Actions teamMember={teamMember} />
        </TRCell>
      );
    },
  },
];

export const simpleTeamColumns: any = teamColumns.map((column) => {
  return {
    id: column.accessorKey,
    label: column.label,
    disableHidable: column.disableHidable,
    hidden: column.hidden,
  };
});

export interface TeamState extends IDataStore {
  data: any;
  loading: boolean;
  loadingMore: boolean;
  openCustomize: boolean;
  search: string;
  teamStatus: any;
  detailsModalOpen: boolean;
  selectedTeamMemberId: string | null;
  addItem: (item: TeamModel) => void;
  removeItem: (id: string) => void;
  updateItem: (item: TeamModel) => void;
  setSearch: (payload: string) => void;
  setOpenCustomize: (open: boolean) => void;
  changeTeamStatus: (status: any) => void;
  getTeamDetails: (id: string) => Promise<TeamModel>;
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

export const useTeam = create<TeamState>()(
  persist(
    (set, get) => ({
      columns: teamColumns,
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
      teamStatus: null,
      detailsModalOpen: false,
      selectedTeamMemberId: null,

      changeTeamStatus: (status: any) => {
        set({ teamStatus: status });
        get().getData();
      },

      getTeamDetails: async (id: string) => {
        try {
          const res = await apolloClient.query<any>({
            query: TeamDetailsDocument,
            fetchPolicy: "no-cache",
            variables: {
              input: {
                id: id,
              },
            },
          });

          return res.data.teamDetails;
        } catch (error) {
          throw new Error(`Failed to fetch team member details: ${error}`);
        }
      },

      openDetailsModal: (id: string) => {
        set({ detailsModalOpen: true, selectedTeamMemberId: id });
      },

      closeDetailsModal: () => {
        set({ detailsModalOpen: false, selectedTeamMemberId: null });
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
        const teamStatus = get().teamStatus;

        const buildFilters = prepareFilters(filters);

        // Add teamStatus as a filter if it exists
        if (teamStatus) {
          buildFilters.push({
            id: "status",
            type: "multiselect",
            multiselect: [teamStatus],
          } as any);
        }

        try {
          const res = await apolloClient.query<any>({
            query: TeamsDocument,
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
              },
            },
          });

          const items = extractNodes(res.data.teams);
          const pageInfo = extractPageInfo(res.data.teams);

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
          teamStatus,
        } = get();

        const buildFilters = prepareFilters(filters);

        // Add teamStatus as a filter if it exists
        if (teamStatus) {
          buildFilters.push({
            id: "status",
            type: "multiselect",
            multiselect: [teamStatus],
          } as any);
        }

        if (loading || loadingMore || !hasNextPage) return;

        set({ loadingMore: true });

        try {
          const res = await apolloClient.query<any>({
            query: TeamsDocument,
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
              },
            },
          });

          const items = extractNodes(res.data.teams);
          const pageInfo = extractPageInfo(res.data.teams);

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
      name: "team-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state: TeamState) => {
        return {
          data: state.data,
          filters: state.filters,
          sort: state.sort,
        };
      },
    }
  )
);
