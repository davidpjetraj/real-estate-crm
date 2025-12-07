"use client";

import { Box, styled } from "@mui/material";
import React from "react";
import ThemeSwitcher from "../ThemeSwitcher";
import Profile from "../Profile";
import Inbox from "../Inbox";

const Wrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

const Content = styled(Box)`
  flex: 1;
  min-width: 0;
  padding: 10px;
  background-color: ${({ theme }) => theme.palette.background.paper};
  overflow: auto;
`;

const TopBar = styled("div")`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;
  height: 64px;
  padding: 0 16px;
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
  showDate?: boolean;
  showProfile?: boolean;
  topBarActions?: React.ReactNode;
}

export default function PageLayout({
  children,
  title,
  showDate = false,
  showProfile = true,
  topBarActions,
}: PageLayoutProps) {
  return (
    <Wrapper>
      <Content>
        <TopBar>
          <h1>{title}</h1>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginLeft: "auto",
            }}
          >
            <ThemeSwitcher />
            <Inbox />
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
    </Wrapper>
  );
}
