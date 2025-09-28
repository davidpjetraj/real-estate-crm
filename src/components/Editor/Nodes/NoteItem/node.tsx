import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import NoteItemComponent from './component';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    noteItem: {
      addNoteItem: (attrs: {
        type: string;
        title: string;
        description: string;
      }) => ReturnType;
    };
  }
}

export const NoteItem = Node.create({
  name: 'noteItem',
  group: 'block',
  selectable: true,
  draggable: false,
  isolating: false,
  addAttributes() {
    return {
      type: { default: 'info' },
      title: { default: '' },
      description: { default: '' },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="note-item"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'note-item',
        class: `note-item note-item-${HTMLAttributes.type}`,
      }),
      [
        'div',
        {
          class: 'note-item-title',
        },
        HTMLAttributes.title,
      ],
      [
        'div',
        {
          class: 'note-item-description',
        },
        HTMLAttributes.description,
      ],
    ];
  },

  addCommands() {
    return {
      addNoteItem:
        attrs =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs,
          });
        },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(NoteItemComponent);
  },
});
