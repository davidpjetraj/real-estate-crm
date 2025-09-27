"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, TextField, Box, CircularProgress, Alert } from "@mui/material";
import { Dialog } from "./Dialog";
import { useStateOperations } from "../../../store/useState";

interface CreateStateDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (item: any) => void;
}

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, "State name must be at least 2 characters")
    .max(100, "State name must not exceed 100 characters")
    .required("State name is required"),
});

export function CreateStateDialog({
  open,
  onClose,
  onSuccess,
}: CreateStateDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const { createState, createLoading } = useStateOperations();

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setError(null);
        await createState({
          name: values.name.trim(),
        });

        resetForm();
        onSuccess?.(values);
        onClose();
      } catch (err: any) {
        setError(err?.message || "Failed to create state. Please try again.");
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
      title="Create New State"
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
            {createLoading ? "Creating..." : "Create State"}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
