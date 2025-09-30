"use client";

import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Button,
  TextField,
  Box,
  CircularProgress,
  Alert,
  Typography,
  Divider,
} from "@mui/material";
import { Dialog } from "./Dialog";
import { Select } from "@/components/Form/Select";
import {
  useCreateRequestMutation,
  useStatesQuery,
  useCitiesQuery,
  useStreetsQuery,
  useClientsQuery,
  useTeamsQuery,
} from "@/lib/graphql/generated/graphql";

interface CreateRequestDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (item: any) => void;
}

const validationSchema = Yup.object({
  client_id: Yup.string().optional(),
  client_type: Yup.string().optional(),
  type: Yup.string().oneOf(["to_buy", "to_rent"]).optional(),
  state_id: Yup.string().optional(),
  city_id: Yup.string().optional(),
  street_id: Yup.string().optional(),
  payment_method: Yup.string().optional(),
  assignee_id: Yup.string().optional(),
  surface_min: Yup.number().min(0).optional(),
  surface_max: Yup.number().min(0).optional(),
  floor_min: Yup.number().integer().optional(),
  floor_max: Yup.number().integer().optional(),
  rooms_min: Yup.number().integer().min(0).optional(),
  rooms_max: Yup.number().integer().min(0).optional(),
  phone: Yup.string().optional(),
  message: Yup.string().optional(),
  budget: Yup.number().min(0).optional(),
  budget_type: Yup.string().oneOf(["full", "m2", "acre", "area"]).optional(),
  source: Yup.string().optional(),
});

const paymentMethods = ["cash", "bank_transfer", "mortgage", "installment"];
const clientTypes = ["individual", "company"];
const sources = [
  "website",
  "phone",
  "email",
  "social_media",
  "referral",
  "other",
];

