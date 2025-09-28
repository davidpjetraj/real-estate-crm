import React, { useState } from "react";
import { NodeViewWrapper } from "@tiptap/react";
import {
  alpha,
  Button,
  TextField,
  styled,
  MenuItem,
  darken,
} from "@mui/material";
import { Dialog } from "@/components/Dialog";
import classNames from "classnames";

const NodeWrapper = styled(NodeViewWrapper)`
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
  border: 1px solid transparent;
  border-radius: 12px;
  cursor: pointer;

  .content {
    flex: 1;
    padding: 12px;
    background: ${({ theme }) => alpha(theme.palette.background.paper, 0.9)};
    border-radius: 12px;
    box-shadow: ${({ theme }) => theme.shadows[1]};
    border: 1px solid ${({ theme }) => theme.palette.divider};

    .title {
      font-size: 14px;
      font-weight: bold;
      color: ${({ theme }) => theme.palette.text.primary};
    }
    .description {
      font-size: 16px;
      color: ${({ theme }) => theme.palette.text.primary};
    }
  }

  &.note-item-warning {
    .content {
      background: ${({ theme }) => alpha(theme.palette.warning.main, 0.1)};
      border: 1px solid ${({ theme }) => theme.palette.warning.main};
      color: ${({ theme }) => theme.palette.warning.main};

      .title {
        color: ${({ theme }) => darken(theme.palette.warning.main, 0.2)};
      }
    }
  }

  &.note-item-error {
    .content {
      background: ${({ theme }) => alpha(theme.palette.error.main, 0.1)};
      border: 1px solid ${({ theme }) => theme.palette.error.main};
      color: ${({ theme }) => theme.palette.error.main};

      .title {
        color: ${({ theme }) => darken(theme.palette.error.main, 0.2)};
      }
    }
  }

  &.note-item-success {
    .content {
      background: ${({ theme }) => alpha(theme.palette.success.main, 0.1)};
      border: 1px solid ${({ theme }) => theme.palette.success.main};
      color: ${({ theme }) => theme.palette.success.main};

      .title {
        color: ${({ theme }) => darken(theme.palette.success.main, 0.2)};
      }
    }
  }

  &.note-item-info {
    .content {
      background: ${({ theme }) => alpha(theme.palette.info.main, 0.1)};
      border: 1px solid ${({ theme }) => theme.palette.info.main};
      color: ${({ theme }) => theme.palette.info.main};

      .title {
        color: ${({ theme }) => darken(theme.palette.info.main, 0.2)};
      }
    }
  }
`;

const NoteItemComponent = ({ node, updateAttributes }: any) => {
  const { title, description, type } = node.attrs;

  const [localTitle, setLocalTitle] = useState(title);
  const [localDescription, setLocalDescription] = useState(description);
  const [localType, setLocalType] = useState(type);
  const [open, setOpen] = useState(false);

  const handleModalEdit = () => {
    updateAttributes({
      title: localTitle,
      description: localDescription,
      type: localType,
    });
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
      className={classNames({
        "ProseMirror-selectednode": node.isSelected,
        "note-item": true,
        [`note-item-${type}`]: true,
      })}
    >
      <div className="content">
        <div className="title">{title}</div>
        <div className="description">{description}</div>
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
            select
            label="Type"
            value={localType}
            onChange={(e) => {
              setLocalType(e.target.value);
            }}
            fullWidth
            margin="normal"
            variant="filled"
          >
            <MenuItem value={"info"}>Info</MenuItem>
            <MenuItem value={"warning"}>Warning</MenuItem>
            <MenuItem value={"error"}>Error</MenuItem>
            <MenuItem value={"success"}>Success</MenuItem>
          </TextField>

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

export default NoteItemComponent;
