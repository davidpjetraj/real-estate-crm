"use client";

import { useState } from "react";
import {
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { MoreIcon } from "@/components/icons/MoreIcon";
import { PencilEditIcon } from "@/components/icons/PencilEditIcon";
import { ErrorColorDeleteIcon } from "@/components/icons/ErrorColorDeleteIcon";
import { CustomPopover, usePopover } from "@/components/shared/popover";
import { PropertyModel } from "@/lib/graphql/generated/graphql";
import { useRouter } from "next/navigation";

interface ActionsProps {
  property: PropertyModel;
}

export function Actions({ property }: ActionsProps) {
  const popover = usePopover();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const router = useRouter();

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
    // TODO: Implement delete functionality
    console.log("Delete property:", property);
    handleClose();
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
        <MenuItem onClick={handleEdit} sx={{ minWidth: 160 }}>
          <ListItemIcon>
            <PencilEditIcon width={20} height={20} />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>

        <MenuItem
          onClick={handleDelete}
          sx={{
            minWidth: 160,
            color: "error.main",
            "&:hover": {
              backgroundColor: "error.lighter",
            },
          }}
        >
          <ListItemIcon sx={{ color: "inherit" }}>
            <ErrorColorDeleteIcon width={20} height={20} />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </CustomPopover>
    </>
  );
}
