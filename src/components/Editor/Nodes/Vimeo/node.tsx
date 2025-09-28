import {
  Node,
  RawCommands,
  mergeAttributes,
  nodeInputRule,
} from '@tiptap/core';

export interface VimeoOptions {
  inline: boolean;
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    setVimeoVideo: (options: {
      src: string;
      width?: number;
      height?: number;
    }) => ReturnType;
  }
}

export const Vimeo = Node.create<VimeoOptions>({
  name: 'vimeo',

  group: 'block',

  selectable: true,

  inline() {
    return this.options.inline;
  },

  addOptions() {
    return {
      ...this.parent?.(),
      inline: false,
      atom: true,
      draggable: true,
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      src: {},
      width: {
        default: 640,
        parseHTML: element =>
          Number((element as HTMLElement).getAttribute('width')) || 640,
      },
      height: {
        default: 360,
        parseHTML: element =>
          Number((element as HTMLElement).getAttribute('height')) || 360,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'iframe[src*="vimeo.com"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'iframe',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
    ];
  },

  addCommands() {
    return {
      setVimeoVideo:
        (options: { src: string; width?: number; height?: number }) =>
        ({ commands }: { commands: any }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    } as Partial<RawCommands>;
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: /^https?:\/\/(?:www\.)?vimeo\.com\/(\d+)(?:\/.*)?$/,
        type: this.type,
        getAttributes: match => {
          const id = match[1];
          return { src: `https://player.vimeo.com/video/${id}` };
        },
      }),
    ];
  },
});
