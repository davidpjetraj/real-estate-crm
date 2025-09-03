export interface IDataStore {
  startCursor: any;
  endCursor: any;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  columns: any;
  data: any;
  loading: boolean;
  filters: any[];
  error: any;
  sort: SortItem[];
  clearData: () => void;
  getData: () => void;
  setItem: (item: any) => void;
  setState: (payload: any) => void;

  // Sort
  addSortItem: (item: SortItem) => void;
  removeSortItem: (item: SortItem) => void;
  updateSortItem: (item: SortItem) => void;
  clearSort: () => void;
  reorderSort: (items: SortItem[]) => void;

  // Filters
  addFilterItem: (item: any) => void;
  removeFilterItem: (item: any) => void;
  updateFilterItem: (item: any) => void;
  clearFilters: () => void;

  // Hide and re-order
  toggleColumnVisibility: (id: string) => void;
  reorderColumns: (columns: any[]) => void;
}

export interface SortItem {
  id: string;
  value: string;
  label: string;
}
