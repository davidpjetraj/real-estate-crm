"use client";

import { gql, useMutation } from "@apollo/client";
import { Button, TextField, Typography, Box } from "@mui/material";
import { useState } from "react";

const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input)
  }
`;

// const VERIFY_LOGIN = gql`
//   mutation VerifyLogin($input: VerifyLoginInput!) {
//     verifyLogin(input: $input) {
//       access_token
//       refresh_token
//     }
//   }
// `;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  //   const [code, setCode] = useState("");
  //   const [showVerify, setShowVerify] = useState(false);
  const [login] = useMutation(LOGIN_MUTATION);
  const [password, setPassword] = useState("");
  //   const [verifyLogin] = useMutation(VERIFY_LOGIN);

  const handleLogin = async () => {
    await login({ variables: { input: { email, password } } });
    // setShowVerify(true);
  };

  // const handleVerify = async () => {
  //   const { data } = await verifyLogin({
  //     variables: { input: { email, password } },
  //   });
  //   localStorage.setItem("access_token", data.verifyLogin.access_token);
  //   localStorage.setItem("refresh_token", data.verifyLogin.refresh_token);
  //   window.location.href = "/dashboard";
  // };

  return (
    <Box sx={{ p: 4, maxWidth: 400, mx: "auto" }}>
      <Typography variant="h5" mb={2}>
        Login
      </Typography>
      <TextField
        label="Email"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Password"
        fullWidth
        margin="normal"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      {/* {showVerify ? (
        <>
          <TextField
            label="Verification Code"
            fullWidth
            margin="normal"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <Button variant="contained" fullWidth onClick={handleVerify}>
            Verify
          </Button>
        </>
      ) : (
        <Button variant="contained" fullWidth onClick={handleLogin}>
          Send Code
        </Button>
      )} */}

      <Button variant="contained" fullWidth onClick={handleLogin}>
        Login
      </Button>
    </Box>
  );
}
