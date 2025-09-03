"use client";

import { Box, Button, styled } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import AppLayout from "@/components/Layout/AppLayout";

const Content = styled(Box)`
  flex: 1;
  min-width: 0;
  padding: 24px;
  background-color: ${({ theme }) => theme.palette.background.paper};
  border-radius: ${({ theme }) => theme.shape.borderRadius}px;
  border: 1px solid ${({ theme }) => theme.palette.divider};
  box-shadow: none;
  overflow: hidden;
`;

const TopBar = styled("div")`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
`;

const CenterDate = styled("div")`
  text-align: center;
  color: ${({ theme }) => theme.palette.text.secondary};
  margin: 16px 0 8px;
`;

export default function Dashboard() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    router.push("/login");
  };

  return (
    <AppLayout>
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
    </AppLayout>
  );
}
