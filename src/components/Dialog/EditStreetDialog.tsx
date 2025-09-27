"use client";

import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Button,
  TextField,
  Box,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Dialog } from "./Dialog";
import { useStreetOperations } from "../../../store/useStreet";
import { useStateOperations } from "../../../store/useState";
import { useCityOperations } from "../../../store/useCity";
import { StreetModel } from "@/lib/graphql/generated/graphql";

interface EditStreetDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (item: any) => void;
  street: StreetModel | null;
}

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, "Street name must be at least 2 characters")
    .max(100, "Street name must not exceed 100 characters")
    .required("Street name is required"),
  state_id: Yup.string().required("State is required"),
  city_id: Yup.string().required("City is required"),
});

export function EditStreetDialog({
  open,
  onClose,
  onSuccess,
  street,
}: EditStreetDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const { updateStreet, updateLoading } = useStreetOperations();
  const { data: states, refetchStates } = useStateOperations();
  const { data: cities, filterByState: filterCitiesByState } =
    useCityOperations();

  // Fetch states when dialog opens
  useEffect(() => {
    if (open) {
      refetchStates();
    }
  }, [open, refetchStates]);

  const formik = useFormik({
    initialValues: {
      name: street?.name || "",
      state_id: street?.state?.id || "",
      city_id: street?.city?.id || "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      if (!street) return;

      try {
        setError(null);
        await updateStreet({
          id: street.id,
          name: values.name.trim(),
          state_id: values.state_id,
          city_id: values.city_id,
        });

        resetForm();
        onSuccess?.(values);
        onClose();
      } catch (err: any) {
        setError(err?.message || "Failed to update street. Please try again.");
      }
    },
  });

  // Reset form when street changes
  useEffect(() => {
    if (street) {
      formik.setValues({
        name: street.name,
        state_id: street.state?.id || "",
        city_id: street.city?.id || "",
      });

      // Load cities for the selected state
      if (street.state?.id) {
        filterCitiesByState(street.state.id);
      }
    }
  }, [street, filterCitiesByState]);

  // Filter cities when state changes
  useEffect(() => {
    if (formik.values.state_id) {
      filterCitiesByState(formik.values.state_id);

      // Reset city selection when state changes (but not on initial load)
      const currentCityBelongsToState = cities.some(
        (city) =>
          city.id === formik.values.city_id &&
          city.state?.id === formik.values.state_id
      );

      if (!currentCityBelongsToState && formik.values.city_id) {
        formik.setFieldValue("city_id", "");
      }
    }
  }, [formik.values.state_id, filterCitiesByState]);

  const handleClose = () => {
    formik.resetForm();
    setError(null);
    onClose();
  };

  if (!street) return null;

  // Filter cities based on selected state
  const availableCities = cities.filter(
    (city) => city.state?.id === formik.values.state_id
  );

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Edit Street"
      maxWidth="sm"
      fullWidth
    >
      <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          id="name"
          name="name"
          label="Street Name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
          margin="normal"
          required
          autoFocus
          placeholder="Enter street name"
        />

        <FormControl
          fullWidth
          margin="normal"
          error={formik.touched.state_id && Boolean(formik.errors.state_id)}
          required
        >
          <InputLabel id="state-select-label">State</InputLabel>
          <Select
            labelId="state-select-label"
            id="state_id"
            name="state_id"
            value={formik.values.state_id}
            label="State"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            {states.map((state) => (
              <MenuItem key={state.id} value={state.id}>
                {state.name}
              </MenuItem>
            ))}
          </Select>
          {formik.touched.state_id && formik.errors.state_id && (
            <Box
              sx={{ color: "error.main", fontSize: "0.75rem", mt: 0.5, ml: 2 }}
            >
              {formik.errors.state_id}
            </Box>
          )}
        </FormControl>

        <FormControl
          fullWidth
          margin="normal"
          error={formik.touched.city_id && Boolean(formik.errors.city_id)}
          required
          disabled={!formik.values.state_id}
        >
          <InputLabel id="city-select-label">City</InputLabel>
          <Select
            labelId="city-select-label"
            id="city_id"
            name="city_id"
            value={formik.values.city_id}
            label="City"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            {availableCities.map((city) => (
              <MenuItem key={city.id} value={city.id}>
                {city.name}
              </MenuItem>
            ))}
          </Select>
          {formik.touched.city_id && formik.errors.city_id && (
            <Box
              sx={{ color: "error.main", fontSize: "0.75rem", mt: 0.5, ml: 2 }}
            >
              {formik.errors.city_id}
            </Box>
          )}
          {!formik.values.state_id && (
            <Box
              sx={{
                color: "text.secondary",
                fontSize: "0.75rem",
                mt: 0.5,
                ml: 2,
              }}
            >
              Please select a state first
            </Box>
          )}
        </FormControl>

        <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
          <Button
            type="button"
            variant="outlined"
            onClick={handleClose}
            disabled={updateLoading}
            fullWidth
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={updateLoading || !formik.isValid || !formik.dirty}
            fullWidth
            startIcon={
              updateLoading ? <CircularProgress size={20} /> : undefined
            }
          >
            {updateLoading ? "Updating..." : "Update Street"}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
