"use client";
import React, { useTransition } from "react";
import { Alert, Button, Container, Grid } from "@mui/material";
import { Formik, Form } from "formik";
import useAuth from "../../../store/useAuth";
import { useRouter } from "next/navigation";
import { Input, yup } from "@/components/Form";
import { LoadingButton } from "@/components/LoadingButton";
import Link from "@/components/Link";

export default function PageContent() {
  const { login, error } = useAuth((state) => state);

  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  return (
    <>
      <h1>Mirëseerdhët përsëri!</h1>

      <Formik
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await login({
              email: values.email,
              password: values.password,
              startVerify: async (path: string) => {
                startTransition(() => {
                  router.replace(path);
                });
              },
            });
            setSubmitting(false);
          } catch (error: any) {
            console.log(error);
            setSubmitting(false);
          }
        }}
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={yup.object({
          email: yup
            .string()
            .required("Fushë e kërkuar")
            .email("E-maili nuk është valid")
            .nullable(),
          password: yup.string().required("Fushë e kërkuar").nullable(),
        })}
      >
        {({ isSubmitting }) => (
          <Form>
            <Grid container spacing={3}>
              {error && (
                <Grid size={12}>
                  <Alert severity="error">{error}</Alert>
                </Grid>
              )}
              <Container>
                <Grid size={12}>
                  <Input name="email" type="text" label="E-mail" />
                </Grid>
                <Grid size={12}>
                  <Input name="password" type="password" label="Fjalëkalimi" />
                </Grid>
                <Grid size={12} textAlign="right">
                  <Button
                    type="submit"
                    variant="text"
                    color="primary"
                    size="medium"
                    component={Link}
                    href="/forgot-password"
                    sx={{
                      margin: "-12px 0 ",
                    }}
                  >
                    Keni harruar fjalekalimin?
                  </Button>
                </Grid>

                <Grid size={12}>
                  <LoadingButton
                    type="submit"
                    loading={isSubmitting || isPending}
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                  >
                    Vazhdo
                  </LoadingButton>
                </Grid>
              </Container>
            </Grid>
          </Form>
        )}
      </Formik>
    </>
  );
}
