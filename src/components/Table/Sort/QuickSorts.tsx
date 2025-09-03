import { memo } from "react";
import { alpha, darken, styled } from "@mui/material";
import { useShallow } from "zustand/react/shallow";
import classNames from "classnames";
import { TableColumn } from "../components/Table";
import { CheckIcon } from "@/components/icons/CheckIcon";
import { IDataStore } from "../interfaces/DataStore";
import { getQuickSortColumns } from "../utils";

const Wrapper = styled("div")`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;

  p {
    margin-bottom: 5px;
    color: ${({ theme }) => theme.palette.text.secondary};
    font-size: 14px;
    margin-top: 0;
  }

  .items {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  button {
    padding: 4px 8px;
    border: 1px solid ${({ theme }) => theme.palette.divider};
    border-radius: 4px;
    background-color: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
    transition: 0.3s ease-in-out !important;
    color: ${({ theme }) => theme.palette.text.primary};

    &.active {
      background-color: ${({ theme }) =>
        alpha(theme.palette.primary.main, 0.1)};
      border-color: ${({ theme }) => alpha(theme.palette.primary.main, 0.1)};
      color: ${({ theme }) => {
        const darkMode = theme.palette.mode === "dark";
        return darkMode
          ? theme.palette.primary.light
          : darken(theme.palette.primary.main, 0.8);
      }};

      &:hover {
        background-color: ${({ theme }) =>
          alpha(theme.palette.primary.main, 0.2)};
        border-color: ${({ theme }) => alpha(theme.palette.primary.main, 0.2)};
        color: ${({ theme }) => {
          const darkMode = theme.palette.mode === "dark";
          return darkMode
            ? theme.palette.primary.light
            : darken(theme.palette.primary.main, 0.8);
        }};
      }
    }

    &:hover {
      background-color: ${({ theme }) =>
        alpha(theme.palette.common.black, 0.1)};
      border-color: ${({ theme }) => alpha(theme.palette.common.black, 0.1)};
      color: ${({ theme }) => {
        const darkMode = theme.palette.mode === "dark";
        return darkMode
          ? theme.palette.primary.light
          : darken(theme.palette.primary.main, 0.8);
      }};
    }

    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      svg {
        width: 16px;
        height: 16px;
      }
    }
  }
`;

function QuickSort({
  store,
  columns,
}: {
  store: any;
  columns: TableColumn<any>[];
}) {
  const { sort, addSortItem, removeSortItem } = store(
    useShallow((state: IDataStore) => state)
  );

  const sortableItems = getQuickSortColumns(columns);

  return (
    <Wrapper>
      <p>Rënditje e shpejtë</p>
      <div className="items">
        {sortableItems.map((item: any) => {
          const isActive = sort.some((s: any) => s.id === item.id);
          return (
            <button
              key={item.id}
              className={classNames({
                active: isActive,
              })}
              onClick={() => {
                if (isActive) {
                  removeSortItem(item);
                } else {
                  addSortItem({
                    ...item,
                    value: "asc",
                  });
                }
              }}
            >
              {isActive && (
                <span className="icon">
                  <CheckIcon />
                </span>
              )}
              <span className="text">{item.label}</span>
            </button>
          );
        })}
      </div>
    </Wrapper>
  );
}

export default memo(QuickSort);
