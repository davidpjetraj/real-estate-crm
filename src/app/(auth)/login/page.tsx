"use client";
import React, { useTransition } from "react";
import { Alert, Button, Container, Grid } from "@mui/material";
import { Formik, Form } from "formik";
import useAuth from "../../../../store/useAuth";
import { useRouter } from "next/navigation";
import { Input, yup } from "@/components/Form";
import { LoadingButton } from "@/components/LoadingButton";
import Link from "next/link";

export default function PageContent() {
  const { login, error } = useAuth((state) => state);

  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  return (
    <Container maxWidth="md">
      <h1>Welcome back!</h1>

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
            .required("Required field")
            .email("Email is invalid")
            .nullable(),
          password: yup.string().required("Required field").nullable(),
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
                <Input name="email" type="text" label="Email" />
              </Grid>
              <Grid size={12}>
                <Input name="password" type="password" label="Password" />
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
                  Forgot password?
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
                  Login
                </LoadingButton>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Container>
  );
}
