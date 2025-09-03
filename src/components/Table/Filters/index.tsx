import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useId,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import { Button, Card, useMediaQuery } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";

import { CloseIcon } from "@/components/icons/Close";
import classNames from "classnames";
import { memo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import TableButton from "../components/TableButton";
import { IDataStore } from "../interfaces/DataStore";
import { TableColumn } from "../components/Table";
import QuickFilter from "./Quick";
import Items from "./Items";
import Add from "./Add";
import { FilterIcon } from "@/components/icons/FilterIcon";

const DropDownCard = styled(Card)`
  z-index: 1305 !important;
  overflow: inherit !important;
  border-radius: ${({ theme }) => theme.shape.borderRadius}px;
  max-width: 600px;
  width: 100%;

  .content-wrapper {
    padding: 15px;
    gap: 10px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;

    .header {
      display: flex;
      justify-content: space-between;
      width: 100%;
      align-items: center;
      height: 40px;
      overflow: hidden;

      h3 {
        margin: 0;
      }
    }
  }
`;

function Filters({
  store,
  columns,
}: {
  store: any;
  columns: TableColumn<any>[];
}) {
  const { filters, clearFilters } = store(
    useShallow((state: IDataStore) => state)
  );
  const [isOpen, setIsOpen] = useState(false);

  const { x, y, refs, strategy, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "bottom-start",
    middleware: [
      offset(10),
      flip({ fallbackAxisSideDirection: "end" }),
      shift(),
    ],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  const headingId = useId();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <>
      <TableButton
        key="filters"
        ref={refs.setReference}
        {...getReferenceProps()}
        className={classNames({
          active: filters.length > 0,
          open: isOpen,
        })}
        startIcon={<FilterIcon width={18} height={18} />}
      >
        {!isMobile && (
          <span className="text">
            {filters.length > 1 ? "Filterat" : "Filtro"}
            {filters.length > 0 && ": "}
            {filters.length > 0 && <>{filters.length}</>}
          </span>
        )}
        {filters.length > 0 && (
          <span
            className="clear"
            onClick={(e) => {
              e.stopPropagation();
              clearFilters();
            }}
          >
            <CloseIcon width={16} height={16} />
          </span>
        )}
      </TableButton>
      {isOpen && (
        <FloatingFocusManager context={context} modal={false}>
          <DropDownCard
            variant="outlined"
            ref={refs.setFloating}
            style={{
              position: strategy,
              top: y ?? 0,
              left: x ?? 0,
            }}
            aria-labelledby={headingId}
            {...getFloatingProps()}
          >
            <div className="content-wrapper">
              <div className="header">
                <h3>Filterat</h3>
                {filters.length > 0 && (
                  <div className="actions">
                    <Button
                      size="small"
                      onClick={() => {
                        clearFilters();
                        setIsOpen(false);
                      }}
                    >
                      Fshi të gjitha
                    </Button>
                  </div>
                )}
              </div>
              <QuickFilter store={store} columns={columns} />
              <Items store={store} columns={columns} />
              <Add store={store} columns={columns} />
            </div>
          </DropDownCard>
        </FloatingFocusManager>
      )}
    </>
  );
}
export default memo(Filters);
