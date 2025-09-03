import { TableColumn, TRCell } from "@/components/Table";

export const teamColumns: TableColumn<any>[] = [
  {
    accessorFn: (row) => row,
    label: "Title",
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
      const info = getValue() as any;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return <TRCell>{info?.name || "-"}</TRCell>;
    },
  },
];

export const useTeam = create<any>()(
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
      taskStatus: null,
      changeTaskStatus: (status: any) => {
        set({ taskStatus: status });
        get().getData();
      },
      setOpenCustomize: (open: any) => {
        set({ openCustomize: open });
      },
      setSearch: (payload: any) => {
        set({
          loading: true,
          search: payload,
        });
      },
      clearData: () => {
        set({ data: null, loading: true, error: null });
      },
      getData: async () => {
        set({ loading: true, data: [] });

        const sort = get().sort;
        const filters = get().filters;
        const search = get().search;
        const taskStatus = get().taskStatus;

        const buildFilters = prepareFilters(filters);

        const res = await apolloClient.query<any>({
          query: any,
          fetchPolicy: "no-cache",
          variables: {
            input: {
              sort: sort.map((s: any) => ({
                id: s.id,
                value: s.value,
              })),
              filters: buildFilters,
              search: search,
              status: taskStatus,
            },
          },
        });

        const items = extractNodes(res.data.team);
        const pageInfo = extractPageInfo(res.data.tasks);

        set({
          data: items,
          loading: false,
          startCursor: pageInfo?.startCursor,
          endCursor: pageInfo?.endCursor,
          hasNextPage: pageInfo?.hasNextPage,
          hasPreviousPage: pageInfo?.hasPreviousPage,
        });
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
          taskStatus,
        } = get();

        const buildFilters = prepareFilters(filters);

        if (loading || loadingMore || !hasNextPage) return;

        set({ loadingMore: true });

        const res = await apolloClient.query<TasksQuery>({
          query: TasksDocument,
          fetchPolicy: "no-cache",
          variables: {
            input: {
              cursor: endCursor,
              sort: sort.map((s) => ({
                id: s.id,
                value: s.value,
              })),
              filters: buildFilters,
              search: search,
              status: taskStatus,
            },
          },
        });

        const items = extractNodes(res.data.tasks);
        const pageInfo = extractPageInfo(res.data.tasks);

        set({
          data: [...get().data, ...items],
          loadingMore: false,
          startCursor: pageInfo?.startCursor,
          endCursor: pageInfo?.endCursor,
          hasNextPage: pageInfo?.hasNextPage,
          hasPreviousPage: pageInfo?.hasPreviousPage,
        });
      },
      setItem: (item) => {
        set({ data: item, loading: false });
      },
      setState: (payload) => {
        set({ ...get(), ...payload });
      },
      // Sort
      addSortItem: (item: SortItem) => {
        const sort = get().sort.filter((s: any) => s.id !== item.id);
        set({ sort: [...sort, item] });
        get().getData();
      },
      removeSortItem: (item: SortItem) => {
        const sort = get().sort.filter((s: any) => s.id !== item.id);
        set({ sort });
        get().getData();
      },
      updateSortItem: (item: SortItem) => {
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
      reorderSort: (items: SortItem[]) => {
        set({ sort: items });
        get().getData();
      },

      // Filters
      addFilterItem: (item) => {
        set({ filters: [...get().filters, item] });
        get().getData();
      },
      removeFilterItem: (item) => {
        const filters = get().filters.filter((f) => f.id !== item.id);
        set({ filters });
        get().getData();
      },
      updateFilterItem: (item) => {
        const filters = get().filters.map((f) => {
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

      addItem: (item: TaskModel) => {
        set({ data: [item, ...get().data] });
      },

      removeItem: (id: string) => {
        set({ data: get()?.data?.filter((item: any) => item.id !== id) });
      },
      updateItem: (item: TaskModel) => {
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
      name: "tasks-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state: TasksState) => {
        return {
          data: state.data,
          filters: state.filters,
          sort: state.sort,
          columns: state.columns,
        };
      },
    }
  )
);
