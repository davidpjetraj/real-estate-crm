"use client";
import React, { useTransition } from "react";
import { Alert, Button, Grid } from "@mui/material";
import { Formik, Form } from "formik";
import useAuth from "../../../store/useAuth";
import { useRouter } from "next/navigation";
import { Input, yup } from "@/components/Form";
import { LoadingButton } from "@/components/LoadingButton";
import Link from "next/link";

export default function PageContent() {
  const { login, error } = useAuth((state) => state);

  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  return (
    <>
      <h1>Willkommen zurück!</h1>

      <Formik
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await login({
              email: values.email,
              password: values.password,
              startVerify: async (token: string) => {
                startTransition(() => {
                  router.replace(
                    `/verify?token=${token}&returnUrl=${encodeURIComponent(
                      window.location.href
                    )}`
                  );
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
            .required("Pflichtfeld")
            .email("E-Mail ist ungültig")
            .nullable(),
          password: yup.string().required("Pflichtfeld").nullable(),
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

              <Grid size={12}>
                <Input name="email" type="text" label="E-Mail" />
              </Grid>
              <Grid size={12}>
                <Input name="password" type="password" label="Passwort" />
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
                  Passwort vergessen?
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
                  Weiter
                </LoadingButton>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </>
  );
}
