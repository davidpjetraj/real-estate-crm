"use client";

import { Box, Button, styled } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";
import AppLayout from "./AppLayout";
import ThemeSwitcher from "../ThemeSwitcher";

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

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  icon: React.ReactNode;
  showDate?: boolean;
  showLogout?: boolean;
  topBarActions?: React.ReactNode;
}

export default function PageLayout({
  children,
  title,
  icon,
  showDate = false,
  showLogout = false,
  topBarActions,
}: PageLayoutProps) {
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
          <div className="icon">{icon}</div>
          <h1>{title}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <ThemeSwitcher />
            {topBarActions ||
              (showLogout && (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleLogout}
                  sx={{ borderRadius: "12px" }}
                >
                  Logout
                </Button>
              ))}
          </div>
        </TopBar>
        {showDate && (
          <CenterDate>
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </CenterDate>
        )}
        {children}
      </Content>
    </AppLayout>
  );
}
