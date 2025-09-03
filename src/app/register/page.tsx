"use client";

import { gql, useMutation } from "@apollo/client";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  styled,
  TextField,
  CircularProgress,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
`;

const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      access_token
      refresh_token
    }
  }
`;

const validationSchema = Yup.object({
  first_name: Yup.string()
    .min(2, "Emri duhet të ketë të paktën 2 karaktere")
    .required("Emri është i detyrueshëm"),
  last_name: Yup.string()
    .min(2, "Mbiemri duhet të ketë të paktën 2 karaktere")
    .required("Mbiemri është i detyrueshëm"),
  email: Yup.string()
    .email("Email-i nuk është i vlefshëm")
    .required("Email-i është i detyrueshëm"),
  password: Yup.string()
    .min(6, "Fjalëkalimi duhet të ketë të paktën 6 karaktere")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Fjalëkalimi duhet të përmbajë të paktën një shkronjë të vogël, një të madhe dhe një numër"
    )
    .required("Fjalëkalimi është i detyrueshëm"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Fjalëkalimet nuk përputhen")
    .required("Konfirmimi i fjalëkalimit është i detyrueshëm"),
});

export default function RegisterPage() {
  const [register, { loading, error }] = useMutation(REGISTER_MUTATION);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const { data } = await register({
          variables: {
            input: {
              first_name: values.first_name,
              last_name: values.last_name,
              email: values.email,
              password: values.password,
            },
          },
        });
        if (data?.register?.access_token) {
          localStorage.setItem("access_token", data.register.access_token);
          localStorage.setItem("refresh_token", data.register.refresh_token);
          router.push("/dashboard");
        }
      } catch (error: unknown) {
        console.error("Registration error:", error);
        // Error is handled by Apollo Client and displayed via the error state
      }
    },
  });

  return (
    <Wrapper>
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{ p: 4, maxWidth: 400, mx: "auto" }}
      >
        <h1>Regjistrohu</h1>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error.message}
          </Alert>
        )}

        <TextField
          label="Emri"
          fullWidth
          margin="normal"
          name="first_name"
          value={formik.values.first_name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.first_name && Boolean(formik.errors.first_name)}
          helperText={formik.touched.first_name && formik.errors.first_name}
          disabled={loading}
        />

        <TextField
          label="Mbiemri"
          fullWidth
          margin="normal"
          name="last_name"
          value={formik.values.last_name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.last_name && Boolean(formik.errors.last_name)}
          helperText={formik.touched.last_name && formik.errors.last_name}
          disabled={loading}
        />

        <TextField
          label="Email"
          fullWidth
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
          label="Fjalëkalimi"
          type={showPassword ? "text" : "password"}
          fullWidth
          margin="normal"
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
                  disabled={loading}
                  edge="start"
                  sx={{
                    position: "absolute",
                    right: 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Konfirmo Fjalëkalimin"
          type={showConfirmPassword ? "text" : "password"}
          fullWidth
          margin="normal"
          name="confirmPassword"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.confirmPassword &&
            Boolean(formik.errors.confirmPassword)
          }
          helperText={
            formik.touched.confirmPassword && formik.errors.confirmPassword
          }
          disabled={loading}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle confirm password visibility"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  onMouseDown={(e) => e.preventDefault()}
                  disabled={loading}
                  edge="start"
                  sx={{
                    position: "absolute",
                    right: 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          variant="contained"
          fullWidth
          type="submit"
          disabled={loading || !formik.isValid}
          sx={{ mt: 2, borderRadius: "12px" }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Regjistrohuni"
          )}
        </Button>
      </Box>
    </Wrapper>
  );
}
