import { styled, Tooltip } from "@mui/material";
import classNames from "classnames";
import { useEffect, useRef } from "react";
import { useCurrentEditor } from "@tiptap/react";
import {
  EditorCheckIcon,
  EditorDeleteIcon,
  EditorLinkIcon,
} from "@/components/icons/editor";
import { CustomPopover, usePopover } from "@/components/shared/popover";

export function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_e) {
    return false;
  }
}

export function getUrlFromString(str: string) {
  if (isValidUrl(str)) return str;
  try {
    if (str.includes(".") && !str.includes(" ")) {
      return new URL(`https://${str}`).toString();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_e) {
    return null;
  }
}

const Wrapper = styled("form")`
  display: flex;
  padding: 10px;
  background: ${({ theme }) => theme.palette.background.paper};
  border-radius: ${({ theme }) => theme.shape.borderRadius}px;
  box-shadow: ${({ theme }) => theme.shadows[1]};
  gap: 10px;

  input {
    width: 100%;
    border: none;
    outline: none;
    background-color: transparent;
    color: ${({ theme }) => theme.palette.text.primary};
  }

  button {
    width: 40px;
    height: 40px;
    min-width: 40px;
    border: 1px solid ${({ theme }) => theme.palette.divider};
    background-color: ${({ theme }) => theme.palette.background.paper};
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: ${({ theme }) => theme.shape.borderRadius}px;
    cursor: pointer;
    color: ${({ theme }) => theme.palette.text.primary};

    &:hover {
      background-color: ${({ theme }) => theme.palette.action.hover};
    }

    &.delete {
      color: ${({ theme }) => theme.palette.error.main};
      border: 1px solid ${({ theme }) => theme.palette.error.main};
    }
  }
`;

export const LinkSelector = () => {
  const inputRef = useRef<any>(null);
  const { editor } = useCurrentEditor();

  useEffect(() => {
    inputRef.current?.focus();
  });

  const popover = usePopover();
  if (!editor) return null;

  return (
    <>
      <Tooltip
        title="Link"
        placement="top"
        arrow
        disableFocusListener
        disableTouchListener
      >
        <button
          type="button"
          onClick={popover.onOpen}
          className={classNames({
            "bubble-button": true,
            active: editor.isActive("link"),
          })}
        >
          <EditorLinkIcon />
        </button>
      </Tooltip>
      <CustomPopover open={popover.open} onClose={popover.onClose}>
        <Wrapper
          onSubmit={(e) => {
            const target = e.currentTarget as HTMLFormElement;
            e.preventDefault();
            const input = target[0] as HTMLInputElement;
            const url = getUrlFromString(input.value);
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            url && editor.chain().focus().setLink({ href: url }).run();
          }}
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Paste a link"
            defaultValue={editor.getAttributes("link").href || ""}
          />
          {editor.getAttributes("link").href ? (
            <button
              type="button"
              className="delete"
              onClick={() => {
                editor.chain().focus().unsetLink().run();
                inputRef.current.value = "";
              }}
            >
              <EditorDeleteIcon />
            </button>
          ) : (
            <button type="button">
              <EditorCheckIcon />
            </button>
          )}
        </Wrapper>
      </CustomPopover>
    </>
  );
};
