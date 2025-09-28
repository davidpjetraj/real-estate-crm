"use client";
import { useDebouncedCallback } from "use-debounce";
import { alpha, styled } from "@mui/material";
import classNames from "classnames";
import { EditorProvider } from "@tiptap/react";
import { Editor } from "@tiptap/core";
import Placeholder from "@tiptap/extension-placeholder";
import EditorMenu from "./Menu";
import { editorExtensions } from "./extensions";

const ProseMirror = styled("div")`
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
    outline: 2px solid ${({ theme }) => theme.palette.primary.main};
    outline-offset: 2px;
  }

  /* Custom Youtube Video CSS */
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
`;

const Wrapper = styled("div")`
  position: relative;
  width: 100%;
  outline: none;

  .ProseMirror {
    padding: 12px 0px;
  }

  &.editor-default {
  }

  .editor-bubble {
    background-color: #fff;
    border: 1px solid ${({ theme }) => theme.palette.divider};
    box-shadow: none;
    max-width: 900px !important;
    width: 100%;
    display: flex;
    align-items: center;
    width: fit-content;
    border-radius: ${({ theme }) => theme.shape.borderRadius}px;
    overflow: hidden;
  }

  .command-menu-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
    padding: 8px;
    .command-input {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      input {
        width: 100%;
        height: 30px;
        border: none;
        padding: 0;
        font-size: 14px;
        &:focus {
          outline: none;
        }
      }
      .icon {
        width: 40px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${({ theme }) => theme.palette.primary.main};
        svg {
          width: 20px;
          height: 20px;
        }
      }
    }
    .submit-button {
      width: 30px;
      height: 30px;
      background-color: ${({ theme }) => theme.palette.primary.main};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      min-width: 30px;
      border: none;
      cursor: pointer;
      &:hover {
        background-color: ${({ theme }) => theme.palette.primary.dark};
      }

      svg {
        width: 16px;
        height: 16px;
      }
    }
  }
  .command-group {
    padding: 8px;
    border-bottom: 1px solid ${({ theme }) => theme.palette.divider};

    > div:first-child {
      margin-left: 8px;
      margin-bottom: 8px;
      color: ${({ theme }) => theme.palette.text.secondary};
      font-size: 14px;
    }
  }
  .command-list {
    padding: 8px;
  }

  .command-item {
    display: flex;
    align-items: center;
    padding: 8px;
    cursor: pointer;
    border-radius: ${({ theme }) => theme.shape.borderRadius}px;
    gap: 10px;
    font-size: 14px;

    svg {
      width: 20px;
      height: 20px;
      color: ${({ theme }) => theme.palette.primary.main};
    }

    &:hover {
      background-color: ${({ theme }) => theme.palette.action.hover};
    }
  }

  .markdown-wrapper {
    padding: 8px;
    border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
    * {
      font-size: 14px;
    }
  }

  .ai-loading {
    display: flex;
    align-items: center;
    padding: 8px;
    gap: 15px;

    .title {
      font-size: 14px;
      color: ${({ theme }) => theme.palette.text.secondary};
    }

    .spinner {
      display: flex;
      align-items: center;
      justify-content: center;

      svg {
        width: 20px;
        height: 20px;
        color: ${({ theme }) => theme.palette.primary.main};
      }
    }
  }

  .color-picker-button {
    gap: 10px;
    .title {
      border: 1px solid ${({ theme }) => theme.palette.divider};
      width: 25px;
      height: 25px;
      border-radius: 4px;
      min-width: 25px;
    }

    svg {
      width: 20px;
      height: 20px;
    }
  }

  .command-wrapper {
    border: 1px solid ${({ theme }) => theme.palette.divider};
    box-shadow: none;
    width: 400px;
    border-radius: ${({ theme }) => theme.shape.borderRadius}px;
  }

  .benefit-card {
    display: flex;
    gap: 10px;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 12px;
    margin: 10px 0;
    background: #f9f9f9;
  }
  .benefit-card .icon {
    font-size: 24px;
  }
  .benefit-card .content strong {
    display: block;
    font-size: 16px;
  }
  .benefit-card .content p {
    margin: 0;
    font-size: 14px;
  }

  .drag-handle {
    position: fixed;
    opacity: 1;
    transition: opacity ease-in 0.2s;
    border-radius: 0.25rem;

    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10' style='fill: rgba(0, 0, 0, 0.5)'%3E%3Cpath d='M3,2 C2.44771525,2 2,1.55228475 2,1 C2,0.44771525 2.44771525,0 3,0 C3.55228475,0 4,0.44771525 4,1 C4,1.55228475 3.55228475,2 3,2 Z M3,6 C2.44771525,6 2,5.55228475 2,5 C2,4.44771525 2.44771525,4 3,4 C3.55228475,4 4,4.44771525 4,5 C4,5.55228475 3.55228475,6 3,6 Z M3,10 C2.44771525,10 2,9.55228475 2,9 C2,8.44771525 2.44771525,8 3,8 C3.55228475,8 4,8.44771525 4,9 C4,9.55228475 3.55228475,10 3,10 Z M7,2 C6.44771525,2 6,1.55228475 6,1 C6,0.44771525 6.44771525,0 7,0 C7.55228475,0 8,0.44771525 8,1 C8,1.55228475 7.55228475,2 7,2 Z M7,6 C6.44771525,6 6,5.55228475 6,5 C6,4.44771525 6.44771525,4 7,4 C7.55228475,4 8,4.44771525 8,5 C8,5.55228475 7.55228475,6 7,6 Z M7,10 C6.44771525,10 6,9.55228475 6,9 C6,8.44771525 6.44771525,8 7,8 C7.55228475,8 8,8.44771525 8,9 C8,9.55228475 7.55228475,10 7,10 Z'%3E%3C/path%3E%3C/svg%3E");
    background-size: calc(0.5em + 0.375rem) calc(0.5em + 0.375rem);
    background-repeat: no-repeat;
    background-position: center;
    width: 1.2rem;
    height: 1.5rem;
    z-index: 50;
    cursor: grab;

    &:hover {
      background-color: var(--novel-stone-100);
      transition: background-color 0.2s;
    }

    &:active {
      background-color: var(--novel-stone-200);
      transition: background-color 0.2s;
      cursor: grabbing;
    }

    &.hide {
      opacity: 0;
      pointer-events: none;
    }

    @media screen and (max-width: 600px) {
      display: none;
      pointer-events: none;
    }
  }

  .dark .drag-handle {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10' style='fill: rgba(255, 255, 255, 0.5)'%3E%3Cpath d='M3,2 C2.44771525,2 2,1.55228475 2,1 C2,0.44771525 2.44771525,0 3,0 C3.55228475,0 4,0.44771525 4,1 C4,1.55228475 3.55228475,2 3,2 Z M3,6 C2.44771525,6 2,5.55228475 2,5 C2,4.44771525 2.44771525,4 3,4 C3.55228475,4 4,4.44771525 4,5 C4,5.55228475 3.55228475,6 3,6 Z M3,10 C2.44771525,10 2,9.55228475 2,9 C2,8.44771525 2.44771525,8 3,8 C3.55228475,8 4,8.44771525 4,9 C4,9.55228475 3.55228475,10 3,10 Z M7,2 C6.44771525,2 6,1.55228475 6,1 C6,0.44771525 6.44771525,0 7,0 C7.55228475,0 8,0.44771525 8,1 C8,1.55228475 7.55228475,2 7,2 Z M7,6 C6.44771525,6 6,5.55228475 6,5 C6,4.44771525 6.44771525,4 7,4 C7.55228475,4 8,4.44771525 8,5 C8,5.55228475 7.55228475,6 7,6 Z M7,10 C6.44771525,10 6,9.55228475 6,9 C6,8.44771525 6.44771525,8 7,8 C7.55228475,8 8,8.44771525 8,9 C8,9.55228475 7.55228475,10 7,10 Z'%3E%3C/path%3E%3C/svg%3E");
  }

  .ProseMirror .column-block {
    width: 100%;
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
    gap: 24px;
    padding: 8px 8px;
  }

  .ProseMirror .column {
    overflow: auto;
    border: 1px gray dashed;
    border-radius: 8px;
    padding: 8px;
    margin: -8px;
  }

  .block-quote {
    position: relative;
    margin: 0;
    padding-left: 15px;
    font-size: 18px;

    * {
      font-weight: 600;
    }
    &:before {
      content: "";
      position: absolute;
      left: 3px;
      top: 0;
      width: 2px;
      height: 100%;
      background-color: ${({ theme }) => theme.palette.primary.main};
    }
  }

  .editor-content-wrapper {
    max-width: 900px;
    margin: 0 auto;
  }

  .multiple-items-content {
    width: 100%;

    > div {
      width: 100%;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
  }
`;

export const AdvancedEditor = ({
  initialContent,
  onUpdate,
  description,
}: {
  initialContent: any | undefined;
  onUpdate: (editor: Editor) => any;
  description?: string;
}) => {
  const placeholder = Placeholder.configure({
    placeholder: () => {
      return description ? description : "Shkruani përshkrimin këtu...";
    },
  });

  return (
    <ProseMirror>
      <Wrapper
        className={classNames({
          "editor-content": true,
        })}
      >
        <EditorProvider
          immediatelyRender={false}
          onUpdate={({ editor }) => {
            onUpdate(editor);
          }}
          editorContainerProps={{
            className: "editor-content-wrapper",
          }}
          slotBefore={<EditorMenu />}
          extensions={[...editorExtensions, placeholder]}
          content={initialContent}
        />
      </Wrapper>
    </ProseMirror>
  );
};

export { useDebouncedCallback };
export type { Editor };
