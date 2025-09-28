import { Tooltip } from "@mui/material";
import classNames from "classnames";
import { useEffect, useRef } from "react";
import { useCurrentEditor } from "@tiptap/react";
import { EditorUndoIcon, EditorRedoIcon } from "@/components/icons/editor";

export const UndoRedoSelector = () => {
  const { editor } = useCurrentEditor();
  const inputRef = useRef<any>(null);

  useEffect(() => {
    inputRef.current?.focus();
  });

  if (!editor) return null;

  return (
    <>
      <Tooltip
        title="Rückgängig"
        placement="top"
        arrow
        disableFocusListener
        disableTouchListener
      >
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className={classNames({
            "bubble-button": true,
          })}
        >
          <EditorUndoIcon />
        </button>
      </Tooltip>
      <Tooltip
        title="Wiederholen"
        placement="top"
        arrow
        disableFocusListener
        disableTouchListener
      >
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className={classNames({
            "bubble-button": true,
          })}
        >
          <EditorRedoIcon />
        </button>
      </Tooltip>
    </>
  );
};
