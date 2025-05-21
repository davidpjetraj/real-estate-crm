"use client";

import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";

const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      access_token
      refresh_token
    }
  }
`;

export default function RegisterPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [register] = useMutation(REGISTER_MUTATION);

  const handleSubmit = async () => {
    const { data } = await register({ variables: { input: form } });
    localStorage.setItem("access_token", data.register.access_token);
    localStorage.setItem("refresh_token", data.register.refresh_token);
    window.location.href = "/dashboard";
  };

  return (
    <Box sx={{ p: 4, maxWidth: 400, mx: "auto" }}>
      <Typography variant="h5" mb={2}>
        Register
      </Typography>
      <TextField
        label="Email"
        fullWidth
        margin="normal"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <Button variant="contained" fullWidth onClick={handleSubmit}>
        Register
      </Button>
    </Box>
  );
}
