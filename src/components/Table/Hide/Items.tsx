import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { darken, styled, useTheme } from "@mui/material/styles";
import { memo } from "react";
import { useShallow } from "zustand/react/shallow";
import { IDataStore } from "../interfaces/DataStore";
import Item from "./Item";

const DragItem = styled("div")`
  border: 1px solid ${({ theme }) => theme.palette.divider};
  &:hover {
    background-color: ${({ theme }) =>
      darken(theme.palette.background.paper, 0.05)} !important;
    border-color: ${({ theme }) => theme.palette.divider} !important;
  }
`;

const Wrapper = styled("div")`
  display: flex;
  flex-direction: column;
  width: 100%;

  p {
    margin-bottom: 5px;
    color: ${({ theme }) => theme.palette.text.secondary};
    font-size: 14px;
    margin-top: 0;
  }
`;

function SortableItem({
  id,
  data,
  store,
}: {
  id: string;
  data: any;
  store: any;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const theme = useTheme();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    userSelect: "none" as const,
    padding: 6,
    marginBottom: 6,
    borderRadius: 8,
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: isDragging
      ? darken(theme.palette.background.paper, 0.1)
      : theme.palette.background.paper,
  };

  return (
    <DragItem ref={setNodeRef} style={style}>
      <Item
        data={data}
        store={store}
        attributes={{ ...attributes }}
        listeners={{ ...listeners }}
      />
    </DragItem>
  );
}

function Items({ store }: { store: any }) {
  const { reorderColumns, columns } = store(
    useShallow((state: IDataStore) => state)
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const overItem = columns.find((col: any) => col.id === over.id);

    if (overItem?.disableHidable) {
      return;
    }

    if (active.id !== over.id) {
      const oldIndex = columns.findIndex((col: any) => col.id === active.id);
      const newIndex = columns.findIndex((col: any) => col.id === over.id);

      const reorderedItems = arrayMove(columns, oldIndex, newIndex);
      reorderColumns(reorderedItems);
    }
  };

  const visibleColumns = columns.filter(
    (item: any) => !(item.disableHidable && item.hidden)
  );

  return (
    <Wrapper>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <SortableContext items={columns.map((item: any) => item.id)}>
          {visibleColumns.map((item: any) => (
            <SortableItem
              key={item.id}
              id={item.id}
              data={item}
              store={store}
            />
          ))}
        </SortableContext>
      </DndContext>
    </Wrapper>
  );
}

export default memo(Items);
