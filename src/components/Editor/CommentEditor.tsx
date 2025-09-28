"use client";
import { alpha, styled } from "@mui/material";
import { Editor } from "@tiptap/core";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorProvider } from "@tiptap/react";
import classNames from "classnames";
import { useDebouncedCallback } from "use-debounce";
import { simpleEditorExtensions } from "./extensions";
import FormikTextEditorMenu from "./Menu/FormikTextEditorMenu";
import Mention from "@tiptap/extension-mention";
import { mentionSuggestionOptions } from "./mentionSuggestionOptions";
import { getUri } from "../utils/getUri";
import useAuth from "../../../store/useAuth";

const ProseMirror = styled("div")`
  height: 100%;
  margin: 0 -8px;
  .editor-content {
    height: 100%;
    display: flex;
    gap: 10px;
    flex-direction: column;
    > div:not(.editor-menu) {
      height: 100%;
    }
  }
  .ProseMirror .is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    float: left;
    color: ${({ theme }) => alpha(theme.palette.text.primary, 0.5)};
    pointer-events: none;
    height: 0;
  }

  .ProseMirror {
    outline: none !important;
  }

  .ProseMirror img {
    transition: filter 0.1s ease-in-out;
  }
  .ProseMirror img:hover {
    cursor: pointer;
    filter: brightness(90%);
  }

  .ProseMirror img.ProseMirror-selectednode {
    outline: 3px solid #5abbf7;
    filter: brightness(90%);
  }

  .img-placeholder {
    position: relative;
  }
  .img-placeholder:before {
    content: "";
    box-sizing: border-box;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    animation: spinning 0.6s linear infinite;
  }

  @keyframes spinning {
    to {
      transform: rotate(360deg);
    }
  }

  .tippy-box {
    max-width: 400px !important;
  }

  .ProseMirror-selectednode {
    outline: none !important;
    transition: background-color 0.2s;
    box-shadow: none;
  }

  iframe {
    border: 8px solid #ffd00027;
    border-radius: 4px;
    min-width: 200px;
    min-height: 200px;
    display: block;
    outline: 0px solid transparent;
  }

  div[data-youtube-video] > iframe {
    cursor: move;
    aspect-ratio: 16 / 9;
    width: 100%;
  }

  .ProseMirror-selectednode iframe {
    transition: outline 0.15s;
    outline: 6px solid #fbbf24;
  }

  @media only screen and (max-width: 480px) {
    div[data-youtube-video] > iframe {
      max-height: 50px;
    }
  }

  @media only screen and (max-width: 720px) {
    div[data-youtube-video] > iframe {
      max-height: 100px;
    }
  }

  .editor-pre,
  .ProseMirror pre {
    margin: 0;
  }

  .editor-pre,
  .ProseMirror pre:before {
    font-size: 14px;
    line-height: 24px;
  }

  pre.is-empty {
    &:before {
      display: none !important;
    }
  }

  .editor-pre,
  .ProseMirror pre.is-empty code {
    opacity: 0;
  }

  .editor-code,
  .ProseMirror code {
    background: ${({ theme }) => alpha(theme.palette.warning.main, 0.05)};
    border: 1px solid ${({ theme }) => theme.palette.divider};
    border-radius: 4px;
    color: ${({ theme }) => theme.palette.warning.dark};
    font-family: monospace;
    padding: 0px 4px;
    font-size: 14px;
  }

  .hljs-comment,
  .hljs-quote {
    color: #616161;
  }

  .hljs-variable,
  .hljs-template-variable,
  .hljs-attribute,
  .hljs-tag,
  .hljs-name,
  .hljs-regexp,
  .hljs-link,
  .hljs-name,
  .hljs-selector-id,
  .hljs-selector-class {
    color: #f98181;
  }

  .hljs-number,
  .hljs-meta,
  .hljs-built_in,
  .hljs-builtin-name,
  .hljs-literal,
  .hljs-type,
  .hljs-params {
    color: #fbbc88;
  }

  .hljs-string,
  .hljs-symbol,
  .hljs-bullet {
    color: #b9f18d;
  }

  .hljs-title,
  .hljs-section {
    color: #faf594;
  }

  .hljs-keyword,
  .hljs-selector-tag {
    color: #70cff8;
  }

  .hljs-emphasis {
    font-style: italic;
  }

  .hljs-strong {
    font-weight: 700;
  }

  .ProseMirror
    :where(blockquote p:first-of-type):not(
      :where([class~="not-prose"], [class~="not-prose"] *)
    ):before {
    content: open-quote;
  }

  .ProseMirror
    :where(blockquote p:last-of-type):not(
      :where([class~="not-prose"], [class~="not-prose"] *)
    ):after {
    content: close-quote;
  }

  .ProseMirror blockquote {
    font-weight: 500;
    font-style: italic;
  }
  .ProseMirror .mention {
    display: inline-block;
    vertical-align: middle;
  }
  .ProseMirror .mention-content {
    background-color: ${({ theme }) => alpha(theme.palette.primary.main, 0.1)};
    border-radius: 8px;
    padding: 4px;
    font-size: 14px;
    font-weight: 500;
    display: flex;
    align-items: center;
    img {
      border-radius: 50%;
      margin-right: 4px;
      width: 18px;
      height: 18px;
      object-fit: cover;
    }

    .mention-label {
      line-height: 16px;
      font-size: 14px;
    }
    .mention-avatar {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      margin-right: 4px;
      display: inline-block;
      text-align: center;
      vertical-align: middle;
      line-height: 16px;
      font-size: 12px;
      color: #fff;
      text-transform: uppercase;
      background-color: ${({ theme }) => theme.palette.primary.main};
    }
  }
`;

const Wrapper = styled("div")`
  position: relative;
  width: 100%;
  outline: none;

  .ProseMirror {
    padding: 10px 15px;
  }

  .markdown-wrapper {
    padding: 8px;
    border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
    * {
      font-size: 14px;
    }
  }
`;

interface CommentEditorProps {
  initialContent: any | undefined;
  onUpdate: (editor: Editor) => any;
  description?: string;
  onFocus?: () => any;
  onBlur?: () => any;
  editorProps?: any;
  info?: any;
}

export const CommentEditor = ({
  initialContent,
  onUpdate,
  description,
  onFocus,
  onBlur,
  editorProps,
  info,
}: CommentEditorProps) => {
  const { config_data } = useAuth((state) => state);

  const mentions = Mention.configure({
    HTMLAttributes: {},
    suggestion: mentionSuggestionOptions(
      config_data?.users
        ?.filter((user) => user.status === "active")
        .map((user) => ({
          ...user,
          avatar: getUri(user?.avatar as string),
        })) || []
    ),
  });

  const placeholder = Placeholder.configure({
    placeholder: ({ node }) => {
      if (node.childCount > 0) {
        return "";
      }
      return description ? description : "Schreibe deinen Kommentar...";
    },
  });

  return (
    <ProseMirror className="prose-mirror-editor-wrapper">
      <Wrapper
        className={classNames({
          "editor-content": true,
        })}
      >
        <EditorProvider
          immediatelyRender={false}
          onUpdate={({ editor }) => {
            if (onUpdate) {
              onUpdate(editor);
            }
          }}
          slotAfter={<FormikTextEditorMenu info={info} />}
          extensions={[placeholder, ...simpleEditorExtensions, mentions]}
          content={initialContent}
          onFocus={onFocus || (() => {})}
          onBlur={onBlur || (() => {})}
          editorProps={editorProps || {}}
        />
      </Wrapper>
    </ProseMirror>
  );
};

export { useDebouncedCallback };
export type { Editor };
