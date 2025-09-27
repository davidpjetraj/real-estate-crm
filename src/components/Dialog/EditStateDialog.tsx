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
} from "@mui/material";
import { Dialog } from "./Dialog";
import { useStateOperations } from "../../../store/useState";
import { StateModel } from "@/lib/graphql/generated/graphql";

interface EditStateDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (item: any) => void;
  state: StateModel | null;
}

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, "State name must be at least 2 characters")
    .max(100, "State name must not exceed 100 characters")
    .required("State name is required"),
});

export function EditStateDialog({
  open,
  onClose,
  onSuccess,
  state,
}: EditStateDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const { updateState, updateLoading } = useStateOperations();

  const formik = useFormik({
    initialValues: {
      name: state?.name || "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      if (!state) return;
      
      try {
        setError(null);
        await updateState({
          id: state.id,
          name: values.name.trim(),
        });
        
        resetForm();
        onSuccess?.(values);
        onClose();
      } catch (err: any) {
        setError(err?.message || "Failed to update state. Please try again.");
      }
    },
  });

  // Reset form when state changes
  useEffect(() => {
    if (state) {
      formik.setValues({
        name: state.name,
      });
    }
  }, [state]);

  const handleClose = () => {
    formik.resetForm();
    setError(null);
    onClose();
  };

  if (!state) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Edit State"
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
          label="State Name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
          margin="normal"
          required
          autoFocus
          placeholder="Enter state name"
        />

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
            {updateLoading ? "Updating..." : "Update State"}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
