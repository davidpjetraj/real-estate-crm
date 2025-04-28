"use client";
import { styled, TextField, Button, Typography, Link } from "@mui/material";
import React from "react";

const Wrapper = styled("div")`
  flex: 3;
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 32px;

  @media screen and ((min-width: 550px) and (max-width: 960px)) {
    flex: 1;
  }

  .MuiFormLabel-root.MuiInputLabel-root.Mui-focused {
    color: #525252;
  }
  .MuiFormLabel-root.MuiInputLabel-root.Mui-error {
    color: red;
  }
  .MuiInputBase-root.MuiFilledInput-root.Mui-focused {
    border: 2px solid #252525;
    border-radius: 12px;
  }

  .MuiInputBase-input.MuiFilledInput-input:-webkit-autofill {
    border-radius: inherit;
  }

  @media (max-width: 960px) {
    width: 100%;
  }
`;

export default function SignUp() {
  return (
    <Wrapper>
      <h2>Create an Account</h2>
      <TextField label="Full Name" variant="filled" fullWidth type="text" />
      <TextField label="Email" variant="filled" fullWidth type="email" />
      <TextField label="Password" variant="filled" fullWidth type="password" />
      <TextField
        label="Confirm Password"
        variant="filled"
        fullWidth
        type="password"
      />
      <Button
        variant="contained"
        sx={{
          backgroundColor: "#252525",
          borderRadius: "12px",
          padding: "10px 0",
          fontWeight: 600,
          "&:hover": {
            backgroundColor: "#3a3a3a",
          },
        }}
      >
        Sign Up
      </Button>

      {/* Login link */}
      <Typography variant="body2" sx={{ textAlign: "center" }}>
        Already have an account?{" "}
        <Link href="/" underline="hover" sx={{ fontWeight: 600 }}>
          Log In
        </Link>
      </Typography>
    </Wrapper>
  );
}
