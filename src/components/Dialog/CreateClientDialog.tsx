"use client";

import { useMutation, useQuery } from "@apollo/client";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Button, TextField, Box, CircularProgress, Alert } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { Dialog } from "./Dialog";
import { Select } from "@/components/Form/Select";
import {
  CreateClientDocument,
  StatesDocument,
  CitiesDocument,
  StreetsDocument,
} from "@/lib/graphql/generated/graphql";

interface CreateClientDialogProps {
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
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one lowercase letter, one uppercase letter, and one number"
    )
    .required("Password is required"),
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

export default function CreateClientDialog({
  open,
  onClose,
  onSuccess,
}: CreateClientDialogProps) {
  const [createClient, { loading, error }] = useMutation(CreateClientDocument);

  // Fetch states
  const { data: statesData } = useQuery(StatesDocument, {
    variables: { input: {} },
  });

  // Fetch cities (will be filtered by selected state)
  const { data: citiesData } = useQuery(CitiesDocument, {
    variables: { input: {} },
  });

  // Fetch streets (will be filtered by selected city)
  const { data: streetsData } = useQuery(StreetsDocument, {
    variables: { input: {} },
  });

  const initialValues = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone: "",
    birthday: null as dayjs.Dayjs | null,
    state_id: "",
    city_id: "",
    street_id: "",
  };

  const handleSubmit = async (
    values: typeof initialValues,
    { resetForm }: any
  ) => {
    try {
      const { data } = await createClient({
        variables: {
          input: {
            first_name: values.first_name,
            last_name: values.last_name,
            email: values.email,
            password: values.password,
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

      if (data?.createClient) {
        // Add the new client to the store
        if (onSuccess) {
          onSuccess(data.createClient);
        }

        // Reset form
        resetForm();

        // Close dialog
        onClose();
      }
    } catch (error: unknown) {
      console.error("Create client error:", error);
      // Error is handled by Apollo Client and displayed via the error state
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} setOpen={handleClose}>
        <Dialog.Title title="Add Client" onClose={handleClose} />
        <Dialog.Content>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, isValid, isSubmitting }) => (
              <>
                <Form id="client-form">
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    {error && (
                      <Alert severity="error" sx={{ mb: 2 }}>
                        {error.message}
                      </Alert>
                    )}

                    <Field
                      as={TextField}
                      label="First Name"
                      fullWidth
                      name="first_name"
                      disabled={loading}
                      required
                    />

                    <Field
                      as={TextField}
                      label="Last Name"
                      fullWidth
                      name="last_name"
                      disabled={loading}
                      required
                    />

                    <Field
                      as={TextField}
                      label="Email"
                      fullWidth
                      name="email"
                      type="email"
                      disabled={loading}
                      required
                    />

                    <Field
                      as={TextField}
                      label="Password"
                      fullWidth
                      name="password"
                      type="password"
                      disabled={loading}
                      required
                    />

                    <Field
                      as={TextField}
                      label="Phone"
                      fullWidth
                      name="phone"
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
                      label="Birthday (Optional)"
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
                    form="client-form"
                  >
                    {isSubmitting ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Add Client"
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
