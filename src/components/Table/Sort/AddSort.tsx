import { memo, useState } from "react";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useDismiss,
  useRole,
  useClick,
  useInteractions,
  FloatingFocusManager,
  useId,
} from "@floating-ui/react";
import {
  Button,
  Card,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { getFiltrableColumns } from "../utils";
import { useShallow } from "zustand/react/shallow";
import { TableColumn } from "../components/Table";
import { IDataStore } from "../interfaces/DataStore";
import { PlusIcon } from "@/components/icons/PlusIcon";

const DropDownCard = styled(Card)`
  z-index: 10000;
  min-width: 180px;
  padding: 8px;
  max-height: 300px;
  overflow-y: auto;
  border-radius: ${({ theme }) => theme.shape.borderRadius}px;

  .content {
    padding: 0;
    margin: 0;

    ul {
      padding: 0;
      margin: 0;

      .MuiListItemIcon-root {
        min-width: 40px;
      }
      > .MuiButtonBase-root {
        padding: 4px 14px;
        border-radius: 12px;
      }
    }
  }
`;

function Add({ store, columns }: { store: any; columns: TableColumn<any>[] }) {
  const { sort, addSortItem } = store(useShallow((state: IDataStore) => state));
  const [isOpen, setIsOpen] = useState(false);

  const items = getFiltrableColumns(columns);

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

  const allowed = items.filter((item) => {
    return !sort.find((sortItem: any) => sortItem.id === item.id);
  });

  if (allowed.length === 0) return null;
  return (
    <>
      <Button
        ref={refs.setReference}
        {...getReferenceProps()}
        color="inherit"
        startIcon={<PlusIcon width={18} height={18} />}
      >
        Shto rënditje
      </Button>
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
            <div className="content">
              <List>
                {allowed.map((item: any) => {
                  return (
                    <ListItemButton
                      key={item.id}
                      onClick={() => {
                        setIsOpen(false);
                        addSortItem({
                          ...item,
                          value: "asc",
                        });
                      }}
                    >
                      <ListItemText primary={item.label} />
                    </ListItemButton>
                  );
                })}
              </List>
            </div>
          </DropDownCard>
        </FloatingFocusManager>
      )}
    </>
  );
}

export default memo(Add);
