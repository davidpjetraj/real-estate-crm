import { Button, styled } from "@mui/material";
import classNames from "classnames";
import { useEffect, useRef } from "react";
import { useCurrentEditor } from "@tiptap/react";
import { ChevronDownIcon } from "@/components/icons/ChevronDownIcon";
import { CustomPopover, usePopover } from "@/components/shared/popover";

const Wrapper = styled("form")`
  display: flex;
  flex-direction: column;
  padding: 0;
  background: ${({ theme }) => theme.palette.background.paper};
  border-radius: ${({ theme }) => theme.shape.borderRadius}px;
  gap: 6px;

  button {
    justify-content: flex-start;
    background-color: transparent;
    &.active {
      background-color: ${({ theme }) => theme.palette.action.selected};
      color: ${({ theme }) => theme.palette.primary.main};
    }
  }

  input {
    width: 100%;
    border: none;
    outline: none;
    background-color: transparent;
    color: ${({ theme }) => theme.palette.text.primary};
  }
`;

export const HeadingSelector = () => {
  const { editor } = useCurrentEditor();
  const popover = usePopover();
  const inputRef = useRef<any>(null);

  useEffect(() => {
    inputRef.current?.focus();
  });

  if (!editor) return null;

  const getActiveHeading = () => {
    if (editor.isActive("heading", { level: 1 })) {
      return "Header";
    } else if (editor.isActive("heading", { level: 2 })) {
      return "Titull";
    } else if (editor.isActive("heading", { level: 3 })) {
      return "Subtitull";
    } else if (editor.isActive("paragraph")) {
      return "Normal";
    } else {
      return "Normal";
    }
  };

  return (
    <>
      <Button
        type="button"
        size="small"
        variant="outlined"
        color="inherit"
        onClick={popover.onOpen}
        className={classNames({
          "bubble-button": true,
          active: editor.isActive("heading") || editor.isActive("paragraph"),
        })}
        style={{
          width: "100px",
        }}
        endIcon={
          <ChevronDownIcon
            style={{
              transform: popover.open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
            }}
          />
        }
      >
        {getActiveHeading()}
      </Button>
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Wrapper>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => {
              editor.chain().focus().toggleHeading({ level: 1 }).run();
              popover.onClose();
            }}
            className={classNames({
              active: editor.isActive("heading", { level: 1 }),
            })}
          >
            Header
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => {
              editor.chain().focus().toggleHeading({ level: 2 }).run();
              popover.onClose();
            }}
            className={classNames({
              active: editor.isActive("heading", { level: 2 }),
            })}
          >
            Titull
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => {
              editor.chain().focus().toggleHeading({ level: 3 }).run();
              popover.onClose();
            }}
            className={classNames({
              active: editor.isActive("heading", { level: 3 }),
            })}
          >
            Subtitull
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => {
              editor.commands.setParagraph();
              popover.onClose();
            }}
            className={classNames({
              active: editor.isActive("paragraph"),
            })}
          >
            Normal
          </Button>
        </Wrapper>
      </CustomPopover>
    </>
  );
};
