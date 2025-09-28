import { styled } from "@mui/material";
import { useEffect, useRef } from "react";
import { useCurrentEditor } from "@tiptap/react";

import { CustomPopover, usePopover } from "@/components/shared/popover";
import { PlusIcon } from "@/components/icons/PlusIcon";

import React from "react";
import { BlockItems } from "./Blocks";

const ItemWrapper = styled("div")`
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  border-radius: ${({ theme }) => theme.shape.borderRadius}px;
  justify-content: center;
  background-color: ${({ theme }) => theme.palette.primary.main};
  color: #fff;
  border-radius: 4px;
  height: 30px;
  width: 30px;
`;

export const BlockSelector = () => {
  const { editor } = useCurrentEditor();
  const popover = usePopover();
  const inputRef = useRef<any>(null);

  useEffect(() => {
    inputRef.current?.focus();
  });

  if (!editor) return null;

  const handleInsertBlock = (nodeToInsert: any) => {
    editor.chain().focus().insertContent(nodeToInsert).run();

    popover.onClose();
  };

  return (
    <>
      <ItemWrapper onClick={popover.onOpen}>
        <PlusIcon />
      </ItemWrapper>
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <BlockItems
          popover={popover}
          onInsert={(node) => {
            handleInsertBlock(node);
          }}
        />
      </CustomPopover>
    </>
  );
};
