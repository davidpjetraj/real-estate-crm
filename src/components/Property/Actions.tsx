"use client";

import { useState } from "react";
import {
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import { MoreIcon } from "@/components/icons/MoreIcon";
import { PencilEditIcon } from "@/components/icons/PencilEditIcon";
import { ErrorColorDeleteIcon } from "@/components/icons/ErrorColorDeleteIcon";
import { EditorUndoIcon } from "@/components/icons/editor/EditorUndoIcon";
import { CustomPopover, usePopover } from "@/components/shared/popover";
import {
  PropertyModel,
  useRemoveRestorePropertyMutation,
} from "@/lib/graphql/generated/graphql";
import { useRouter } from "next/navigation";
import { useProperty } from "../../../store/useProperties";
import { useConfirm } from "@/components/Confirm";

interface ActionsProps {
  property: PropertyModel;
}

export function Actions({ property }: ActionsProps) {
  const popover = usePopover();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const router = useRouter();
  const removeItem = useProperty((state: any) => state.removeItem);
  const confirm = useConfirm();

  const [removeRestoreProperty, { loading: deleteLoading }] =
    useRemoveRestorePropertyMutation();

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    popover.onOpen();
  };

  const handleClose = () => {
    setAnchorEl(null);
    popover.onClose();
  };

  const handleEdit = () => {
    router.push(`/property/edit/${property.id}`);
    handleClose();
  };

  const handleDelete = () => {
    confirm({
      title: "Delete Property",
      description: `Are you sure you want to delete "${property.title}"? This action cannot be undone.`,
      confirmationText: "Delete",
      cancellationText: "Cancel",
      confirmationButtonProps: {
        color: "error",
        variant: "contained",
      },
      onConfirm: async () => {
        try {
          await removeRestoreProperty({
            variables: {
              input: {
                id: property.id,
                deleted: true,
              },
            },
          });

          removeItem(property.id);
          handleClose();
        } catch (error) {
          console.error("Failed to delete property:", error);
        }
      },
      onCancel: () => {
        handleClose();
      },
    });
  };

  const handleRestore = () => {
    confirm({
      title: "Restore Property",
      description: `Are you sure you want to restore "${property.title}"?`,
      confirmationText: "Restore",
      cancellationText: "Cancel",
      icon: <EditorUndoIcon width={20} height={20} />,
      confirmationButtonProps: {
        color: "primary",
        variant: "contained",
      },
      onConfirm: async () => {
        try {
          await removeRestoreProperty({
            variables: {
              input: {
                id: property.id,
                deleted: false,
              },
            },
          });

          removeItem(property.id);
          handleClose();
        } catch (error) {
          console.error("Failed to restore property:", error);
        }
      },
      onCancel: () => {
        handleClose();
      },
    });
  };

  return (
    <>
      <IconButton
        onClick={handleMenuClick}
        size="small"
        sx={{
          color: "text.secondary",
          "&:hover": {
            color: "text.primary",
          },
        }}
      >
        <MoreIcon width={20} height={20} />
      </IconButton>

      <CustomPopover
        open={popover.open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {!property.deleted && (
          <MenuItem onClick={handleEdit} sx={{ minWidth: 160 }}>
            <ListItemIcon>
              <PencilEditIcon width={20} height={20} />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
        )}

        {property.deleted ? (
          <MenuItem
            onClick={handleRestore}
            disabled={deleteLoading}
            sx={{
              minWidth: 160,
              color: "primary.main",
              "&:hover": {
                backgroundColor: "primary.lighter",
              },
              "&:disabled": {
                opacity: 0.6,
              },
            }}
          >
            <ListItemIcon sx={{ color: "inherit" }}>
              {deleteLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <EditorUndoIcon width={20} height={20} />
              )}
            </ListItemIcon>
            <ListItemText>
              {deleteLoading ? "Restoring..." : "Restore"}
            </ListItemText>
          </MenuItem>
        ) : (
          <MenuItem
            onClick={handleDelete}
            disabled={deleteLoading}
            sx={{
              minWidth: 160,
              color: "error.main",
              "&:hover": {
                backgroundColor: "error.lighter",
              },
              "&:disabled": {
                opacity: 0.6,
              },
            }}
          >
            <ListItemIcon sx={{ color: "inherit" }}>
              {deleteLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <ErrorColorDeleteIcon width={20} height={20} />
              )}
            </ListItemIcon>
            <ListItemText>
              {deleteLoading ? "Deleting..." : "Delete"}
            </ListItemText>
          </MenuItem>
        )}
      </CustomPopover>
    </>
  );
}
