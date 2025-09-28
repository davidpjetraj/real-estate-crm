"use client";

import { useState } from "react";

import { toast } from "sonner";
import { Dialog } from "../Dialog";
import { Form, Formik, FormikProps } from "formik";
import StyledIcon from "../shared/StyledIcon";
import { Alert, Button, Grid } from "@mui/material";
import { CustomizeSelect, yup } from "../Form";
import {
  AdminStatus,
  TeamModel,
  useChangeTeamStatusMutation,
} from "@/lib/graphql/generated/graphql";
import { useTeam } from "../../../store/useTeam";
import { ArrowReloadHorizontalIcon } from "../icons/ArrowReloadHorizontalIcon";
import { teamStatuses } from "../utils/constants";
import { LoadingButton } from "../LoadingButton";

export default function ChangeStatus({
  open,
  setOpen,
  data,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  data?: TeamModel;
}) {
  const { updateItem } = useTeam((state) => state);
  const [changeStatus] = useChangeTeamStatusMutation();

  const [error, setError] = useState<string | null>(null);

  return (
    <>
      <Dialog open={open} maxWidth="xs" onClose={() => setOpen(false)}>
        <Formik
          initialValues={{
            status: data?.status || "",
          }}
          onSubmit={async (values, actions) => {
            try {
              actions.setSubmitting(true);
              await changeStatus({
                variables: {
                  input: {
                    id: data?.id as string,
                    status: values?.status as AdminStatus,
                    deleted: false,
                  },
                },
              });
              toast.success("Status successfully updated!");
              updateItem({
                ...data,
                status: values?.status,
              } as TeamModel);
              actions.setSubmitting(false);
              setOpen(false);
              setError(null);
            } catch (error: any) {
              actions.setSubmitting(false);
              setError(error.message);
            }
          }}
          enableReinitialize
          validationSchema={yup.object({
            status: yup.string().required("Status is required"),
          })}
        >
          {(props: FormikProps<any>) => (
            <>
              <Dialog.Title
                title={
                  <StyledIcon>
                    <ArrowReloadHorizontalIcon />
                  </StyledIcon>
                }
                onClose={() => setOpen(false)}
              />

              <Dialog.Content>
                <h3>Change Status</h3>
                <p>Select and update the current status here.</p>
                <Form onSubmit={props.handleSubmit}>
                  <Grid container spacing={2.5}>
                    {error && (
                      <Grid size={12}>
                        <Alert variant="outlined" severity="error">
                          {error}
                        </Alert>
                      </Grid>
                    )}

                    <Grid size={12}>
                      <CustomizeSelect
                        label="Status"
                        variant="filled"
                        name="status"
                        options={teamStatuses.map((status) => ({
                          ...status,
                          disabled: status.value === AdminStatus.Deactivated,
                        }))}
                        renderAsChips
                      />
                    </Grid>
                  </Grid>
                </Form>
              </Dialog.Content>
              <Dialog.Actions>
                <Button
                  variant="outlined"
                  fullWidth
                  color="inherit"
                  size="large"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <LoadingButton
                  size="large"
                  variant="contained"
                  fullWidth
                  color="primary"
                  type="submit"
                  disabled={props.isSubmitting || !props.dirty}
                  loading={props.isSubmitting}
                  onClick={() => props.handleSubmit()}
                >
                  Change
                </LoadingButton>
              </Dialog.Actions>
            </>
          )}
        </Formik>
      </Dialog>
    </>
  );
}
