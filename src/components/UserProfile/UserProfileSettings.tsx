"use client";

import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import useAuth from "../../../store/useAuth";

const validationSchema = Yup.object({
  first_name: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .required("First name is required"),
  last_name: Yup.string()
    .min(2, "Last name must be at least 2 characters")
    .required("Last name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  phone: Yup.string().optional(),
});

export default function UserProfileSettings() {
  const { user, setUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const formik = useFormik({
    initialValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      setSuccessMessage("");

      try {
        setUser({
          ...values,
          name: `${values.first_name} ${values.last_name}`,
        });

        setSuccessMessage("Profile updated successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (error) {
        console.error("Error updating profile:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <Card sx={{ maxWidth: 600, mx: "auto", mt: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Profile Settings
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Update your personal information
        </Typography>

        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        <Box component="form" onSubmit={formik.handleSubmit}>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="First Name"
              name="first_name"
              value={formik.values.first_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.first_name && Boolean(formik.errors.first_name)
              }
            />
            <TextField
              fullWidth
              label="Last Name"
              name="last_name"
              value={formik.values.last_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.last_name && Boolean(formik.errors.last_name)
              }
            />
          </Box>

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting || !formik.isValid}
            sx={{ minWidth: 120 }}
          >
            {isSubmitting ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Update Profile"
            )}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
