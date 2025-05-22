"use client";

import { gql, useMutation } from "@apollo/client";
import { Button, TextField, Box, styled } from "@mui/material";
import Link from "next/link";
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
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      router.push("/dashboard");
    }
  }, []);

  const handleLogin = async () => {
    try {
      const { data } = await login({
        variables: { input: { email, password } },
      });

      if (data?.login) {
        localStorage.setItem("access_token", data.login);
        window.location.href = "/dashboard";
      } else {
        console.warn("Login succeeded but returned nothing.");
      }
    } catch (error: any) {
      console.error("Login error:", error.message);
      alert("Login failed: " + error.message);
    }
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
    <>
      <Wrapper>
        <Box sx={{ p: 4, maxWidth: 400, mx: "auto" }}>
          <h1>Mirë se erdhët përsëri!</h1>
          <TextField
            label="Email"
            fullWidth
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            fullWidth
            variant="outlined"
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

          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            onClick={handleLogin}
          >
            Vazhdo
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            LinkComponent={Link}
            href="/register"
            sx={{ mt: 2, backgroundColor: "#f50057", borderRadius: "12px" }}
          >
            Nuk keni llogari? Regjistrohuni
          </Button>
        </Box>
      </Wrapper>
    </>
  );
}
