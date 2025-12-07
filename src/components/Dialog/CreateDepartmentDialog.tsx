"use client";

import { useState } from "react";
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
import { useDepartmentOperations } from "../../../store/useDepartment";

interface CreateDepartmentDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (item: any) => void;
}

const validationSchema = Yup.object({
  emri_departmentit: Yup.string()
    .min(2, "Department name must be at least 2 characters")
    .max(100, "Department name must not exceed 100 characters")
    .required("Department name is required"),
  numri_i_zyreve: Yup.number()
    .min(1, "Number of positions must be at least 1")
    .required("Number of positions is required"),
});

export function CreateDepartmentDialog({
  open,
  onClose,
  onSuccess,
}: CreateDepartmentDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const { createDepartment, createLoading } = useDepartmentOperations();

  const formik = useFormik({
    initialValues: {
      emri_departmentit: "",
      numri_i_zyreve: 1,
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setError(null);
        await createDepartment({
          emri_departmentit: values.emri_departmentit.trim(),
          numri_i_zyreve: values.numri_i_zyreve,
        });

        resetForm();
        onSuccess?.(values);
        onClose();
      } catch (err: any) {
        setError(err?.message || "Failed to create department. Please try again.");
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
      title="Create New Department"
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
          id="emri_departmentit"
          name="emri_departmentit"
          label="Department Name"
          value={formik.values.emri_departmentit}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.emri_departmentit && Boolean(formik.errors.emri_departmentit)}
          helperText={formik.touched.emri_departmentit && formik.errors.emri_departmentit}
          margin="normal"
          required
          autoFocus
          placeholder="Enter department name"
        />

        <TextField
          fullWidth
          id="numri_i_zyreve"
          name="numri_i_zyreve"
          label="Number of Positions"
          type="number"
          value={formik.values.numri_i_zyreve}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.numri_i_zyreve && Boolean(formik.errors.numri_i_zyreve)}
          helperText={formik.touched.numri_i_zyreve && formik.errors.numri_i_zyreve}
          margin="normal"
          required
          inputProps={{ min: 1 }}
          placeholder="Enter number of positions"
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
            {createLoading ? "Creating..." : "Create Department"}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}

