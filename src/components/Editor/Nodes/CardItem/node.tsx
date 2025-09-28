import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import CardItemComponent from "./component";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    cardItem: {
      addCardItem: (attrs: {
        title: string;
        description: string;
      }) => ReturnType;
    };
  }
}

export const CardItem = Node.create({
  name: "cardItem",
  group: "block",
  selectable: true,
  draggable: false,
  isolating: false,

  addAttributes() {
    return {
      title: { default: "" },
      description: { default: "" },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="card-item"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "card-item",
        class: "card-item",
      }),
      [
        "div",
        {
          class: "card-item-title",
        },
        HTMLAttributes.title,
      ],
      [
        "div",
        {
          class: "card-item-description",
        },
        HTMLAttributes.description,
      ],
    ];
  },

  addCommands() {
    return {
      addCardItem:
        (attrs: { title: string; description: string }) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs,
          });
        },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(CardItemComponent);
  },
});
