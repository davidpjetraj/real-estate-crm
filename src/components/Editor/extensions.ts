import Bold from "@tiptap/extension-bold";
import BulletList from "@tiptap/extension-bullet-list";
import Code from "@tiptap/extension-code";
import CodeBlock from "@tiptap/extension-code-block";
import Document from "@tiptap/extension-document";
import HardBreak from "@tiptap/extension-hard-break";
import Heading from "@tiptap/extension-heading";
import History from "@tiptap/extension-history";
import Image from "@tiptap/extension-image";
import Italic from "@tiptap/extension-italic";
import Link from "@tiptap/extension-link";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Paragraph from "@tiptap/extension-paragraph";
import Strike from "@tiptap/extension-strike";
import Text from "@tiptap/extension-text";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import GlobalDragHandle from "tiptap-extension-global-drag-handle";
import Blockquote from "@tiptap/extension-blockquote";
import { NoteItem } from "./Nodes/NoteItem/node";
import { Youtube as OriginalYoutube } from "@tiptap/extension-youtube";
import { Vimeo } from "./Nodes/Vimeo/node";
import Color from "@tiptap/extension-color";
import { Columns } from "./Nodes/Columns/columns";
import { Column } from "./Nodes/Columns/column";
import { Markdown } from "tiptap-markdown";
import MentionNode from "./mention-node";

const hardBreak = HardBreak.configure({
  HTMLAttributes: {},
});

const listItem = ListItem.configure({
  HTMLAttributes: {},
});

const orderList = OrderedList.configure({
  HTMLAttributes: {},
});

const bulletList = BulletList.configure({
  HTMLAttributes: {},
});

const codeBlock = CodeBlock.configure({
  languageClassPrefix: "language-",
});

const bold = Bold.configure({
  HTMLAttributes: { class: "bold" },
});

const code = Code.configure({
  HTMLAttributes: {},
});

const italic = Italic.configure({
  HTMLAttributes: {},
});

const strike = Strike.configure({
  HTMLAttributes: {},
});

const underline = Underline.configure({
  HTMLAttributes: {},
});

const image = Image.configure({});

const link = Link.configure({
  HTMLAttributes: {
    target: "_blank",
    rel: "noopener noreferrer",
  },
  openOnClick: true,
  defaultProtocol: "https://",
  autolink: true,
});

const heading = Heading.configure({
  levels: [1, 2, 3],
});

const textAlign = TextAlign.configure({
  types: ["heading", "paragraph"],
});

const history = History.configure({});

const darg = GlobalDragHandle.configure({
  dragHandleWidth: 20, // default

  // The scrollTreshold specifies how close the user must drag an element to the edge of the lower/upper screen for automatic
  // scrolling to take place. For example, scrollTreshold = 100 means that scrolling starts automatically when the user drags an
  // element to a position that is max. 99px away from the edge of the screen
  // You can set this to 0 to prevent auto scrolling caused by this extension
  scrollTreshold: 100, // default

  // The css selector to query for the drag handle. (eg: '.custom-handle').
  // If handle element is found, that element will be used as drag handle.
  // If not, a default handle will be created
  dragHandleSelector: ".custom-drag-handle", // default is undefined

  // Tags to be excluded for drag handle
  // If you want to hide the global drag handle for specific HTML tags, you can use this option.
  // For example, setting this option to ['p', 'hr'] will hide the global drag handle for <p> and <hr> tags.
  excludedTags: [], // default

  // Custom nodes to be included for drag handle
  // For example having a custom Alert component. Add data-type="alert" to the node component wrapper.
  // Then add it to this list as ['alert']
  //
  customNodes: [],
});

const blockQuote = Blockquote.configure({
  HTMLAttributes: {
    class: "block-quote",
  },
});

const noteItem = NoteItem.configure({
  HTMLAttributes: {},
});

const extendedYoutube = OriginalYoutube.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      inline: false,
      atom: true,
      draggable: true,
    };
  },
});

const vimeo = Vimeo.configure({
  HTMLAttributes: {},
});

const color = Color.configure({});

const textStyle = TextStyle.configure({});

const columns = Columns.configure({});
const column = Column.configure({});

const markdownExtension = Markdown.configure({
  html: false,
  transformCopiedText: true,
});

export const editorExtensions = [
  history,
  Document,
  Paragraph,
  Text,
  hardBreak,
  listItem,
  orderList,
  bulletList,
  codeBlock,
  bold,
  italic,
  strike,
  code,
  underline,
  link,
  image,
  heading,
  textAlign,
  darg,
  blockQuote,
  noteItem,
  extendedYoutube,
  vimeo,
  color,
  textStyle,
  columns,
  column,
  markdownExtension,
];

export const simpleEditorExtensions = [
  history,
  Document,
  Paragraph,
  Text,
  hardBreak,
  listItem,
  orderList,
  bulletList,
  codeBlock,
  bold,
  italic,
  strike,
  code,
  underline,
  link,
  MentionNode,
];
