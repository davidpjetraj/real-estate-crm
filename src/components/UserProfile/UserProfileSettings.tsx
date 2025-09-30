"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import MemberAvatar from "../shared/Avatar";
import { useUpdatePersonalInfoMutation } from "@/lib/graphql/generated/graphql";

const validationSchema = Yup.object({
  first_name: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .required("First name is required"),
  last_name: Yup.string()
    .min(2, "Last name must be at least 2 characters")
    .required("Last name is required"),
  phone: Yup.string().optional(),
});

export default function UserProfileSettings() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [updatePersonalInfo, { loading: isSubmitting }] =
    useUpdatePersonalInfoMutation({
      onCompleted: (data) => {
        // Update local user state with the returned data
        setUser(data.updatePersonalInfo);
        setSuccessMessage("Profile updated successfully! Redirecting...");

        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      },
      onError: (error) => {
        console.error("Error updating profile:", error);
        setErrorMessage(error.message || "Failed to update profile");
        setTimeout(() => setErrorMessage(""), 5000);
      },
    });

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
      setSuccessMessage("");
      setErrorMessage("");

      try {
        await updatePersonalInfo({
          variables: {
            input: {
              first_name: values.first_name,
              last_name: values.last_name,
              phone: values.phone || null,
              // Note: birthday is not included as it's not in the form
            },
          },
        });
      } catch (error) {
        console.error("Error submitting form:", error);
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

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}

        <Box component="form" onSubmit={formik.handleSubmit}>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <MemberAvatar user={user} size={50} />
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
            disabled
            helperText="Email cannot be changed from here"
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
