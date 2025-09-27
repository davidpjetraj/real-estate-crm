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
import { useCityOperations } from "../../../store/useCity";
import { useStateOperations } from "../../../store/useState";

interface CreateCityDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (item: any) => void;
}

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, "City name must be at least 2 characters")
    .max(100, "City name must not exceed 100 characters")
    .required("City name is required"),
  state_id: Yup.string().required("State is required"),
});

export function CreateCityDialog({
  open,
  onClose,
  onSuccess,
}: CreateCityDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const { createCity, createLoading } = useCityOperations();
  const { data: states, refetchStates } = useStateOperations();

  // Fetch states when dialog opens
  useEffect(() => {
    if (open) {
      refetchStates();
    }
  }, [open, refetchStates]);

  const formik = useFormik({
    initialValues: {
      name: "",
      state_id: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setError(null);
        await createCity({
          name: values.name.trim(),
          state_id: values.state_id,
        });

        resetForm();
        onSuccess?.(values);
        onClose();
      } catch (err: any) {
        setError(err?.message || "Failed to create city. Please try again.");
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    setError(null);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Create New City"
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
          label="City Name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
          margin="normal"
          required
          autoFocus
          placeholder="Enter city name"
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

        <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
          <Button
            type="button"
            variant="outlined"
            onClick={handleClose}
            disabled={createLoading}
            fullWidth
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={createLoading || !formik.isValid}
            fullWidth
            startIcon={
              createLoading ? <CircularProgress size={20} /> : undefined
            }
          >
            {createLoading ? "Creating..." : "Create City"}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
