import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import ColumnComponent from './ColumnComponent';

export const Column = Node.create({
  name: 'column',
  group: 'block',
  content: 'block+',

  addAttributes() {
    return {
      class: {
        default: 'column',
      },
      'data-type': {
        default: 'column',
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="column"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ColumnComponent);
  },
});
