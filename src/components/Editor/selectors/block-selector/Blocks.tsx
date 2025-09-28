import { Button, Grid, styled, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useCurrentEditor } from "@tiptap/react";

import React from "react";
import { Dialog } from "@/components/Dialog";
import YoutubeIcon from "@/components/icons/editor/youtube-stroke-rounded";
import VimeoIcon from "@/components/icons/editor/vimeo-stroke-rounded";
import Note01Icon from "@/components/icons/editor/note-01-stroke-rounded";
import AlignBoxBottomLeftIcon from "@/components/icons/editor/align-box-bottom-left-stroke-rounded";
import TextCheckIcon from "@/components/icons/editor/text-check-stroke-rounded";

const Wrapper = styled("form")`
  display: flex;
  flex-direction: column;
  padding: 0;
  background: ${({ theme }) => theme.palette.background.paper};
  border-radius: ${({ theme }) => theme.shape.borderRadius}px;
  width: 300px;
  max-height: 300px;
  height: 100%;
  overflow-y: auto;
  box-shadow: ${({ theme }) => theme.shadows[4]};
  z-index: 1000;
`;

const BlockButtonWrapper = styled("button")`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: ${({ theme }) => theme.shape.borderRadius}px;
  background-color: ${({ theme }) => theme.palette.background.paper};
  cursor: pointer;
  color: ${({ theme }) => theme.palette.text.primary};
  flex-direction: column;
  aspect-ratio: 1/1;
  border: 1px solid ${({ theme }) => theme.palette.divider};
  gap: 12px;

  .icon {
    width: 30px;
    height: 30px;
    svg {
      width: 30px;
      height: 30px;
    }
  }

  &:hover {
    background-color: ${({ theme }) => theme.palette.action.hover};
  }
`;

function BlockButton({
  title,
  icon,
  onClick = () => {},
}: {
  title: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <BlockButtonWrapper type="button" onClick={onClick}>
      <div className="icon">{icon}</div>
      <div className="title">{title}</div>
    </BlockButtonWrapper>
  );
}

export const BlockItems = ({
  onInsert,
  popover,
}: {
  onInsert: (node: any) => void;
  popover: any;
}) => {
  const { editor } = useCurrentEditor();
  const inputRef = useRef<any>(null);

  const [youtubeModalOpen, setYoutubeModalOpen] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");

  const [vimeoModalOpen, setVimeoModalOpen] = useState(false);
  const [vimeoUrl, setVimeoUrl] = useState("");

  useEffect(() => {
    inputRef.current?.focus();
  });

  if (!editor) return null;

  return (
    <>
      <Wrapper>
        <Grid container spacing={1} padding={1}>
          <Grid size={4}>
            <BlockButton
              icon={<AlignBoxBottomLeftIcon />}
              title="Columns"
              onClick={() => {
                onInsert({
                  type: "columns",
                  attrs: { count: 2 },
                  content: [
                    {
                      type: "column",
                      content: [
                        {
                          type: "paragraph",
                          content: [],
                        },
                      ],
                    },
                    {
                      type: "column",
                      content: [
                        {
                          type: "paragraph",
                          content: [],
                        },
                      ],
                    },
                  ],
                });

                popover.onClose();
              }}
            />
          </Grid>
          <Grid size={4}>
            <BlockButton
              icon={<AlignBoxBottomLeftIcon />}
              title="Card"
              onClick={() => {
                onInsert({
                  type: "cardItem",
                  attrs: {
                    title: "Card Title",
                    description: "Card Description",
                  },
                });
                popover.onClose();
              }}
            />
          </Grid>
          <Grid size={4}>
            <BlockButton
              icon={<TextCheckIcon />}
              title="Card & icon"
              onClick={() => {
                onInsert({
                  type: "cardItemWithIcon",
                  attrs: {
                    icon: "✨",
                    title: "Card Title",
                    description: "Card Description",
                  },
                });
                popover.onClose();
              }}
            />
          </Grid>
          <Grid size={4}>
            <BlockButton
              icon={<Note01Icon />}
              title="Note"
              onClick={() => {
                onInsert({
                  type: "noteItem",
                  attrs: {
                    type: "info",
                    title: "Note Title",
                    description: "Note Description",
                  },
                });
                popover.onClose();
              }}
            />
          </Grid>
          <Grid size={4}>
            <BlockButton
              icon={<YoutubeIcon />}
              title="Youtube"
              onClick={() => {
                setYoutubeModalOpen(true);
                popover.onClose();
              }}
            />
          </Grid>
          <Grid size={4}>
            <BlockButton
              icon={<VimeoIcon />}
              title="Vimeo"
              onClick={() => {
                setVimeoModalOpen(true);
                popover.onClose();
              }}
            />
          </Grid>
        </Grid>
      </Wrapper>

      <Dialog
        open={youtubeModalOpen}
        onClose={() => setYoutubeModalOpen(false)}
        maxWidth="xs"
      >
        <Dialog.Title
          title="Add Youtube Video"
          onClose={() => setYoutubeModalOpen(false)}
        />
        <Dialog.Content>
          <TextField
            label="Youtube URL"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            fullWidth
            margin="normal"
            variant="filled"
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button variant="outlined">Cancel</Button>
          <Button
            variant="contained"
            disabled={!youtubeUrl}
            onClick={() => {
              if (youtubeUrl) {
                onInsert({
                  type: "youtubeVideo",
                  attrs: {
                    src: youtubeUrl,
                    width: 640,
                    height: 360,
                    start: 0,
                  },
                });
              }
              setYoutubeModalOpen(false);
            }}
          >
            Add video
          </Button>
        </Dialog.Actions>
      </Dialog>

      <Dialog
        open={vimeoModalOpen}
        onClose={() => setVimeoModalOpen(false)}
        maxWidth="xs"
      >
        <Dialog.Title
          title="Add Vimeo Video"
          onClose={() => setVimeoModalOpen(false)}
        />
        <Dialog.Content>
          <TextField
            label="Vimeo URL"
            value={vimeoUrl}
            onChange={(e) => setVimeoUrl(e.target.value)}
            fullWidth
            margin="normal"
            variant="filled"
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button variant="outlined">Cancel</Button>
          <Button
            variant="contained"
            disabled={!vimeoUrl}
            onClick={() => {
              if (vimeoUrl) {
                onInsert({
                  type: "vimeoVideo",
                  attrs: {
                    src: vimeoUrl,
                    start: 0,
                  },
                });
              }
              setVimeoModalOpen(false);
            }}
          >
            Add video
          </Button>
        </Dialog.Actions>
      </Dialog>
    </>
  );
};
