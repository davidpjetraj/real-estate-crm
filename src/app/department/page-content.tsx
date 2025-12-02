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
import { useDepartmentOperations, departmentColumns } from "../../../store/useDepartment";
import { CreateDepartmentDialog, EditDepartmentDialog } from "@/components/Dialog";
import { DepartmentModel } from "@/lib/graphql/generated/graphql";

export default function DepartmentPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentModel | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuDepartment, setMenuDepartment] = useState<DepartmentModel | null>(null);

  const {
    error,
    refetchDepartments,
    updateLoading,
  } = useDepartmentOperations();

  useEffect(() => {
    refetchDepartments();
  }, [refetchDepartments]);

  // Action handlers
  const handleAddDepartment = () => {
    setIsCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedDepartment(null);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedDepartment(null);
  };

  // Menu handlers
  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    department: DepartmentModel
  ) => {
    setAnchorEl(event.currentTarget);
    setMenuDepartment(department);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuDepartment(null);
  };

  const handleEditClick = () => {
    if (menuDepartment) {
      setSelectedDepartment(menuDepartment);
      setIsEditDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    if (menuDepartment) {
      setSelectedDepartment(menuDepartment);
      setIsDeleteDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    if (selectedDepartment) {
      try {
        // Note: Delete functionality would need to be implemented in the backend
        // For now, we'll just close the dialog
        console.log("Delete department:", selectedDepartment.id);
        handleCloseDeleteDialog();
        refetchDepartments();
      } catch (error) {
        console.error("Failed to delete department:", error);
      }
    }
  };

  // Success handlers
  const handleCreateSuccess = (newDepartment: any) => {
    console.log("Department created successfully:", newDepartment);
  };

  const handleUpdateSuccess = (updatedDepartment: any) => {
    console.log("Department updated successfully:", updatedDepartment);
  };

  // Enhanced columns with actions
  const enhancedColumns = [
    ...departmentColumns,
    {
      accessorKey: "actions",
      label: "Actions",
      accessorFn: (row: DepartmentModel) => row,
      size: 120,
      cell: ({ row }: { row: { original: DepartmentModel } }) => (
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <IconButton
            size="small"
            onClick={() => {
              setSelectedDepartment(row.original);
              setIsEditDialogOpen(true);
            }}
            sx={{
              color: "primary.main",
              "&:hover": { backgroundColor: "primary.light", color: "white" },
            }}
            title="Edit Department"
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
      <PageLayout title="Departments" showProfile={true}>
        <div style={{ padding: "20px", textAlign: "center" }}>
          <p>Error loading departments: {error.message}</p>
          <Button variant="contained" onClick={() => refetchDepartments()}>
            Retry
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Departments" showProfile={true}>
      <Table
        columns={enhancedColumns}
        store={useDepartmentOperations}
        rightActions={
          <Button
            variant="contained"
            size="medium"
            startIcon={<PlusIcon width={16} height={16} />}
            onClick={handleAddDepartment}
          >
            Add Department
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

      {/* Create Department Dialog */}
      <CreateDepartmentDialog
        open={isCreateDialogOpen}
        onClose={handleCloseCreateDialog}
        onSuccess={handleCreateSuccess}
      />

      {/* Edit Department Dialog */}
      <EditDepartmentDialog
        open={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        onSuccess={handleUpdateSuccess}
        department={selectedDepartment}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Delete Department</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete the department &ldquo;{selectedDepartment?.emri_departmentit}
            &rdquo;? This action cannot be undone and may affect related data.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} disabled={updateLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={updateLoading}
          >
            {updateLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </PageLayout>
  );
}

