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
import { AsistentiModel } from "@/lib/graphql/generated/graphql";

interface EditAsistentiDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (item: any) => void;
  asistenti: AsistentiModel | null;
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

export function EditAsistentiDialog({
  open,
  onClose,
  onSuccess,
  asistenti,
}: EditAsistentiDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const { updateAsistenti, updateLoading } = useAsistentiOperations();
  const { data: departments, refetchDepartments } = useDepartmentOperations();

  // Fetch departments when dialog opens
  useEffect(() => {
    if (open) {
      refetchDepartments();
    }
  }, [open, refetchDepartments]);

  const formik = useFormik({
    initialValues: {
      emri: asistenti?.emri || "",
      mbiemri: asistenti?.mbiemri || "",
      department_id: asistenti?.department?.id || "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      if (!asistenti) return;

      try {
        setError(null);
        await updateAsistenti({
          id: asistenti.id,
          emri: values.emri.trim(),
          mbiemri: values.mbiemri.trim(),
          department_id: values.department_id,
        });

        resetForm();
        onSuccess?.(values);
        onClose();
      } catch (err: any) {
        setError(err?.message || "Failed to update asistenti. Please try again.");
      }
    },
  });

  // Reset form when asistenti changes
  useEffect(() => {
    if (asistenti) {
      formik.setValues({
        emri: asistenti.emri,
        mbiemri: asistenti.mbiemri,
        department_id: asistenti.department?.id || "",
      });
    }
  }, [asistenti]);

  const handleClose = () => {
    formik.resetForm();
    setError(null);
    onClose();
  };

  if (!asistenti) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Edit Asistenti"
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
            {updateLoading ? "Updating..." : "Update Asistenti"}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}

