"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Button,
  TextField,
  Box,
  CircularProgress,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { Dialog } from "./Dialog";
import { CreateTeamDocument } from "@/lib/graphql/generated/graphql";

interface CreateTeamMemberDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (item: any) => void;
}

const validationSchema = Yup.object({
  first_name: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .required("First name is required"),
  last_name: Yup.string()
    .min(2, "Last name must be at least 2 characters")
    .required("Last name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string()
    .matches(/^[+]?[\d\s\-\(\)]+$/, "Invalid phone number format")
    .optional(),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one lowercase letter, one uppercase letter, and one number"
    )
    .required("Password is required"),
  birthday: Yup.date()
    .max(new Date(), "Birthday cannot be in the future")
    .optional(),
});

export default function CreateTeamMemberDialog({
  open,
  onClose,
  onSuccess,
}: CreateTeamMemberDialogProps) {
  const [createTeam, { loading, error }] = useMutation(CreateTeamDocument);
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      password: "",
      birthday: null as dayjs.Dayjs | null,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const { data } = await createTeam({
          variables: {
            input: {
              first_name: values.first_name,
              last_name: values.last_name,
              email: values.email,
              phone: values.phone || undefined,
              password: values.password,
              birthday: values.birthday
                ? values.birthday.toISOString()
                : undefined,
            },
          },
        });

        if (data?.createTeam) {
          // Add the new team member to the store
          if (onSuccess) {
            onSuccess(data.createTeam);
          }

          // Reset form
          formik.resetForm();

          // Close dialog
          onClose();
        }
      } catch (error: unknown) {
        console.error("Create team member error:", error);
        // Error is handled by Apollo Client and displayed via the error state
      }
    },
  });

  const handleClose = () => {
    // Reset form when closing
    formik.resetForm();
    onClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} setOpen={handleClose}>
        <Dialog.Title title="Add Team Member" onClose={handleClose} />
        <Dialog.Content>
          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error.message}
              </Alert>
            )}

            <TextField
              label="First Name"
              fullWidth
              name="first_name"
              value={formik.values.first_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.first_name && Boolean(formik.errors.first_name)
              }
              helperText={formik.touched.first_name && formik.errors.first_name}
              disabled={loading}
              required
            />

            <TextField
              label="Last Name"
              fullWidth
              name="last_name"
              value={formik.values.last_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.last_name && Boolean(formik.errors.last_name)
              }
              helperText={formik.touched.last_name && formik.errors.last_name}
              disabled={loading}
              required
            />

            <TextField
              label="Email"
              fullWidth
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              disabled={loading}
              required
            />

            <TextField
              label="Phone"
              fullWidth
              name="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.phone && Boolean(formik.errors.phone)}
              helperText={formik.touched.phone && formik.errors.phone}
              disabled={loading}
            />

            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              disabled={loading}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      onMouseDown={(e) => e.preventDefault()}
                      disabled={loading}
                      edge="end"
                    >
                      {showPassword ? "👁️" : "👁️‍🗨️"}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <DatePicker
              label="Birthday (Optional)"
              value={formik.values.birthday}
              onChange={(date) => formik.setFieldValue("birthday", date)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error:
                    formik.touched.birthday && Boolean(formik.errors.birthday),
                  helperText: formik.touched.birthday && formik.errors.birthday,
                  disabled: loading,
                },
              }}
            />
          </Box>
        </Dialog.Content>
        <Dialog.Actions>
          <div className="right">
            <Button variant="outlined" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => formik.handleSubmit()}
              disabled={loading || !formik.isValid}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Add Team Member"
              )}
            </Button>
          </div>
        </Dialog.Actions>
      </Dialog>
    </LocalizationProvider>
  );
}
