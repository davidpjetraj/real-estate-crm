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
import { useCityOperations, cityColumns } from "../../../store/useCity";
import { useStateOperations } from "../../../store/useState";
import { CreateCityDialog, EditCityDialog } from "@/components/Dialog";
import { CityModel } from "@/lib/graphql/generated/graphql";

export default function CityPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<CityModel | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuCity, setMenuCity] = useState<CityModel | null>(null);
  const [showStateFilter, setShowStateFilter] = useState(false);

  const {
    error,
    refetchCities,
    deleteCity,
    deleteLoading,
    selectedState,
    filterByState,
  } = useCityOperations();

  const { data: states, refetchStates } = useStateOperations();

  useEffect(() => {
    refetchCities();
    refetchStates();
  }, [refetchCities, refetchStates]);

  // Action handlers
  const handleAddCity = () => {
    setIsCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedCity(null);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedCity(null);
  };

  // Menu handlers
  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    city: CityModel
  ) => {
    setAnchorEl(event.currentTarget);
    setMenuCity(city);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuCity(null);
  };

  const handleEditClick = () => {
    if (menuCity) {
      setSelectedCity(menuCity);
      setIsEditDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    if (menuCity) {
      setSelectedCity(menuCity);
      setIsDeleteDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    if (selectedCity) {
      try {
        await deleteCity({ id: selectedCity.id });
        handleCloseDeleteDialog();
      } catch (error) {
        console.error("Failed to delete city:", error);
      }
    }
  };

  // Filter handlers
  const handleStateFilterChange = (stateId: string) => {
    filterByState(stateId === "all" ? null : stateId);
  };

  const handleClearStateFilter = () => {
    filterByState(null);
  };

  // Success handlers
  const handleCreateSuccess = (newCity: any) => {
    console.log("City created successfully:", newCity);
  };

  const handleUpdateSuccess = (updatedCity: any) => {
    console.log("City updated successfully:", updatedCity);
  };

  // Enhanced columns with actions
  const enhancedColumns = [
    ...cityColumns,
    {
      accessorKey: "actions",
      label: "Actions",
      accessorFn: (row: CityModel) => row,
      size: 120,
      cell: ({ row }: { row: { original: CityModel } }) => (
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <IconButton
            size="small"
            onClick={() => {
              setSelectedCity(row.original);
              setIsEditDialogOpen(true);
            }}
            sx={{
              color: "primary.main",
              "&:hover": { backgroundColor: "primary.light", color: "white" },
            }}
            title="Edit City"
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
      <PageLayout title="Cities" showProfile={true}>
        <div style={{ padding: "20px", textAlign: "center" }}>
          <p>Error loading cities: {error.message}</p>
          <Button variant="contained" onClick={() => refetchCities()}>
            Retry
          </Button>
        </div>
      </PageLayout>
    );
  }

  const selectedStateName = states.find(
    (state) => state.id === selectedState
  )?.name;

  return (
    <PageLayout title="Cities" showProfile={true}>
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
          onClick={() => setShowStateFilter(!showStateFilter)}
        >
          Filter by State
        </Button>

        {selectedState && (
          <Chip
            label={`State: ${selectedStateName}`}
            onDelete={handleClearStateFilter}
            color="primary"
            variant="outlined"
          />
        )}

        {showStateFilter && (
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Select State</InputLabel>
            <Select
              value={selectedState || "all"}
              label="Select State"
              onChange={(e) => handleStateFilterChange(e.target.value)}
            >
              <MenuItem value="all">All States</MenuItem>
              {states.map((state) => (
                <MenuItem key={state.id} value={state.id}>
                  {state.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>

      <Table
        columns={enhancedColumns}
        store={useCityOperations}
        rightActions={
          <Button
            variant="contained"
            size="medium"
            startIcon={<PlusIcon width={16} height={16} />}
            onClick={handleAddCity}
          >
            Add City
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

      {/* Create City Dialog */}
      <CreateCityDialog
        open={isCreateDialogOpen}
        onClose={handleCloseCreateDialog}
        onSuccess={handleCreateSuccess}
      />

      {/* Edit City Dialog */}
      <EditCityDialog
        open={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        onSuccess={handleUpdateSuccess}
        city={selectedCity}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Delete City</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete the city &ldquo;{selectedCity?.name}
            &rdquo; from {selectedCity?.state?.name}? This action cannot be
            undone and may affect related data.
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
