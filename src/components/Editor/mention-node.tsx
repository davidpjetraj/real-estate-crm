import { Node, mergeAttributes } from "@tiptap/core";
import { getUri } from "../utils/getUri";

const MentionNode = Node.create({
  name: "mention",

  inline: true,

  group: "inline",

  addAttributes() {
    return {
      id: { default: null },
      label: { default: null },
      avatar: { default: null },
    };
  },

  renderHTML({ HTMLAttributes }) {
    const { label, avatar } = HTMLAttributes;

    const avatarNode = avatar
      ? [
          "img",
          {
            src: getUri(avatar as string),
            alt: label,
            class: "mention-avatar",
          },
        ]
      : [
          "span",
          {
            class: "mention-avatar",
          },
          label ? label.charAt(0) : "A",
        ];

    return [
      "span",
      mergeAttributes({ class: "mention" }, HTMLAttributes),
      [
        "span",
        { class: "mention-content" },
        avatarNode,
        ["span", { class: "mention-label" }, label],
      ],
    ];
  },

  parseHTML() {
    return [
      {
        tag: "span.mention",
        getAttrs: (node) => {
          const element = node as HTMLElement;
          return {
            id: element.getAttribute("data-id"),
            label: element.getAttribute("data-label"),
            avatar: element.getAttribute("data-avatar"),
          };
        },
      },
    ];
  },
});

export default MentionNode;
