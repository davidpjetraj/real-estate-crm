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
import { useDepartmentOperations } from "../../../store/useDepartment";
import { DepartmentModel } from "@/lib/graphql/generated/graphql";

interface EditDepartmentDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (item: any) => void;
  department: DepartmentModel | null;
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

export function EditDepartmentDialog({
  open,
  onClose,
  onSuccess,
  department,
}: EditDepartmentDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const { updateDepartment, updateLoading } = useDepartmentOperations();

  const formik = useFormik({
    initialValues: {
      emri_departmentit: department?.emri_departmentit || "",
      numri_i_zyreve: department?.numri_i_zyreve || 1,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      if (!department) return;

      try {
        setError(null);
        await updateDepartment({
          id: department.id,
          emri_departmentit: values.emri_departmentit.trim(),
          numri_i_zyreve: values.numri_i_zyreve,
        });

        resetForm();
        onSuccess?.(values);
        onClose();
      } catch (err: any) {
        setError(err?.message || "Failed to update department. Please try again.");
      }
    },
  });

  // Reset form when department changes
  useEffect(() => {
    if (department) {
      formik.setValues({
        emri_departmentit: department.emri_departmentit,
        numri_i_zyreve: department.numri_i_zyreve,
      });
    }
  }, [department]);

  const handleClose = () => {
    formik.resetForm();
    setError(null);
    onClose();
  };

  if (!department) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Edit Department"
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
            {updateLoading ? "Updating..." : "Update Department"}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}

