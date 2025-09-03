import { djs } from "@/components/shared/utils";
import { TableColumn } from "../components/Table";

export const getSortableColumns = (columns: TableColumn<any>[]) => {
  const sortableItems = columns.filter((item) => item.sortOptions?.enabled);
  return sortableItems.map((item) => {
    return {
      id: item.accessorKey,
      label: item.label,
    };
  });
};

export const allowedSortableColumns = (
  columns: TableColumn<any>[],
  sort: any[]
) => {
  const sortableItems = getSortableColumns(columns);
  return sortableItems.filter((item) => {
    return !sort.find((sortItem: any) => sortItem.id === item.id);
  });
};

export const getQuickSortColumns = (columns: TableColumn<any>[]) => {
  const sortableItems = columns.filter((item) => item.sortOptions?.quickSort);
  return sortableItems.map((item) => {
    return {
      id: item.accessorKey,
      label: item.label,
    };
  });
};

export const getFiltrableColumns = (columns: TableColumn<any>[]) => {
  const filtrableItems = columns.filter((item) => item.filterOptions?.enabled);
  return filtrableItems.map((item) => {
    return {
      id: item.accessorKey,
      label: item.label,
      filterOptions: item.filterOptions,
    };
  });
};

export const allowedFiltrableColumns = (
  columns: TableColumn<any>[],
  filters: any[]
) => {
  const filtrableItems = getFiltrableColumns(columns);
  return filtrableItems.filter((item) => {
    return !filters.find((filterItem: any) => filterItem.id === item.id);
  });
};

export const getQuickFilterColumns = (columns: TableColumn<any>[]) => {
  const filtrableItems = columns.filter(
    (item) => item.filterOptions?.quickFilter
  );
  return filtrableItems.map((item) => {
    return {
      id: item.accessorKey,
      label: item.label,
      filterOptions: item.filterOptions,
    };
  });
};

export const prepareFilters = (filters: TableColumn<any>[]) => {
  return filters.map((filter) => {
    if (filter.filterOptions?.type === "multiselect") {
      return {
        id: filter.id,
        type: filter.filterOptions.type,
        multiselect: filter?.value?.map((item: any) => item.value),
      };
    }

    if (filter.filterOptions?.type === "date-range") {
      return {
        id: filter.id,
        type: filter.filterOptions.type,
        date_range: [
          djs(filter?.value?.[0])?.format("YYYY-MM-DD") || null,
          djs(filter?.value?.[1])?.format("YYYY-MM-DD") || null,
        ],
      };
    }

    if (filter.filterOptions?.type === "number-range") {
      return {
        id: filter.id,
        type: filter.filterOptions.type,
        number_range: filter.value,
      };
    }

    if (filter.filterOptions?.type === "users") {
      return {
        id: filter.id,
        type: filter.filterOptions.type,
        users: filter?.value?.map((item: any) => item.value),
      };
    }
    if (filter.filterOptions?.type === "company") {
      return {
        id: filter.id,
        type: filter.filterOptions.type,
        company: filter?.value?.map((item: any) => item.value),
      };
    }
    if (filter.filterOptions?.type === "jobs") {
      return {
        id: filter.id,
        type: filter.filterOptions.type,
        jobs: filter?.value?.map((item: any) => item.value),
      };
    }
    if (filter.filterOptions?.type === "switch") {
      return {
        id: filter.id,
        type: filter.filterOptions.type,
        switch: filter.value || false,
      };
    }

    return {
      id: filter.id,
      type: filter?.filterOptions?.type,
      search: filter.value || null,
    } as any;
  });
};

export const getUri = (path: string) => {
  if (!path) {
    return "";
  }
  return `${process.env.NEXT_PUBLIC_GC_PUBLIC}/${path}`;
};
