import React from "react";
import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import { styled } from "@mui/material";
import { usePopover, CustomPopover } from "@/components/shared/popover";
import { PlusIcon } from "@/components/icons/PlusIcon";
import { BlockItems } from "../../selectors/block-selector/Blocks";

const ColumnBox = styled(NodeViewWrapper)`
  border: 1px dashed ${({ theme }) => theme.palette.divider};
  border-radius: 8px;
  padding: 12px;
  position: relative;
  min-height: 60px;
`;

const AddBlockTrigger = styled("div")`
  margin-top: 12px;
  display: flex;
  justify-content: center;
  cursor: pointer;
  border: 1px dashed ${({ theme }) => theme.palette.divider};
  border-radius: 8px;
  padding: 14px 32px;
  background: ${({ theme }) => theme.palette.background.paper};
  color: ${({ theme }) => theme.palette.text.secondary};
  width: 100%;
  text-align: center;

  svg {
    width: 25px;
    height: 25px;
    color: ${({ theme }) => theme.palette.text.secondary};
  }

  &:hover {
    background: ${({ theme }) => theme.palette.background.default};
  }
`;

const ColumnComponent = ({ editor, node, getPos }: any) => {
  const popover = usePopover();

  // Insert a new block at the end of this column
  const handleInsertBlock = (block: any) => {
    // Position after <columns> node opening + offset for any column siblings
    const columnStart = getPos(); // "getPos()" is where this column node begins
    // The end of this node is "columnStart + node.nodeSize - 1"
    const insertPos = columnStart + node.nodeSize - 1;

    // Insert block at that position
    editor.chain().focus().insertContentAt(insertPos, block).run();
    popover.onClose();
  };

  return (
    <ColumnBox>
      {/* The actual column's content (paragraphs, etc.) */}
      <NodeViewContent as="div" className="column-content" />

      {/* Plus button to add new block at end of this column */}
      <AddBlockTrigger
        onClick={() => {
          popover.onOpen();
        }}
      >
        <PlusIcon />
      </AddBlockTrigger>

      {/*
        Popover w/ a block selector that calls handleInsertBlock
        with the chosen node to insert
      */}
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <BlockItems popover={popover} onInsert={handleInsertBlock} />
      </CustomPopover>
    </ColumnBox>
  );
};

export default ColumnComponent;
