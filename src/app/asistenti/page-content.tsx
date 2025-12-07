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
  FormControl,
  InputLabel,
  Select,
  Box,
  Chip,
} from "@mui/material";
import { PlusIcon } from "@/components/icons/PlusIcon";
import { MoreIcon } from "@/components/icons/MoreIcon";
import { PencilEditIcon } from "@/components/icons/PencilEditIcon";
import { ErrorColorDeleteIcon } from "@/components/icons/ErrorColorDeleteIcon";
import { FilterIcon } from "@/components/icons/FilterIcon";
import { useAsistentiOperations, asistentiColumns } from "../../../store/useAsistenti";
import { useDepartmentOperations } from "../../../store/useDepartment";
import { CreateAsistentiDialog, EditAsistentiDialog } from "@/components/Dialog";
import { AsistentiModel } from "@/lib/graphql/generated/graphql";

export default function AsistentiPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAsistenti, setSelectedAsistenti] = useState<AsistentiModel | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuAsistenti, setMenuAsistenti] = useState<AsistentiModel | null>(null);
  const [showDepartmentFilter, setShowDepartmentFilter] = useState(false);

  const {
    error,
    refetchAsistentet,
    updateLoading,
    selectedDepartment,
    filterByDepartment,
  } = useAsistentiOperations();

  const { data: departments, refetchDepartments } = useDepartmentOperations();

  useEffect(() => {
    refetchAsistentet();
    refetchDepartments();
  }, [refetchAsistentet, refetchDepartments]);

  // Action handlers
  const handleAddAsistenti = () => {
    setIsCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedAsistenti(null);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedAsistenti(null);
  };

  // Menu handlers
  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    asistenti: AsistentiModel
  ) => {
    setAnchorEl(event.currentTarget);
    setMenuAsistenti(asistenti);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuAsistenti(null);
  };

  const handleEditClick = () => {
    if (menuAsistenti) {
      setSelectedAsistenti(menuAsistenti);
      setIsEditDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    if (menuAsistenti) {
      setSelectedAsistenti(menuAsistenti);
      setIsDeleteDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    if (selectedAsistenti) {
      try {
        // Note: Delete functionality would need to be implemented in the backend
        // For now, we'll just close the dialog
        console.log("Delete asistenti:", selectedAsistenti.id);
        handleCloseDeleteDialog();
        refetchAsistentet();
      } catch (error) {
        console.error("Failed to delete asistenti:", error);
      }
    }
  };

  // Filter handlers
  const handleDepartmentFilterChange = (departmentId: string) => {
    filterByDepartment(departmentId === "all" ? null : departmentId);
  };

  const handleClearDepartmentFilter = () => {
    filterByDepartment(null);
  };

  // Success handlers
  const handleCreateSuccess = (newAsistenti: any) => {
    console.log("Asistenti created successfully:", newAsistenti);
  };

  const handleUpdateSuccess = (updatedAsistenti: any) => {
    console.log("Asistenti updated successfully:", updatedAsistenti);
  };

  // Enhanced columns with actions
  const enhancedColumns = [
    ...asistentiColumns,
    {
      accessorKey: "actions",
      label: "Actions",
      accessorFn: (row: AsistentiModel) => row,
      size: 120,
      cell: ({ row }: { row: { original: AsistentiModel } }) => (
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <IconButton
            size="small"
            onClick={() => {
              setSelectedAsistenti(row.original);
              setIsEditDialogOpen(true);
            }}
            sx={{
              color: "primary.main",
              "&:hover": { backgroundColor: "primary.light", color: "white" },
            }}
            title="Edit Asistenti"
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
      <PageLayout title="Asistentet" showProfile={true}>
        <div style={{ padding: "20px", textAlign: "center" }}>
          <p>Error loading asistentet: {error.message}</p>
          <Button variant="contained" onClick={() => refetchAsistentet()}>
            Retry
          </Button>
        </div>
      </PageLayout>
    );
  }

  const selectedDepartmentName = departments.find(
    (dept) => dept.id === selectedDepartment
  )?.emri_departmentit;

  return (
    <PageLayout title="Asistentet" showProfile={true}>
      {/* Filter Section */}
      <Box
        sx={{
          mb: 2,
          display: "flex",
          gap: 2,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Button
          variant="outlined"
          startIcon={<FilterIcon width={16} height={16} />}
          onClick={() => setShowDepartmentFilter(!showDepartmentFilter)}
        >
          Filter by Department
        </Button>

        {selectedDepartment && (
          <Chip
            label={`Department: ${selectedDepartmentName}`}
            onDelete={handleClearDepartmentFilter}
            color="primary"
            variant="outlined"
          />
        )}

        {showDepartmentFilter && (
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Select Department</InputLabel>
            <Select
              value={selectedDepartment || "all"}
              label="Select Department"
              onChange={(e) => handleDepartmentFilterChange(e.target.value)}
            >
              <MenuItem value="all">All Departments</MenuItem>
              {departments.map((dept) => (
                <MenuItem key={dept.id} value={dept.id}>
                  {dept.emri_departmentit}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>

      <Table
        columns={enhancedColumns}
        store={useAsistentiOperations}
        rightActions={
          <Button
            variant="contained"
            size="medium"
            startIcon={<PlusIcon width={16} height={16} />}
            onClick={handleAddAsistenti}
          >
            Add Asistenti
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

      {/* Create Asistenti Dialog */}
      <CreateAsistentiDialog
        open={isCreateDialogOpen}
        onClose={handleCloseCreateDialog}
        onSuccess={handleCreateSuccess}
      />

      {/* Edit Asistenti Dialog */}
      <EditAsistentiDialog
        open={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        onSuccess={handleUpdateSuccess}
        asistenti={selectedAsistenti}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Delete Asistenti</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete &ldquo;{selectedAsistenti?.emri} {selectedAsistenti?.mbiemri}
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

