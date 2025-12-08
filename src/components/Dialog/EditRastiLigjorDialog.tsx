"use client";

import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, TextField, Box, CircularProgress, Alert } from "@mui/material";
import { Dialog } from "./Dialog";
import { useRastiLigjorOperations } from "../../../store/useRastiLigjor";
import { RastiLigjorModel } from "@/lib/graphql/generated/graphql";

interface EditRastiLigjorDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (item: any) => void;
  rastiLigjor: RastiLigjorModel | null;
}

const validationSchema = Yup.object({
  emri: Yup.string().required("Emri is required"),
  lloji_rastit: Yup.string().required("Lloji i rastit is required"),
});

export function EditRastiLigjorDialog({
  open,
  onClose,
  onSuccess,
  rastiLigjor,
}: EditRastiLigjorDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const { updateRastiLigjor, updateLoading } = useRastiLigjorOperations();

  const formik = useFormik({
    initialValues: {
      emri: rastiLigjor?.emri || "",
      lloji_rastit: rastiLigjor?.lloji_rastit || "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      if (!rastiLigjor) return;

      try {
        setError(null);
        await updateRastiLigjor({
          id: rastiLigjor.id,
          emri: values.emri.trim(),
          lloji_rastit: values.lloji_rastit.trim(),
        });

        resetForm();
        onSuccess?.(values);
        onClose();
      } catch (err: any) {
        setError(
          err?.message || "Failed to update rasti ligjor. Please try again."
        );
      }
    },
  });

  useEffect(() => {
    if (rastiLigjor) {
      formik.setValues({
        emri: rastiLigjor.emri,
        lloji_rastit: rastiLigjor.lloji_rastit,
      });
    }
  }, [rastiLigjor]);

  const handleClose = () => {
    formik.resetForm();
    setError(null);
    onClose();
  };

  if (!rastiLigjor) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Ndrysho Rastin Ligjor"
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
            {updateLoading ? "Updating..." : "Update Rasti Ligjor"}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
