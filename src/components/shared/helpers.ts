import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
const djs = dayjs;

export function shouldGetNextPage(
  pagination: any,
  loading: boolean,
  loadingMore: boolean
) {
  return pagination?.total !== pagination.current && !loading && !loadingMore;
}

export const hasValue = (value: any) => {
  if (
    value == "null" ||
    value == undefined ||
    value == "undefined" ||
    value == null ||
    value == ""
  ) {
    return false;
  }
  return value;
};

export const _keyExtractor = (item: any, idx: number) => {
  return `${item.id}_${idx}`;
};

export const extractNodes = (data: any) => {
  return data?.edges?.map((edge: any) => edge?.node) || [];
};

export const extractPageInfo = (data: any) => {
  return {
    startCursor: data?.pageInfo?.startCursor,
    endCursor: data?.pageInfo?.endCursor,
    hasNextPage: data?.pageInfo?.hasNextPage,
    hasPreviousPage: data?.pageInfo?.hasPreviousPage,
  };
};

export const toBoolean = (value: any) => {
  if (value === "true" || value === true) {
    return true;
  }
  return false;
};

export const getValidDate = (date: string) => {
  const d = djs(date);

  if (d.isValid()) {
    return d.utc();
  }
  return djs().utc();
};

export const getValidDateOrUndefined = (date: string) => {
  const d = djs(date);

  if (d.isValid()) {
    return d.utc();
  }
  return undefined;
};

export const getDefaultDateRange = (): [Dayjs, Dayjs] => {
  const startOfThisMonth = djs().startOf("month");
  const endOfThisMonth = djs().endOf("month");
  return [startOfThisMonth, endOfThisMonth];
};

export const reorderByDate = (items: any, key: string) => {
  return Object.values(items).sort((a: any, b: any) => {
    return new Date(b[key]).getTime() - new Date(a[key]).getTime();
  });
};

export const emailValidationRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export const toggleFilterItem = (
  filterId: any,
  value: any,
  filters: any,
  updateFilterItem: any,
  addFilterItem: any
) => {
  const existingFilter = filters.find((filter: any) => filter.id === filterId);
  if (existingFilter) {
    const exists = existingFilter.multiselect.includes(value);
    const newMultiselect = exists
      ? existingFilter.multiselect.filter((val: any) => val !== value)
      : [...existingFilter.multiselect, value];
    updateFilterItem({
      id: filterId,
      type: "multiselect",
      multiselect: newMultiselect,
    });
  } else {
    addFilterItem({
      id: filterId,
      type: "multiselect",
      multiselect: [value],
    });
  }
};

export const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#.^()_+=-])[A-Za-z\d@$!%*?&#.^()_+=-]*$/;

export const formatFileSize = (size: number) => {
  if (size >= 1024 * 1024 * 1024) {
    return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  } else if (size >= 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  } else if (size >= 1024) {
    return `${(size / 1024).toFixed(2)} KB`;
  } else {
    return `${size} B`;
  }
};
