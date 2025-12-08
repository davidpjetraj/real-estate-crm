"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, TextField, Box, CircularProgress, Alert } from "@mui/material";
import { Dialog } from "./Dialog";
import { useRastiLigjorOperations } from "../../../store/useRastiLigjor";

interface CreateRastiLigjorDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (item: any) => void;
}

const validationSchema = Yup.object({
  emri: Yup.string().required("Emri is required"),
  lloji_rastit: Yup.string().required("Lloji i rastit is required"),
});

export function CreateRastiLigjorDialog({
  open,
  onClose,
  onSuccess,
}: CreateRastiLigjorDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const { createRastiLigjor, createLoading } = useRastiLigjorOperations();

  const formik = useFormik({
    initialValues: {
      emri: "",
      lloji_rastit: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setError(null);
        await createRastiLigjor({
          emri: values.emri.trim(),
          lloji_rastit: values.lloji_rastit.trim(),
        });

        resetForm();
        onSuccess?.(values);
        onClose();
      } catch (err: any) {
        setError(
          err?.message || "Failed to create rasti ligjor. Please try again."
        );
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
      title="Krijo Rast Ligjor"
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
          id="emri"
          name="emri"
          label="Emri"
          value={formik.values.emri}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.emri && Boolean(formik.errors.emri)}
          helperText={formik.touched.emri && formik.errors.emri}
          margin="normal"
          required
          autoFocus
          placeholder="Enter name"
        />

        <TextField
          fullWidth
          id="lloji_rastit"
          name="lloji_rastit"
          label="Lloji i Rastit"
          value={formik.values.lloji_rastit}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.lloji_rastit && Boolean(formik.errors.lloji_rastit)
          }
          helperText={formik.touched.lloji_rastit && formik.errors.lloji_rastit}
          margin="normal"
          required
          placeholder="Enter case type"
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
            {createLoading ? "Creating..." : "Krijo Rast Ligjor"}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
