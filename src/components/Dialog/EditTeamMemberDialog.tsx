"use client";

import { useMutation } from "@apollo/client";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, TextField, Box, CircularProgress, Alert } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { Dialog } from "./Dialog";
import { UpdateTeamDocument } from "@/lib/graphql/generated/graphql";
import { TeamModel } from "@/lib/graphql/generated/graphql";

interface EditTeamMemberDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (item: TeamModel) => void;
  teamMember?: TeamModel | null;
}

const validationSchema = Yup.object({
  first_name: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .required("First name is required"),
  last_name: Yup.string()
    .min(2, "Last name must be at least 2 characters")
    .required("Last name is required"),
  birthday: Yup.date()
    .max(new Date(), "Birthday cannot be in the future")
    .optional(),
});

export default function EditTeamMemberDialog({
  open,
  onClose,
  onSuccess,
  teamMember,
}: EditTeamMemberDialogProps) {
  const [updateTeam, { loading, error }] = useMutation(UpdateTeamDocument);

  const formik = useFormik({
    initialValues: {
      first_name: teamMember?.first_name || "",
      last_name: teamMember?.last_name || "",
      birthday: teamMember?.birthday ? dayjs(teamMember.birthday) : null,
    },
    enableReinitialize: true,
    validateOnMount: false,
    validationSchema,
    onSubmit: async (values) => {
      if (!teamMember?.id) return;

      try {
        const { data } = await updateTeam({
          variables: {
            input: {
              id: teamMember.id,
              first_name: values.first_name,
              last_name: values.last_name,
              birthday: values.birthday
                ? values.birthday.toISOString()
                : undefined,
            },
          },
        });

        if (data?.updateTeam) {
          if (onSuccess) {
            onSuccess(data.updateTeam);
          }

          // Close dialog
          onClose();
        }
      } catch (error: unknown) {
        console.error("Update team member error:", error);
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} setOpen={handleClose}>
        <Dialog.Title title="Edit Team Member" onClose={handleClose} />
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
              value={teamMember?.email || ""}
              disabled={true}
              helperText="Email cannot be changed"
            />

            <DatePicker
              label="Birthday"
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
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Update Team Member"
              )}
            </Button>
          </div>
        </Dialog.Actions>
      </Dialog>
    </LocalizationProvider>
  );
}
