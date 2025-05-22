"use client";

import { Grid, styled } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Wrapper = styled("div")`
  .left {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100vh;
    .header {
      text-align: center;
      margin: 0 auto;
      border: 1px solid #ccc;
      padding: 20px;
      border-radius: 50px;
      justify-content: center;
      align-items: center;
      display: flex;

      flex-direction: column;
      background-color: #f9f9f9;
      h1 {
        font-size: 42px;
        font-weight: 700;
        text-wrap: balance;
      }
    }
    .content {
      text-align: center;
      margin: 0 auto;
      padding: 20px;
      border-radius: 50px;
      background-color: #f9f9f9;
      margin-top: 20px;
    }
    p {
      font-size: 28px;
      font-weight: 400;
      margin-top: 20px;
    }
    a {
      color: #0070f3;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }

  @media (max-width: 600px) {
    .header {
      h1 {
        font-size: 32px;
      }
    }
    p {
      font-size: 20px;
    }
    a {
      font-size: 28px;
    }
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      router.push("/dashboard");
    }
  }, []);
  return (
    <Wrapper>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <div className="left">
            <div className="header">
              <h1>Welcome back to the Real Estate Dashboard</h1>
            </div>
            <div className="content">
              <p>
                If you are not logged in, please{" "}
                <Link href="/login">login</Link> to access your dashboard.
              </p>
              <p>
                If you dont have an account, please{" "}
                <Link href="/register">register</Link> to create one.
              </p>
            </div>
          </div>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <div className="right">
            <img src="/image.png" />
          </div>
        </Grid>
      </Grid>
    </Wrapper>
  );
}
