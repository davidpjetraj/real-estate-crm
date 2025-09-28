"use client";

import { useMutation, useQuery } from "@apollo/client";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, TextField, Box, CircularProgress, Alert } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { Dialog } from "./Dialog";
import { Select } from "@/components/Form/Select";
import {
  ClientModel,
  UpdateClientDocument,
  StatesDocument,
  CitiesDocument,
  StreetsDocument,
} from "@/lib/graphql/generated/graphql";

interface EditClientDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (item: ClientModel) => void;
  client?: ClientModel | null;
}

const validationSchema = Yup.object({
  first_name: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .required("First name is required"),
  last_name: Yup.string()
    .min(2, "Last name must be at least 2 characters")
    .required("Last name is required"),
  email: Yup.string().email("Invalid email address").optional(),
  phone: Yup.string()
    .matches(/^[+]?[\d\s\-\(\)]+$/, "Invalid phone number format")
    .optional(),
  birthday: Yup.date()
    .max(new Date(), "Birthday cannot be in the future")
    .optional(),
  state_id: Yup.string().optional(),
  city_id: Yup.string().optional(),
  street_id: Yup.string().optional(),
});

export default function EditClientDialog({
  open,
  onClose,
  onSuccess,
  client,
}: EditClientDialogProps) {
  const [updateClient, { loading, error }] = useMutation(UpdateClientDocument);

  // Fetch states
  const { data: statesData } = useQuery(StatesDocument, {
    variables: { input: {} },
  });

  // Fetch cities
  const { data: citiesData } = useQuery(CitiesDocument, {
    variables: { input: {} },
  });

  // Fetch streets
  const { data: streetsData } = useQuery(StreetsDocument, {
    variables: { input: {} },
  });

  const initialValues = {
    first_name: client?.first_name || "",
    last_name: client?.last_name || "",
    email: client?.email || "",
    phone: client?.phone || "",
    birthday: client?.birthday ? dayjs(client.birthday) : null,
    state_id: client?.state?.id || "",
    city_id: client?.city?.id || "",
    street_id: client?.street?.id || "",
  };

  const handleSubmit = async (
    values: typeof initialValues,
    { resetForm }: any
  ) => {
    if (!client?.id) return;

    try {
      const { data } = await updateClient({
        variables: {
          input: {
            id: client.id,
            first_name: values.first_name,
            last_name: values.last_name,
            email: values.email || undefined,
            phone: values.phone || undefined,
            birthday: values.birthday
              ? values.birthday.toISOString()
              : undefined,
            state_id: values.state_id || undefined,
            city_id: values.city_id || undefined,
            street_id: values.street_id || undefined,
          },
        },
      });

      if (data?.updateClient) {
        if (onSuccess) {
          onSuccess(data.updateClient as ClientModel);
        }

        // Reset form
        resetForm();

        // Close dialog
        onClose();
      }
    } catch (error: unknown) {
      console.error("Update client error:", error);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} setOpen={handleClose}>
        <Dialog.Title title="Edit Client" onClose={handleClose} />
        <Dialog.Content>
          <Formik
            initialValues={initialValues}
            enableReinitialize={true}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, isValid, isSubmitting }) => (
              <>
                <Form id="edit-client-form">
                  <Box
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
                      value={values.first_name}
                      onChange={(e) =>
                        setFieldValue("first_name", e.target.value)
                      }
                      disabled={loading}
                      required
                    />

                    <TextField
                      label="Last Name"
                      fullWidth
                      name="last_name"
                      value={values.last_name}
                      onChange={(e) =>
                        setFieldValue("last_name", e.target.value)
                      }
                      disabled={loading}
                      required
                    />

                    <TextField
                      label="Email"
                      fullWidth
                      name="email"
                      type="email"
                      value={values.email}
                      onChange={(e) => setFieldValue("email", e.target.value)}
                      disabled={loading}
                    />

                    <TextField
                      label="Phone"
                      fullWidth
                      name="phone"
                      value={values.phone}
                      onChange={(e) => setFieldValue("phone", e.target.value)}
                      disabled={loading}
                    />

                    <Select
                      label="State"
                      name="state_id"
                      options={
                        statesData?.states?.map((state: any) => ({
                          value: state.id,
                          label: state.name,
                        })) || []
                      }
                      disabled={loading}
                      onChange={(event: any) => {
                        setFieldValue("state_id", event.target.value);
                        // Reset dependent fields
                        setFieldValue("city_id", "");
                        setFieldValue("street_id", "");
                      }}
                    />

                    <Select
                      label="City"
                      name="city_id"
                      options={
                        citiesData?.cities
                          ?.filter(
                            (city: any) => city.state?.id === values.state_id
                          )
                          .map((city: any) => ({
                            value: city.id,
                            label: city.name,
                          })) || []
                      }
                      disabled={loading || !values.state_id}
                      onChange={(event: any) => {
                        setFieldValue("city_id", event.target.value);
                        // Reset dependent field
                        setFieldValue("street_id", "");
                      }}
                    />

                    <Select
                      label="Street"
                      name="street_id"
                      options={
                        streetsData?.streets
                          ?.filter(
                            (street: any) => street.city?.id === values.city_id
                          )
                          .map((street: any) => ({
                            value: street.id,
                            label: street.name,
                          })) || []
                      }
                      disabled={loading || !values.city_id}
                    />

                    <DatePicker
                      label="Birthday"
                      value={values.birthday}
                      onChange={(date) => setFieldValue("birthday", date)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          disabled: loading,
                        },
                      }}
                    />
                  </Box>
                </Form>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 1,
                    mt: 2,
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={handleClose}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting || !isValid}
                    form="edit-client-form"
                  >
                    {isSubmitting ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Update Client"
                    )}
                  </Button>
                </Box>
              </>
            )}
          </Formik>
        </Dialog.Content>
      </Dialog>
    </LocalizationProvider>
  );
}
