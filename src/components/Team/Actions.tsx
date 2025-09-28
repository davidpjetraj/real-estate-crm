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
import { EyeOpenIcon } from "@/components/icons/EyeOpen";
import { CustomPopover, usePopover } from "@/components/shared/popover";
import { TeamModel } from "@/lib/graphql/generated/graphql";
import { EditTeamMemberDialog } from "@/components/Dialog";
import TeamDetailsModal from "./TeamDetailsModal";
import { useTeam } from "../../../store/useTeam";

interface ActionsProps {
  teamMember: TeamModel;
}

export function Actions({ teamMember }: ActionsProps) {
  const popover = usePopover();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const updateItem = useTeam((state) => state.updateItem);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    popover.onOpen();
  };

  const handleClose = () => {
    setAnchorEl(null);
    popover.onClose();
  };

  const handleViewDetails = () => {
    setIsDetailsModalOpen(true);
    handleClose();
  };

  const handleEdit = () => {
    setIsEditDialogOpen(true);
    handleClose();
  };

  const handleDelete = () => {
    // TODO: Implement delete functionality
    console.log("Delete team member:", teamMember);
    handleClose();
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
  };

  const handleEditSuccess = (updatedTeamMember: TeamModel) => {
    updateItem(updatedTeamMember);
    setIsEditDialogOpen(false);
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
        <MenuItem onClick={handleViewDetails} sx={{ minWidth: 160 }}>
          <ListItemIcon>
            <EyeOpenIcon width={20} height={20} />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>

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

      <EditTeamMemberDialog
        open={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        onSuccess={handleEditSuccess}
        teamMember={teamMember}
      />

      <TeamDetailsModal
        open={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        teamMemberId={teamMember.id}
      />
    </>
  );
}