export default function CreateRequestDialog({
  open,
  onClose,
  onSuccess,
}: CreateRequestDialogProps) {
  const [createRequest, { loading, error }] = useCreateRequestMutation();

  const { data: statesData } = useStatesQuery({
    variables: { input: {} },
  });

  const { data: citiesData } = useCitiesQuery({
    variables: { input: {} },
  });

  const { data: streetsData } = useStreetsQuery({
    variables: { input: {} },
  });

  const { data: clientsData } = useClientsQuery({
    variables: { input: { limit: 100 } },
  });

  const { data: teamsData } = useTeamsQuery({
    variables: { input: { limit: 100 } },
  });

  const initialValues = {
    client_id: "",
    client_type: "",
    type: "",
    state_id: "",
    city_id: "",
    street_id: "",
    payment_method: "",
    assignee_id: "",
    surface_min: "" as string | number,
    surface_max: "" as string | number,
    floor_min: "" as string | number,
    floor_max: "" as string | number,
    rooms_min: "" as string | number,
    rooms_max: "" as string | number,
    phone: "",
    message: "",
    budget: "" as string | number,
    budget_type: "",
    source: "",
  };

  const handleSubmit = async (
    values: typeof initialValues,
    { resetForm }: any
  ) => {
    try {
      const { data } = await createRequest();

      if (data?.createRequest) {
        if (onSuccess) {
          onSuccess(data.createRequest);
        }
        resetForm();
        onClose();
      }
    } catch (error: unknown) {
      console.error("Create request error:", error);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={open} setOpen={handleClose} maxWidth="md" fullWidth>
      <Dialog.Title title="Create Request" onClose={handleClose} />
      <Dialog.Content>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, isValid, isSubmitting }) => (
            <>
              <Form id="request-form">
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {error.message}
                    </Alert>
                  )}

                  {/* Client Information */}
                  <Box>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      fontWeight={600}
                    >
                      Client Information
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      <Box sx={{ display: "flex", gap: 2 }}>
                        <Box sx={{ flex: 1 }}>
                          <Select
                            label="Client"
                            name="client_id"
                            options={
                              clientsData?.clients?.edges?.map((edge: any) => ({
                                value: edge.node.id,
                                label: edge.node.name,
                              })) || []
                            }
                            disabled={loading}
                          />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Select
                            label="Client Type"
                            name="client_type"
                            options={clientTypes.map((type) => ({
                              value: type,
                              label:
                                type.charAt(0).toUpperCase() + type.slice(1),
                            }))}
                            disabled={loading}
                          />
                        </Box>
                      </Box>

                      <Field
                        as={TextField}
                        label="Phone"
                        fullWidth
                        name="phone"
                        disabled={loading}
                      />
                    </Box>
                  </Box>

                  {/* Request Type */}
                  <Box>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      fontWeight={600}
                    >
                      Request Type
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      <Box sx={{ display: "flex", gap: 2 }}>
                        <Box sx={{ flex: 1 }}>
                          <Select
                            label="Type"
                            name="type"
                            options={[
                              { value: "to_buy", label: "To Buy" },
                              { value: "to_rent", label: "To Rent" },
                            ]}
                            disabled={loading}
                          />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Select
                            label="Source"
                            name="source"
                            options={sources.map((source) => ({
                              value: source,
                              label:
                                source.charAt(0).toUpperCase() +
                                source.slice(1).replace("_", " "),
                            }))}
                            disabled={loading}
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  {/* Location */}
                  <Box>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      fontWeight={600}
                    >
                      Location
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
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
                          setFieldValue("street_id", "");
                        }}
                      />

                      <Select
                        label="Street"
                        name="street_id"
                        options={
                          streetsData?.streets
                            ?.filter(
                              (street: any) =>
                                street.city?.id === values.city_id
                            )
                            .map((street: any) => ({
                              value: street.id,
                              label: street.name,
                            })) || []
                        }
                        disabled={loading || !values.city_id}
                      />
                    </Box>
                  </Box>

                  {/* Specifications */}
                  <Box>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      fontWeight={600}
                    >
                      Specifications
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      <Box sx={{ display: "flex", gap: 2 }}>
                        <Field
                          as={TextField}
                          label="Min Surface (m²)"
                          fullWidth
                          name="surface_min"
                          type="number"
                          disabled={loading}
                        />
                        <Field
                          as={TextField}
                          label="Max Surface (m²)"
                          fullWidth
                          name="surface_max"
                          type="number"
                          disabled={loading}
                        />
                      </Box>

                      <Box sx={{ display: "flex", gap: 2 }}>
                        <Field
                          as={TextField}
                          label="Min Floor"
                          fullWidth
                          name="floor_min"
                          type="number"
                          disabled={loading}
                        />
                        <Field
                          as={TextField}
                          label="Max Floor"
                          fullWidth
                          name="floor_max"
                          type="number"
                          disabled={loading}
                        />
                      </Box>

                      <Box sx={{ display: "flex", gap: 2 }}>
                        <Field
                          as={TextField}
                          label="Min Rooms"
                          fullWidth
                          name="rooms_min"
                          type="number"
                          disabled={loading}
                        />
                        <Field
                          as={TextField}
                          label="Max Rooms"
                          fullWidth
                          name="rooms_max"
                          type="number"
                          disabled={loading}
                        />
                      </Box>
                    </Box>
                  </Box>

                  {/* Budget */}
                  <Box>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      fontWeight={600}
                    >
                      Budget
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      <Box sx={{ display: "flex", gap: 2 }}>
                        <Field
                          as={TextField}
                          label="Budget"
                          fullWidth
                          name="budget"
                          type="number"
                          disabled={loading}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Select
                            label="Budget Type"
                            name="budget_type"
                            options={[
                              { value: "full", label: "Full" },
                              { value: "m2", label: "Per m²" },
                              { value: "acre", label: "Per Acre" },
                              { value: "area", label: "Per Area" },
                            ]}
                            disabled={loading}
                          />
                        </Box>
                      </Box>

                      <Select
                        label="Payment Method"
                        name="payment_method"
                        options={paymentMethods.map((method) => ({
                          value: method,
                          label:
                            method.charAt(0).toUpperCase() +
                            method.slice(1).replace("_", " "),
                        }))}
                        disabled={loading}
                      />
                    </Box>
                  </Box>

                  {/* Assignment */}
                  <Box>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      fontWeight={600}
                    >
                      Assignment
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Select
                      label="Assignee"
                      name="assignee_id"
                      options={
                        teamsData?.teams?.edges?.map((edge: any) => ({
                          value: edge.node.id,
                          label: edge.node.name,
                        })) || []
                      }
                      disabled={loading}
                    />
                  </Box>

                  {/* Additional Info */}
                  <Box>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      fontWeight={600}
                    >
                      Additional Information
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Field
                      as={TextField}
                      label="Message"
                      fullWidth
                      name="message"
                      multiline
                      rows={4}
                      disabled={loading}
                    />
                  </Box>
                </Box>
              </Form>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 1,
                  mt: 3,
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
                  form="request-form"
                >
                  {isSubmitting ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Create Request"
                  )}
                </Button>
              </Box>
            </>
          )}
        </Formik>
      </Dialog.Content>
    </Dialog>
  );
}
