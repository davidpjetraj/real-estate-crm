"use client";

import { Box, styled } from "@mui/material";
import React from "react";
import AppLayout from "./AppLayout";
import ThemeSwitcher from "../ThemeSwitcher";
import Profile from "../Profile";

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
  showProfile?: boolean;
  topBarActions?: React.ReactNode;
}

export default function PageLayout({
  children,
  title,
  icon,
  showDate = false,
  showProfile = true,
  topBarActions,
}: PageLayoutProps) {
  return (
    <AppLayout>
      <Content>
        <TopBar>
          <div className="icon">{icon}</div>
          <h1>{title}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <ThemeSwitcher />
            {topBarActions || (showProfile && <Profile />)}
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
