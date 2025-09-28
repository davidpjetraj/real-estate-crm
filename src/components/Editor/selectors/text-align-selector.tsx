import { Button, styled, Tooltip } from "@mui/material";
import classNames from "classnames";
import { useEffect, useRef } from "react";
import { useCurrentEditor } from "@tiptap/react";
import {
  EditorTextAlignLeftIcon,
  EditorTextAlignCenterIcon,
  EditorTextAlignRightIcon,
} from "@/components/icons/editor";
import { CustomPopover, usePopover } from "@/components/shared/popover";
import { ChevronDownIcon } from "@/components/icons/ChevronDownIcon";

const Wrapper = styled("form")`
  display: flex;
  background: ${({ theme }) => theme.palette.background.paper};
  border-radius: ${({ theme }) => theme.shape.borderRadius}px;
  border: 1px solid ${({ theme }) => theme.palette.divider};
  gap: 0;
  overflow: hidden;

  input {
    width: 100%;
    border: none;
    outline: none;
    background-color: transparent;
    color: ${({ theme }) => theme.palette.text.primary};
  }

  button {
    width: 30px;
    height: 30px;
    min-width: 30px;
    border: 1px solid transparent;
    background-color: ${({ theme }) => theme.palette.background.paper};
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0;
    cursor: pointer;
    color: ${({ theme }) => theme.palette.text.primary};
    &:nth-child(2) {
      border-radius: 0;
      border-left: 1px solid ${({ theme }) => theme.palette.divider};
      border-right: 1px solid ${({ theme }) => theme.palette.divider};
    }
    &.active {
      background-color: ${({ theme }) => theme.palette.action.selected};
      color: ${({ theme }) => theme.palette.primary.main};
    }

    &:hover {
      background-color: ${({ theme }) => theme.palette.action.hover};
    }

    &.delete {
      color: ${({ theme }) => theme.palette.error.main};
      border: 1px solid ${({ theme }) => theme.palette.error.main};
    }
  }
`;

export const TextAlignSelector = () => {
  const { editor } = useCurrentEditor();
  const popover = usePopover();
  const inputRef = useRef<any>(null);

  useEffect(() => {
    inputRef.current?.focus();
  });

  if (!editor) return null;

  const getActiveTextAlign = () => {
    if (editor.isActive({ textAlign: "left" })) {
      return <EditorTextAlignLeftIcon width={16} height={16} />;
    } else if (editor.isActive({ textAlign: "center" })) {
      return <EditorTextAlignCenterIcon width={16} height={16} />;
    } else if (editor.isActive({ textAlign: "right" })) {
      return <EditorTextAlignRightIcon width={16} height={16} />;
    } else {
      return <EditorTextAlignLeftIcon width={16} height={16} />;
    }
  };

  return (
    <>
      <Tooltip
        title="Textausrichtung"
        placement="top"
        arrow
        disableFocusListener
        disableTouchListener
      >
        <Button
          type="button"
          onClick={popover.onOpen}
          className={classNames({
            "bubble-button": true,
            active:
              editor.isActive({ textAlign: "left" }) ||
              editor.isActive({ textAlign: "center" }) ||
              editor.isActive({ textAlign: "right" }),
          })}
          endIcon={
            <ChevronDownIcon
              style={{
                transform: popover.open ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
              }}
            />
          }
        >
          {getActiveTextAlign()}
        </Button>
      </Tooltip>
      <CustomPopover open={popover.open} onClose={popover.onClose}>
        <Wrapper>
          <Tooltip title="Textausrichtung links" placement="top" arrow>
            <button
              type="button"
              className={classNames({
                active: editor.isActive({ textAlign: "left" }),
              })}
              onClick={() => {
                editor.chain().focus().setTextAlign("left").run();
                popover.onClose();
              }}
            >
              <EditorTextAlignLeftIcon width={16} height={16} />
            </button>
          </Tooltip>
          <Tooltip title="Textausrichtung zentriert" placement="top" arrow>
            <button
              type="button"
              className={classNames({
                active: editor.isActive({ textAlign: "center" }),
              })}
              onClick={() => {
                editor.chain().focus().setTextAlign("center").run();
                popover.onClose();
              }}
            >
              <EditorTextAlignCenterIcon width={16} height={16} />
            </button>
          </Tooltip>
          <Tooltip title="Textausrichtung rechts" placement="top" arrow>
            <button
              type="button"
              className={classNames({
                active: editor.isActive({ textAlign: "right" }),
              })}
              onClick={() => {
                editor.chain().focus().setTextAlign("right").run();
                popover.onClose();
              }}
            >
              <EditorTextAlignRightIcon width={16} height={16} />
            </button>
          </Tooltip>
        </Wrapper>
      </CustomPopover>
    </>
  );
};
