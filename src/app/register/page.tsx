"use client";

import { gql, useMutation } from "@apollo/client";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Button, styled, TextField } from "@mui/material";

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
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function RegisterPage() {
  const [register] = useMutation(REGISTER_MUTATION);

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const { data } = await register({ variables: { input: values } });
        if (data?.register?.access_token) {
          localStorage.setItem("access_token", data.register.access_token);
          localStorage.setItem("refresh_token", data.register.refresh_token);
          window.location.href = "/dashboard";
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          alert("Registration error: " + error.message);
        } else {
          alert("Registration failed: An unknown error occurred.");
        }
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

        <TextField
          label="First Name"
          fullWidth
          margin="normal"
          name="first_name"
          value={formik.values.first_name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.first_name && Boolean(formik.errors.first_name)}
          helperText={formik.touched.first_name && formik.errors.first_name}
        />

        <TextField
          label="Last Name"
          fullWidth
          margin="normal"
          name="last_name"
          value={formik.values.last_name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.last_name && Boolean(formik.errors.last_name)}
          helperText={formik.touched.last_name && formik.errors.last_name}
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
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          name="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />

        <Button
          variant="contained"
          fullWidth
          type="submit"
          sx={{ mt: 2, borderRadius: "12px" }}
        >
          Regjistrohuni
        </Button>
      </Box>
    </Wrapper>
  );
}
