"use client";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import SearchIcon from "@/components/icons/SearchIcon";
import {
  alpha,
  InputAdornment,
  styled,
  TextField,
  Tooltip,
} from "@mui/material";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import classNames from "classnames";
import React, { CSSProperties, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import Filters from "../Filters";
import Hide from "../Hide";
import Sort from "../Sort";
import ColumnsSettings from "./ColumnsSettings";
import Empty from "./Empty";
import LoadingMore from "./LoadingMore";

const Wrapper = styled("div")`
  position: relative;
  height: calc(100% - 70px) !important;
  overflow: hidden;
  gap: 8px;
  display: flex;
  flex-direction: column;

  .theadtop {
    position: sticky;
    top: 0;
    z-index: 100;
    background-color: ${({ theme }) => theme.palette.background.paper};
    height: 60px;
    border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
    display: flex;
    align-items: center;
    padding: 0 16px;
    justify-content: space-between;
    .table-header-title {
      font-weight: 600;
      font-style: italic;
      font-size: 16px;
    }
    button {
      transition: none;
    }

    .left {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .right {
      display: flex;
      align-items: center;
      gap: 10px;
    }
  }

  .thead {
    position: sticky;
    top: 0px;
    z-index: 10;
    height: 40px;
    background-color: ${({ theme }) => theme.palette.background.default};
    border-radius: ${({ theme }) => theme.shape.borderRadius}px;

    .tr,
    .td,
    .th {
      height: 40px;
    }
  }

  .th {
    display: flex;
    align-items: center;
    cursor: pointer;
    justify-content: space-between;
    .left {
      display: flex;
      padding-left: 8px;
      gap: 10px;
      width: 100%;
      span {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .right {
      padding-right: 8px;
      transition-delay: 300ms;

      .action {
        opacity: 0;
      }

      .active {
        opacity: 1;
      }

      button {
        border-radius: 8px;
        padding: 2px;

        &.active {
          background-color: ${({ theme }) => theme.palette.action.hover};
        }

        svg {
          width: 20px;
          height: 20px;
        }
      }
    }

    &:hover {
      .right {
        .hidden {
          opacity: 1;
        }
      }
    }
  }

  .trows {
    display: flex;
    flex-direction: column;
    margin-top: 4px;
    .tr {
      border-radius: ${({ theme }) => theme.shape.borderRadius}px;
    }
  }

  .tr {
    display: flex;
  }
  .td {
    position: relative;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 14px;
  }

  .tr,
  .td {
    height: 40px;
  }

  .th,
  .td {
    display: flex;
    align-items: center;
    width: 100%;
  }
  .th {
    position: relative;
    font-weight: 600;
    font-size: 14px;
    span {
      position: relative;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .resizer {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    width: 5px;
    background: ${({ theme }) => theme.palette.divider};
    cursor: col-resize;
    user-select: none;
    touch-action: none;
    opacity: 1;
  }

  .resizer.isResizing {
    background: ${({ theme }) => theme.palette.primary.main};
    opacity: 1;
  }

  .row-external {
    height: 44px;

    .row-internal {
      height: 40px;
      margin-bottom: 4px;

      border-radius: ${({ theme }) => theme.shape.borderRadius}px;

      &:hover {
        background-color: ${({ theme }) => alpha(theme.palette.divider, 0.1)};
      }
      &.locked {
        background-color: ${({ theme }) =>
          alpha(theme.palette.warning.main, 0.1)};
      }
      &.completed {
        background-color: ${({ theme }) =>
          alpha(theme.palette.action.active, 0.1)};
      }
    }
  }

  @media (hover: hover) {
    .resizer {
      opacity: 0;
    }

    *:hover > .resizer {
      opacity: 1;
    }
  }
`;

type OptionProps = {
  value: string;
  label: string;
  color?: string;
};

// Define the type for the status filter.
export interface StatusFilter {
  id: string;
  label: string;
  icon?: React.ReactNode;
  options: OptionProps[];
  searchable?: boolean;
  height?: number;
}
export type TableProps = {
  columns: any[];
  leftActions?: React.ReactNode;
  rightActions?: React.ReactNode;
  store: any;
  beforeActions?: React.ReactNode;
  afterActions?: React.ReactNode;
  showSort?: boolean;
  showHide?: boolean;
  searchPosition?: "left" | "right";

  headerTitle?: React.ReactNode;
};

export type TableColumn<T> = ColumnDef<T> & {
  filterOptions?: FilterOptions;
  sortOptions?: SortOptions;
  label: string;
  accessorKey: string;
  value?: any;
  disableHidable?: boolean;
  hidden?: boolean;
};

export type SortOptions = {
  enabled: boolean;
  quickSort: boolean;
};

export type FilterOptions = {
  enabled: boolean;
  quickFilter: boolean;
  type:
    | "search"
    | "multiselect"
    | "switch"
    | "date-range"
    | "number-range"
    | "users"
    | "jobs"
    | "company";
  options?: OptionProps[];
  getOptions?: () => Promise<OptionProps[]>;
  fetchQuery?: any;
};

const getTableWidth = (tableState: any): number => {
  let width = tableState.getCenterTotalSize();

  tableState.getHeaderGroups().forEach((headerGroup: any) => {
    headerGroup.headers.forEach((header: any) => {
      const isPinned = header.column.getIsPinned();
      if (isPinned) width += header.getSize();
    });
  });

  return width;
};

const getCommonPinningStyles = (column: any): CSSProperties => {
  const isPinned = column?.getIsPinned();
  return {
    left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
    right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
    position: "relative",
    zIndex: isPinned ? 1 : 0,
  };
};

const Table = ({
  store,
  columns,
  beforeActions,
  afterActions,
  rightActions,
  showSort = true,
  showHide = true,
  searchPosition = "left",

  headerTitle,
}: TableProps) => {
  const tableContainerRef = React.useRef(null);

  const {
    getData,
    loading,
    loadingMore,
    data,
    columns: stateColumns,
    getNextData,
    hasNextPage,
    search,
    setSearch,
  } = store((state: any) => state);

  const MAX_INT = Number.MAX_SAFE_INTEGER;
  const [sentryRef] = useInfiniteScroll({
    disabled: !hasNextPage || loading || loadingMore,
    loading: loading || loadingMore,
    hasNextPage: hasNextPage,
    onLoadMore: () => {
      getNextData();
    },
    rootMargin: "0px 0px 0px 0px",
  });

  const columnOrder = stateColumns.map((item: any) => item.id);
  const columnVisibility = stateColumns.reduce((acc: any, item: any) => {
    acc[item.id] = !item.hidden;
    return acc;
  }, {});

  const table = useReactTable({
    data: data || [],
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    defaultColumn: {
      minSize: 100,
      size: 100,
      maxSize: 800,
    },
    state: {
      columnOrder: columnOrder,
      columnVisibility: columnVisibility,
      columnPinning: {
        left: ["short_id"],
      },
    },
    enableHiding: true,
    columnResizeMode: "onChange",
  });

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 40,
    getScrollElement: () => tableContainerRef.current,
    measureElement:
      typeof window !== "undefined" &&
      navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  });

  const [searchValue, setSearchValue] = useState(search);
  const [debouncedSearchValue] = useDebounce(searchValue, 300);

  const hasFilters = columns.find((item) => item.filterOptions?.enabled);
  const hasSort = columns.find((item) => item.sortOptions?.enabled);

  useEffect(() => {
    setSearch(debouncedSearchValue);
    getData();
  }, [debouncedSearchValue]);

  return (
    <Wrapper>
      <div className="theadtop">
        <div className="left">
          {headerTitle && (
            <span className="table-header-title">{headerTitle}</span>
          )}
          {beforeActions}
          {searchPosition === "left" && (
            <TextField
              value={searchValue}
              size="medium"
              placeholder={"Kërko..."}
              variant="outlined"
              onChange={(e) => setSearchValue(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon width={20} height={20} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                ".MuiInputBase-root": {
                  height: 38,
                },
                minWidth: 300,
                display: {
                  xs: "none",
                  sm: "flex",
                },
              }}
            />
          )}
          {searchPosition === "left" && hasFilters && (
            <Filters store={store} columns={columns} />
          )}
          {showSort && hasSort && <Sort store={store} columns={columns} />}
          {showHide && <Hide store={store} />}
          {afterActions}
        </div>
        <div className="right">
          {searchPosition === "right" && (
            <>
              <TextField
                value={searchValue}
                size="medium"
                placeholder={"Kërko..."}
                variant="outlined"
                onChange={(e) => setSearchValue(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon width={20} height={20} />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  ".MuiInputBase-root": {
                    height: 38,
                  },
                  minWidth: 300,
                  display: {
                    xs: "none",
                    sm: "flex",
                  },
                }}
              />
              {hasFilters && <Filters store={store} columns={columns} />}
            </>
          )}
          {rightActions}
        </div>
      </div>
      <div
        style={{
          minWidth: "100%",
          maxWidth: "100%",
          overflow: "auto",
          height: "calc(100% - 60px)",
          padding: "0px 16px",
        }}
      >
        <div style={{ position: "relative" }}>
          <div
            ref={tableContainerRef}
            style={{
              width: getTableWidth(table),
              minWidth: "100%",
              position: "relative",
              height: "100%",
            }}
          >
            <div className="tbody">
              <div className="thead">
                {table.getHeaderGroups().map((headerGroup) => (
                  <div key={headerGroup.id} className="tr">
                    {headerGroup.headers.map((header, index) => {
                      const shouldAuto = header.getSize() === MAX_INT;
                      const columnDef = header.column
                        .columnDef as TableColumn<any>;
                      const isPlaceholder = header.isPlaceholder;
                      return (
                        <Tooltip
                          key={header.id}
                          placement="top"
                          arrow
                          title={columnDef.label}
                        >
                          <div style={{ position: "relative" }} key={header.id}>
                            <div
                              className={`th ${
                                header.column?.getIsPinned() ? "pinned" : ""
                              }`}
                              style={{
                                ...getCommonPinningStyles(header.column),
                                width: shouldAuto ? "auto" : header.getSize(),
                              }}
                            >
                              <div className="left">
                                {!isPlaceholder && (
                                  <span className="label">
                                    {columnDef.label}
                                  </span>
                                )}
                              </div>
                              <div className="right">
                                <ColumnsSettings
                                  store={store}
                                  column={columnDef}
                                  isFirstItem={index === 0}
                                  isLastItem={
                                    index === headerGroup.headers.length - 1
                                  }
                                  currentIndex={index}
                                />
                              </div>
                            </div>
                            {header.column.getCanResize() && (
                              <div
                                onClick={(e) => e.stopPropagation()}
                                {...{
                                  onMouseDown: header.getResizeHandler(),
                                  onTouchStart: header.getResizeHandler(),
                                  className: `resizer ${
                                    header.column.getIsResizing()
                                      ? "isResizing"
                                      : ""
                                  }`,
                                }}
                              />
                            )}
                          </div>
                        </Tooltip>
                      );
                    })}
                  </div>
                ))}
              </div>
              <div
                className="trows"
                style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
              >
                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                  const row = rows[virtualRow.index] as any;

                  const isPending =
                    row.original?.current_status?.status === "pending";

                  return (
                    <div
                      data-index={virtualRow.index}
                      ref={(node) => rowVirtualizer.measureElement(node)}
                      key={row.id}
                      className={`row-external tr`}
                      style={{
                        display: "flex",
                        position: "absolute",
                        transform: `translateY(${virtualRow.start}px)`,
                        width: "100%",
                      }}
                    >
                      <div
                        className={classNames({
                          "row-internal": true,
                          pending: isPending,
                        })}
                        style={{ display: "flex", width: "100%" }}
                      >
                        {row.getVisibleCells().map((cell: any) => {
                          const shouldAuto = cell.column.getSize() === MAX_INT;
                          return (
                            <div
                              key={cell.id}
                              className={`td ${
                                cell.column?.getIsPinned() ? "pinned" : ""
                              }`}
                              style={{
                                ...getCommonPinningStyles(cell.column),
                                width: shouldAuto
                                  ? "auto"
                                  : cell.column.getSize(),
                              }}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div ref={sentryRef} />
            {(loading || loadingMore || hasNextPage) && <LoadingMore />}
            {data?.length === 0 && !loading && <Empty store={store} />}
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default Table;
