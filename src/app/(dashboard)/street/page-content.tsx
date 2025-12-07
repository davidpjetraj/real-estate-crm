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
import { useStreetOperations, streetColumns } from "../../../../store/useStreet";
import { useStateOperations } from "../../../../store/useState";
import { useCityOperations } from "../../../../store/useCity";
import { CreateStreetDialog, EditStreetDialog } from "@/components/Dialog";
import { StreetModel } from "@/lib/graphql/generated/graphql";

export default function StreetPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStreet, setSelectedStreet] = useState<StreetModel | null>(
    null
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuStreet, setMenuStreet] = useState<StreetModel | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const {
    error,
    refetchStreets,
    deleteStreet,
    deleteLoading,
    selectedState,
    selectedCity,
    filterByState,
    filterByCity,
  } = useStreetOperations();

  const { data: states, refetchStates } = useStateOperations();
  const { data: cities, filterByState: filterCitiesByState } =
    useCityOperations();

  useEffect(() => {
    refetchStreets();
    refetchStates();
  }, [refetchStreets, refetchStates]);

  // Filter cities when state changes
  useEffect(() => {
    if (selectedState) {
      filterCitiesByState(selectedState);
    }
  }, [selectedState, filterCitiesByState]);

  // Action handlers
  const handleAddStreet = () => {
    setIsCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedStreet(null);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedStreet(null);
  };

  // Menu handlers
  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    street: StreetModel
  ) => {
    setAnchorEl(event.currentTarget);
    setMenuStreet(street);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuStreet(null);
  };

  const handleEditClick = () => {
    if (menuStreet) {
      setSelectedStreet(menuStreet);
      setIsEditDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    if (menuStreet) {
      setSelectedStreet(menuStreet);
      setIsDeleteDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    if (selectedStreet) {
      try {
        await deleteStreet({ id: selectedStreet.id });
        handleCloseDeleteDialog();
      } catch (error) {
        console.error("Failed to delete street:", error);
      }
    }
  };

  // Filter handlers
  const handleStateFilterChange = (stateId: string) => {
    filterByState(stateId === "all" ? null : stateId);
  };

  const handleCityFilterChange = (cityId: string) => {
    filterByCity(cityId === "all" ? null : cityId);
  };

  const handleClearStateFilter = () => {
    filterByState(null);
  };

  const handleClearCityFilter = () => {
    filterByCity(null);
  };

  // Success handlers
  const handleCreateSuccess = (newStreet: any) => {
    console.log("Street created successfully:", newStreet);
  };

  const handleUpdateSuccess = (updatedStreet: any) => {
    console.log("Street updated successfully:", updatedStreet);
  };

  // Enhanced columns with actions
  const enhancedColumns = [
    ...streetColumns,
    {
      accessorKey: "actions",
      label: "Actions",
      accessorFn: (row: StreetModel) => row,
      size: 120,
      cell: ({ row }: { row: { original: StreetModel } }) => (
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <IconButton
            size="small"
            onClick={() => {
              setSelectedStreet(row.original);
              setIsEditDialogOpen(true);
            }}
            sx={{
              color: "primary.main",
              "&:hover": { backgroundColor: "primary.light", color: "white" },
            }}
            title="Edit Street"
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
      <PageLayout title="Streets" showProfile={true}>
        <div style={{ padding: "20px", textAlign: "center" }}>
          <p>Error loading streets: {error.message}</p>
          <Button variant="contained" onClick={() => refetchStreets()}>
            Retry
          </Button>
        </div>
      </PageLayout>
    );
  }

  const selectedStateName = states.find(
    (state) => state.id === selectedState
  )?.name;
  const selectedCityName = cities.find(
    (city) => city.id === selectedCity
  )?.name;

  // Filter cities based on selected state
  const availableCities = selectedState
    ? cities.filter((city) => city.state?.id === selectedState)
    : cities;

  return (
    <PageLayout title="Streets" showProfile={true}>
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
          onClick={() => setShowFilters(!showFilters)}
        >
          Filter Streets
        </Button>

        {selectedState && (
          <Chip
            label={`State: ${selectedStateName}`}
            onDelete={handleClearStateFilter}
            color="primary"
            variant="outlined"
          />
        )}

        {selectedCity && (
          <Chip
            label={`City: ${selectedCityName}`}
            onDelete={handleClearCityFilter}
            color="secondary"
            variant="outlined"
          />
        )}
      </Box>

      {showFilters && (
        <Box
          sx={{
            mb: 3,
            p: 2,
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
          }}
        >
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Box sx={{ minWidth: 200, flex: 1 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Filter by State</InputLabel>
                <Select
                  value={selectedState || "all"}
                  label="Filter by State"
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
            </Box>
            <Box sx={{ minWidth: 200, flex: 1 }}>
              <FormControl fullWidth size="small" disabled={!selectedState}>
                <InputLabel>Filter by City</InputLabel>
                <Select
                  value={selectedCity || "all"}
                  label="Filter by City"
                  onChange={(e) => handleCityFilterChange(e.target.value)}
                >
                  <MenuItem value="all">All Cities</MenuItem>
                  {availableCities.map((city) => (
                    <MenuItem key={city.id} value={city.id}>
                      {city.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Box>
      )}

      <Table
        columns={enhancedColumns}
        store={useStreetOperations}
        rightActions={
          <Button
            variant="contained"
            size="medium"
            startIcon={<PlusIcon width={16} height={16} />}
            onClick={handleAddStreet}
          >
            Add Street
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
        PaperProps={{
          sx: {
            minWidth: 160,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            border: "1px solid rgba(0,0,0,0.05)",
          },
        }}
      >
        <MenuItem
          onClick={handleEditClick}
          sx={{
            py: 1.5,
            "&:hover": {
              backgroundColor: "primary.light",
              color: "primary.contrastText",
            },
          }}
        >
          <PencilEditIcon width={16} height={16} style={{ marginRight: 12 }} />
          Edit Street
        </MenuItem>
        <MenuItem
          onClick={handleDeleteClick}
          sx={{
            py: 1.5,
            color: "error.main",
            "&:hover": {
              backgroundColor: "error.light",
              color: "error.contrastText",
            },
          }}
        >
          <ErrorColorDeleteIcon
            width={16}
            height={16}
            style={{ marginRight: 12 }}
          />
          Delete Street
        </MenuItem>
      </Menu>

      {/* Create Street Dialog */}
      <CreateStreetDialog
        open={isCreateDialogOpen}
        onClose={handleCloseCreateDialog}
        onSuccess={handleCreateSuccess}
      />

      {/* Edit Street Dialog */}
      <EditStreetDialog
        open={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        onSuccess={handleUpdateSuccess}
        street={selectedStreet}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Delete Street</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete the street &ldquo;
            {selectedStreet?.name}
            &rdquo; from {selectedStreet?.city?.name},{" "}
            {selectedStreet?.state?.name}? This action cannot be undone and may
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
