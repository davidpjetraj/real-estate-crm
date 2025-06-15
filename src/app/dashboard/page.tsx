"use client";

// import Sidebar from "@/components/Sidebar";
import { Button, Container, styled } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Wrapper = styled("div")`
  padding: 100px 0;
  .logout {
    position: absolute;
    top: 20px;
    right: 200px;
  }
`;

export default function Dashboard() {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    router.push("/login");
  };

  return (
    <>
      <Wrapper>
        <Container maxWidth="lg">
          <h1>Dashboard</h1>
          <p>Welcome to the dashboard!</p>
          <p>This is a protected route.</p>
          <p>You should be able to see this only if you are logged in.</p>
          <div className="logout">
            <Button
              variant="contained"
              color="secondary"
              onClick={handleLogout}
              sx={{ mt: 4, borderRadius: "12px" }}
            >
              Logout
            </Button>
          </div>
        </Container>
      </Wrapper>
      {/* <Sidebar /> */}
    </>
  );
}
