"use client";

import { Alert, Button, Grid } from "@mui/material";
import { Form, Formik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useTransition } from "react";
import * as yup from "yup";
import { useShallow } from "zustand/shallow";
import useAuth from "../../../store/useAuth";
import { CodeInput } from "@/components/CodeInput";
import { LoadingButton } from "@/components/LoadingButton";
import Link from "@/components/Link";

export default function PageContent() {
  const { verify } = useAuth(useShallow((state) => state));

  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const searchParams = useSearchParams();
  const [error, setError] = React.useState<string>("");

  return (
    <>
      <h1 className="has-paragraph">E-Mail prüfen</h1>
      <p>
        Geben Sie den 4-stelligen Code ein, den wir Ihnen per E-Mail gesendet
        haben
      </p>

      <Formik
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await verify({
              token: searchParams.get("token") as string,
              code: values.code,
              startVerify: async (path: string) => {
                startTransition(() => {
                  router.push(`${path}`);
                });
              },
            });
            setError("");
          } catch (error: any) {
            setError(error.message);
          }
          setSubmitting(false);
        }}
        initialValues={{
          code: "",
        }}
        validationSchema={yup.object({
          code: yup.string().required("Pflichtfeld").nullable(),
        })}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form>
            <Grid container spacing={3}>
              {error && (
                <Grid size={12}>
                  <Alert severity="error">{error}</Alert>
                </Grid>
              )}

              <Grid size={12}>
                <CodeInput onChange={(code) => setFieldValue("code", code)} />
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
                  Verifizieren
                </LoadingButton>
              </Grid>
              <Grid size={12}>
                <Button
                  type="submit"
                  variant="text"
                  color="primary"
                  size="large"
                  component={Link}
                  href="/login"
                  fullWidth
                  sx={{
                    marginTop: "-8px",
                  }}
                >
                  Zurück
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </>
  );
}
