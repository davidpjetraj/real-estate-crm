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
import { useAsistentiOperations } from "../../../store/useAsistenti";
import { useDepartmentOperations } from "../../../store/useDepartment";

interface CreateAsistentiDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (item: any) => void;
}

const validationSchema = Yup.object({
  emri: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .max(100, "First name must not exceed 100 characters")
    .required("First name is required"),
  mbiemri: Yup.string()
    .min(2, "Last name must be at least 2 characters")
    .max(100, "Last name must not exceed 100 characters")
    .required("Last name is required"),
  department_id: Yup.string().required("Department is required"),
});

export function CreateAsistentiDialog({
  open,
  onClose,
  onSuccess,
}: CreateAsistentiDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const { createAsistenti, createLoading } = useAsistentiOperations();
  const { data: departments, refetchDepartments } = useDepartmentOperations();

  // Fetch departments when dialog opens
  useEffect(() => {
    if (open) {
      refetchDepartments();
    }
  }, [open, refetchDepartments]);

  const formik = useFormik({
    initialValues: {
      emri: "",
      mbiemri: "",
      department_id: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setError(null);
        await createAsistenti({
          emri: values.emri.trim(),
          mbiemri: values.mbiemri.trim(),
          department_id: values.department_id,
        });

        resetForm();
        onSuccess?.(values);
        onClose();
      } catch (err: any) {
        setError(err?.message || "Failed to create asistenti. Please try again.");
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
      title="Create New Asistenti"
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
          label="First Name"
          value={formik.values.emri}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.emri && Boolean(formik.errors.emri)}
          helperText={formik.touched.emri && formik.errors.emri}
          margin="normal"
          required
          autoFocus
          placeholder="Enter first name"
        />

        <TextField
          fullWidth
          id="mbiemri"
          name="mbiemri"
          label="Last Name"
          value={formik.values.mbiemri}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.mbiemri && Boolean(formik.errors.mbiemri)}
          helperText={formik.touched.mbiemri && formik.errors.mbiemri}
          margin="normal"
          required
          placeholder="Enter last name"
        />

        <FormControl
          fullWidth
          margin="normal"
          error={formik.touched.department_id && Boolean(formik.errors.department_id)}
          required
        >
          <InputLabel id="department-select-label">Department</InputLabel>
          <Select
            labelId="department-select-label"
            id="department_id"
            name="department_id"
            value={formik.values.department_id}
            label="Department"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            {departments.map((dept) => (
              <MenuItem key={dept.id} value={dept.id}>
                {dept.emri_departmentit}
              </MenuItem>
            ))}
          </Select>
          {formik.touched.department_id && formik.errors.department_id && (
            <Box
              sx={{ color: "error.main", fontSize: "0.75rem", mt: 0.5, ml: 2 }}
            >
              {formik.errors.department_id}
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
            {createLoading ? "Creating..." : "Create Asistenti"}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}

