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
import {
  Card,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
} from "@mui/material";
import { useState } from "react";
import { IDataStore } from "../interfaces/DataStore";
import { SortingAsc, SortingDesc } from "../Sort/Item";

const DropDownCard = styled(Card)`
  z-index: 99999999 !important;
  overflow: inherit !important;
  border-radius: ${({ theme }) => theme.shape.borderRadius}px;
  max-width: 200px;
  width: 100%;
  min-width: 200px;

  svg {
    width: 20px;
    height: 20px;
  }
`;

type ColumnsSettingsProps = {
  store: any;
  column: any;
  isFirstItem: boolean;
  isLastItem: boolean;
  currentIndex: number;
};

export default function ColumnsSettings({
  store,
  column,
}: ColumnsSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { updateSortItem, sort, addSortItem } = store(
    (state: IDataStore) => state
  );

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

  const { getFloatingProps } = useInteractions([click, dismiss, role]);

  const headingId = useId();

  const sortItem = sort.find((item: any) => item.id === column.accessorKey);

  const sortTo = (value: any) => {
    if (sortItem) {
      updateSortItem({
        id: column.accessorKey,
        label: column.label,
        value,
      });
    } else {
      addSortItem({
        id: column.accessorKey,
        label: column.label,
        value,
      } as any);
    }
  };

  return (
    <>
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
            {sortItem ? (
              <>
                <List>
                  <ListItem
                    disablePadding
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsOpen(false);
                      sortTo("asc");
                    }}
                  >
                    <ListItemButton>
                      <ListItemIcon>
                        <SortingDesc />
                      </ListItemIcon>
                      <ListItemText primary="ASC" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem
                    disablePadding
                    onClick={(e) => {
                      e.stopPropagation();
                      sortTo("desc");
                      setIsOpen(false);
                    }}
                  >
                    <ListItemButton>
                      <ListItemIcon>
                        <SortingAsc />
                      </ListItemIcon>
                      <ListItemText primary={"table.desc"} />
                    </ListItemButton>
                  </ListItem>
                </List>
                <Divider />
              </>
            ) : null}
          </DropDownCard>
        </FloatingFocusManager>
      )}
    </>
  );
}
