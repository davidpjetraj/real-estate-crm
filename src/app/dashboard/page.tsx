"use client";

import Sidebar from "@/components/Sidebar";
import { Box, Button, styled } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";

const Wrapper = styled("div")`
  padding: 24px;
  min-height: 100vh;
  box-sizing: border-box;
`;

const LayoutRow = styled("div")`
  display: flex;
  gap: 16px;
  padding: 0;
  min-height: calc(100vh - 48px);
`;

const Content = styled(Box)`
  flex: 1;
  min-width: 0;
  padding: 24px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const TopBar = styled("div")`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
`;

const CenterDate = styled("div")`
  text-align: center;
  color: #6b7280;
  margin: 16px 0 8px;
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
        <LayoutRow>
          <Sidebar />
          <Content>
            <TopBar>
              <div className="icon">
                <DashboardOutlinedIcon />
              </div>
              <h1>Dashboard</h1>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleLogout}
                sx={{ borderRadius: "12px" }}
              >
                Logout
              </Button>
            </TopBar>
            <CenterDate>
              {new Date().toLocaleDateString(undefined, {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </CenterDate>
            <p>Welcome to the dashboard!</p>
            <p>This is a protected route.</p>
            <p>You should be able to see this only if you are logged in.</p>
          </Content>
        </LayoutRow>
      </Wrapper>
    </>
  );
}
