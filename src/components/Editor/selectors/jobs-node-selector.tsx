import { Divider, styled, Tooltip } from "@mui/material";
import {
  EditorListIcon,
  EditorNumberListIcon,
  EditorTextBoldIcon,
  EditorTextCodeIcon,
  EditorTextItalicIcon,
  EditorTextStrikeIcon,
  EditorTextUnderlineIcon,
} from "@/components/icons/editor";
import { useCurrentEditor } from "@tiptap/react";
import classNames from "classnames";
import EditorQuoteIcon from "@/components/icons/editor/EditorQuoteIcon";

export type EditorState = ReturnType<typeof useCurrentEditor>["editor"];

export type SelectorItem = {
  name: string;
  icon: any;
  command: (editor: EditorState) => void;
  isActive: (editor: EditorState) => boolean;
};

const items: SelectorItem[] = [
  {
    name: "Bold",
    isActive: (editor: any) => editor.isActive("bold"),
    command: (editor: any) => editor.chain().focus().toggleBold().run(),
    icon: EditorTextBoldIcon,
  },
  {
    name: "Underline",
    isActive: (editor: any) => editor.isActive("underline"),
    command: (editor: any) => editor.chain().focus().toggleUnderline().run(),
    icon: EditorTextUnderlineIcon,
  },
  {
    name: "Italic",
    isActive: (editor: any) => editor.isActive("italic"),
    command: (editor: any) => editor.chain().focus().toggleItalic().run(),
    icon: EditorTextItalicIcon,
  },
  {
    name: "Code",
    icon: EditorTextCodeIcon,
    command: (editor: any) => {
      if (editor.isActive("codeBlock")) {
        editor.chain().focus().setParagraph().run();
      } else {
        editor.chain().focus().toggleCodeBlock().run();
      }
    },
    isActive: (editor: any) => editor.isActive("codeBlock"),
  },
  {
    name: "Strike",
    isActive: (editor: any) => editor.isActive("strike"),
    command: (editor: any) => editor.chain().focus().toggleStrike().run(),
    icon: EditorTextStrikeIcon,
  },
  {
    name: "Blockquote",
    isActive: (editor: any) => editor.isActive("blockquote"),
    command: (editor: any) => editor.chain().focus().toggleBlockquote().run(),
    icon: EditorQuoteIcon,
  },
];

const itemsAlign: SelectorItem[] = [
  {
    name: "Bullet List",
    icon: EditorListIcon,
    command: (editor: any) => editor.chain().focus().toggleBulletList().run(),
    isActive: (editor: any) => editor.isActive("bulletList"),
  },
  {
    name: "Numbered List",
    icon: EditorNumberListIcon,
    command: (editor: any) => editor.chain().focus().toggleOrderedList().run(),
    isActive: (editor: any) => editor.isActive("orderedList"),
  },
];

const ItemWrapper = styled("div")`
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.shape.borderRadius}px;
  justify-content: space-between;
`;

export const JobsNodeSelector = () => {
  const { editor } = useCurrentEditor();
  if (!editor) return null;

  return (
    <>
      {items.map((item) => {
        const isActive = item.isActive(editor);
        return (
          <div
            key={item.name}
            onClick={() => {
              item.command(editor);
            }}
          >
            <Tooltip title={item.name} placement="top" arrow>
              <ItemWrapper
                className={classNames({
                  "bubble-button": true,
                  active: isActive,
                })}
              >
                <item.icon />
              </ItemWrapper>
            </Tooltip>
          </div>
        );
      })}
      <Divider
        orientation="vertical"
        variant="middle"
        flexItem
        sx={{
          mt: 0.2,
          mb: 0.2,
        }}
      />
      {itemsAlign.map((item) => {
        const isActive = item.isActive(editor);
        return (
          <div
            key={item.name}
            onClick={() => {
              item.command(editor);
            }}
          >
            <Tooltip title={item.name} placement="top" arrow>
              <ItemWrapper
                className={classNames({
                  "bubble-button": true,
                  active: isActive,
                })}
              >
                <item.icon />
              </ItemWrapper>
            </Tooltip>
          </div>
        );
      })}
    </>
  );
};
