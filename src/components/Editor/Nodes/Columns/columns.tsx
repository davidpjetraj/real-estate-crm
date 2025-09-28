import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import ColumnsComponent from './ColumnsComponent';

export const Columns = Node.create({
  name: 'columns',
  group: 'block',
  // We'll require exactly 2 columns. If you want variable columns, use 'column+'
  content: 'column column',

  parseHTML() {
    return [{ tag: 'div[data-type="columns"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'columns',
        class: 'columns',
      }),
      0,
    ];
  },

  addNodeView() {
    // Link the columns node to our ColumnsComponent
    return ReactNodeViewRenderer(ColumnsComponent);
  },
});
