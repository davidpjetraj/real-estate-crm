"use client";

import React, { useEffect, useState } from "react";
import PageLayout from "@/components/Layout/PageLayout";
import { Table } from "@/components/Table";
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
} from "@mui/material";
import { PlusIcon } from "@/components/icons/PlusIcon";
import { MoreIcon } from "@/components/icons/MoreIcon";
import { PencilEditIcon } from "@/components/icons/PencilEditIcon";
import { ErrorColorDeleteIcon } from "@/components/icons/ErrorColorDeleteIcon";
import {
  useRastiLigjorOperations,
  rastiLigjorColumns,
} from "../../../store/useRastiLigjor";
import {
  CreateRastiLigjorDialog,
  EditRastiLigjorDialog,
} from "@/components/Dialog";
import { RastiLigjorModel } from "@/lib/graphql/generated/graphql";

export default function RastiLigjorPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRastiLigjor, setSelectedRastiLigjor] =
    useState<RastiLigjorModel | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuRastiLigjor, setMenuRastiLigjor] =
    useState<RastiLigjorModel | null>(null);

  const { error, refetchRastetLigjore, deleteRastiLigjor, deleteLoading } =
    useRastiLigjorOperations();

  useEffect(() => {
    refetchRastetLigjore();
  }, [refetchRastetLigjore]);

  const handleAddRastiLigjor = () => {
    setIsCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedRastiLigjor(null);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedRastiLigjor(null);
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    rastiLigjor: RastiLigjorModel
  ) => {
    setAnchorEl(event.currentTarget);
    setMenuRastiLigjor(rastiLigjor);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuRastiLigjor(null);
  };

  const handleEditClick = () => {
    if (menuRastiLigjor) {
      setSelectedRastiLigjor(menuRastiLigjor);
      setIsEditDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    if (menuRastiLigjor) {
      setSelectedRastiLigjor(menuRastiLigjor);
      setIsDeleteDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    if (selectedRastiLigjor) {
      try {
        await deleteRastiLigjor({
          id: selectedRastiLigjor.id,
          emri: selectedRastiLigjor.emri,
          lloji_rastit: selectedRastiLigjor.lloji_rastit,
        });
        handleCloseDeleteDialog();
      } catch (error) {
        console.error("Failed to delete rasti ligjor:", error);
      }
    }
  };

  const handleCreateSuccess = (newRastiLigjor: RastiLigjorModel) => {
    console.log("Rasti Ligjor created successfully:", newRastiLigjor);
  };

  const handleUpdateSuccess = (updatedRastiLigjor: RastiLigjorModel) => {
    console.log("Rasti Ligjor updated successfully:", updatedRastiLigjor);
  };

  const enhancedColumns = [
    ...rastiLigjorColumns,
    {
      accessorKey: "actions",
      label: "Actions",
      accessorFn: (row: RastiLigjorModel) => row,
      size: 120,
      cell: ({ row }: { row: { original: RastiLigjorModel } }) => (
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <IconButton
            size="small"
            onClick={() => {
              setSelectedRastiLigjor(row.original);
              setIsEditDialogOpen(true);
            }}
            sx={{
              color: "primary.main",
              "&:hover": { backgroundColor: "primary.light", color: "white" },
            }}
            title="Edit Rasti Ligjor"
          >
            <PencilEditIcon width={14} height={14} />
          </IconButton>
          <IconButton
            size="small"
            onClick={(event) => handleMenuClick(event, row.original)}
            sx={{
              color: "text.secondary",
              "&:hover": { backgroundColor: "grey.100" },
            }}
            title="More actions"
          >
            <MoreIcon width={14} height={14} />
          </IconButton>
        </Box>
      ),
    },
  ];

  if (error) {
    return (
      <PageLayout title="Rastet Ligjore" showProfile={true}>
        <div style={{ padding: "20px", textAlign: "center" }}>
          <p>Error loading rastet ligjore: {error.message}</p>
          <Button variant="contained" onClick={() => refetchRastetLigjore()}>
            Retry
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Rastet Ligjore" showProfile={true}>
      <Table
        columns={enhancedColumns}
        store={useRastiLigjorOperations}
        rightActions={
          <Button
            variant="contained"
            size="medium"
            startIcon={<PlusIcon width={16} height={16} />}
            onClick={handleAddRastiLigjor}
          >
            Krijo Rast Ligjor
          </Button>
        }
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleEditClick}>
          <PencilEditIcon width={16} height={16} style={{ marginRight: 8 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: "error.main" }}>
          <ErrorColorDeleteIcon
            width={16}
            height={16}
            style={{ marginRight: 8 }}
          />
          Delete
        </MenuItem>
      </Menu>

      <CreateRastiLigjorDialog
        open={isCreateDialogOpen}
        onClose={handleCloseCreateDialog}
        onSuccess={handleCreateSuccess}
      />

      <EditRastiLigjorDialog
        open={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        onSuccess={handleUpdateSuccess}
        rastiLigjor={selectedRastiLigjor}
      />

      <Dialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Fshije Rastin Ligjor</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete &ldquo;{selectedRastiLigjor?.emri}
            &rdquo;? This action cannot be undone and may affect related data.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleteLoading}
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </PageLayout>
  );
}
