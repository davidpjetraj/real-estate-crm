import React, { useState } from "react";
import { NodeViewWrapper } from "@tiptap/react";
import { Button, TextField, styled } from "@mui/material";
import { Dialog } from "@/components/Dialog";

const NodeWrapper = styled(NodeViewWrapper)`
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  border: 1px solid transparent;
  cursor: pointer;
  margin-bottom: 12px;

  .content {
    flex: 1;
    padding: 12px;
    background: ${({ theme }) => theme.palette.background.paper};
    border-radius: 12px;
    border: 2px solid ${({ theme }) => theme.palette.divider};

    &:hover {
      border-color: ${({ theme }) => theme.palette.primary.main};
      box-shadow: ${({ theme }) => theme.shadows[3]};
    }
  }
`;

const Title = styled("div")`
  font-size: 16px;
  font-weight: bold;
  color: ${({ theme }) => theme.palette.text.primary};
  margin-bottom: 4px;
`;

const Description = styled("div")`
  font-size: 14px;
  color: ${({ theme }) => theme.palette.text.secondary};
  line-height: 1.5;
`;

const CardItemComponent = ({ node, updateAttributes }: any) => {
  const { title, description } = node.attrs;

  const [localTitle, setLocalTitle] = useState(title);
  const [localDescription, setLocalDescription] = useState(description);
  const [open, setOpen] = useState(false);

  const handleModalEdit = () => {
    updateAttributes({ title: localTitle, description: localDescription });
    setOpen(false);
  };

  return (
    <NodeWrapper
      onClick={(e: any) => {
        const wrapperParent = e.currentTarget.parentElement;
        const isSelected = wrapperParent?.classList.contains(
          "ProseMirror-selectednode"
        );

        if (isSelected && !open) {
          setOpen(true);
        }
      }}
    >
      <div className="content">
        <Title>{title}</Title>
        <Description>{description}</Description>
      </div>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <Dialog.Title title="Update note" onClose={() => setOpen(false)} />
        <Dialog.Content>
          <TextField
            label="Title"
            value={localTitle}
            onChange={(e) => setLocalTitle(e.target.value)}
            fullWidth
            margin="normal"
            variant="filled"
          />
          <TextField
            label="Description"
            value={localDescription}
            onChange={(e) => setLocalDescription(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            rows={4}
            variant="filled"
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button variant="outlined" fullWidth onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleModalEdit} fullWidth variant="contained">
            Update
          </Button>
        </Dialog.Actions>
      </Dialog>
    </NodeWrapper>
  );
};

export default CardItemComponent;
