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
import { useStateOperations, stateColumns } from "../../../../store/useState";
import { CreateStateDialog, EditStateDialog } from "@/components/Dialog";
import { StateModel } from "@/lib/graphql/generated/graphql";

export default function StatePage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedState, setSelectedState] = useState<StateModel | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuState, setMenuState] = useState<StateModel | null>(null);

  const { error, refetchStates, deleteState, deleteLoading } =
    useStateOperations();

  useEffect(() => {
    refetchStates();
  }, [refetchStates]);

  // Action handlers
  const handleAddState = () => {
    setIsCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedState(null);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedState(null);
  };

  // Menu handlers
  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    state: StateModel
  ) => {
    setAnchorEl(event.currentTarget);
    setMenuState(state);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuState(null);
  };

  const handleEditClick = () => {
    if (menuState) {
      setSelectedState(menuState);
      setIsEditDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    if (menuState) {
      setSelectedState(menuState);
      setIsDeleteDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    if (selectedState) {
      try {
        await deleteState({ id: selectedState.id });
        handleCloseDeleteDialog();
      } catch (error) {
        console.error("Failed to delete state:", error);
      }
    }
  };

  // Success handlers
  const handleCreateSuccess = (newState: any) => {
    // The state will be automatically added via the mutation's onCompleted callback
    console.log("State created successfully:", newState);
  };

  const handleUpdateSuccess = (updatedState: any) => {
    // The state will be automatically updated via the mutation's onCompleted callback
    console.log("State updated successfully:", updatedState);
  };

  // Enhanced columns with actions
  const enhancedColumns = [
    ...stateColumns,
    {
      accessorKey: "actions",
      label: "Actions",
      accessorFn: (row: StateModel) => row,
      size: 120,
      cell: ({ row }: { row: { original: StateModel } }) => (
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <IconButton
            size="small"
            onClick={() => {
              setSelectedState(row.original);
              setIsEditDialogOpen(true);
            }}
            sx={{
              color: "primary.main",
              "&:hover": { backgroundColor: "primary.light", color: "white" },
            }}
            title="Edit State"
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
      <PageLayout title="States" showProfile={true}>
        <div style={{ padding: "20px", textAlign: "center" }}>
          <p>Error loading states: {error.message}</p>
          <Button variant="contained" onClick={() => refetchStates()}>
            Retry
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="States" showProfile={true}>
      <Table
        columns={enhancedColumns}
        store={useStateOperations}
        rightActions={
          <Button
            variant="contained"
            size="medium"
            startIcon={<PlusIcon width={16} height={16} />}
            onClick={handleAddState}
          >
            Add State
          </Button>
        }
      />

      {/* Action Menu */}
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

      {/* Create State Dialog */}
      <CreateStateDialog
        open={isCreateDialogOpen}
        onClose={handleCloseCreateDialog}
        onSuccess={handleCreateSuccess}
      />

      {/* Edit State Dialog */}
      <EditStateDialog
        open={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        onSuccess={handleUpdateSuccess}
        state={selectedState}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Delete State</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete the state &ldquo;
            {selectedState?.name}&rdquo;? This action cannot be undone and may
            affect related data.
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
