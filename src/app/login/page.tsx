"use client";

import { gql, useMutation } from "@apollo/client";
import {
  Button,
  TextField,
  Box,
  styled,
  CircularProgress,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

const Wrapper = styled("div")`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  h1 {
    text-align: center;
    font-size: 22px;
    font-weight: 500;
  }
  Button {
    margin-top: 20px;
    border-radius: 12px;
  }
`;

const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input)
  }
`;

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Email-i nuk është i vlefshëm")
    .required("Email-i është i detyrueshëm"),
  password: Yup.string()
    .min(6, "Fjalëkalimi duhet të ketë të paktën 6 karaktere")
    .required("Fjalëkalimi është i detyrueshëm"),
});

export default function LoginPage() {
  const [login, { loading, error }] = useMutation(LOGIN_MUTATION);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const { data } = await login({
          variables: { input: values },
        });

        if (data?.login) {
          localStorage.setItem("access_token", data.login);
          router.push("/dashboard");
        } else {
          console.warn("Login succeeded but returned nothing.");
        }
      } catch (error: unknown) {
        console.error("Login error:", error);
        // Error is handled by Apollo Client and displayed via the error state
      }
    },
  });
  // const handleVerify = async () => {
  //   const { data } = await verifyLogin({
  //     variables: { input: { email, password } },
  //   });
  //   localStorage.setItem("access_token", data.verifyLogin.access_token);
  //   localStorage.setItem("refresh_token", data.verifyLogin.refresh_token);
  //   window.location.href = "/dashboard";
  // };

  return (
    <>
      <Wrapper>
        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          sx={{ p: 4, maxWidth: 400, mx: "auto" }}
        >
          <h1>Mirë se erdhët përsëri!</h1>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error.message}
            </Alert>
          )}

          <TextField
            label="Email"
            fullWidth
            variant="outlined"
            margin="normal"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            disabled={loading}
          />

          <TextField
            label="Password"
            fullWidth
            variant="outlined"
            margin="normal"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            disabled={loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="start"
                    disabled={loading}
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            type="submit"
            disabled={loading || !formik.isValid}
            sx={{ mt: 2 }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Vazhdo"
            )}
          </Button>

          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            LinkComponent={Link}
            href="/register"
            disabled={loading}
            sx={{ mt: 2, backgroundColor: "#f50057", borderRadius: "12px" }}
          >
            Nuk keni llogari? Regjistrohuni
          </Button>
        </Box>
      </Wrapper>
    </>
  );
}
