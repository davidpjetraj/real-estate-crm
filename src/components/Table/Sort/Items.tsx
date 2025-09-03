import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
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

function SortableItem({ id, data, store }: any) {
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
    borderColor: isDragging ? "1px solid #ccc" : "1px solid #fff",
    backgroundColor: isDragging
      ? darken(theme.palette.background.paper, 0.1)
      : theme.palette.background.paper,
  };

  return (
    <DragItem ref={setNodeRef} style={style}>
      <Item
        data={data}
        store={store}
        attributes={attributes}
        listeners={listeners}
      />
    </DragItem>
  );
}

function Items({ store }: { store: any }) {
  const { sort, reorderSort } = store(useShallow((state: IDataStore) => state));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sort.findIndex((item: any) => item.id === active.id);
      const newIndex = sort.findIndex((item: any) => item.id === over.id);
      const reorderedItems = arrayMove(sort, oldIndex, newIndex);
      reorderSort(reorderedItems);
    }
  };

  if (sort.length === 0) return null;

  return (
    <Wrapper>
      <p>Të gjitha kolonat e renditura</p>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={sort.map((item: any) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          {sort.map((item: any) => (
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
