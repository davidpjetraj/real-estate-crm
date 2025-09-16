"use client";

import React, { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { styled } from "@mui/material";
import Sidebar from "../Sidebar";
import { SettingsProvider } from "../settings";

interface AppLayoutProps {
  children: ReactNode;
}

const Wrapper = styled("div")`
  display: flex;
  height: 100vh;
  gap: 10px;
  padding: 16px;
  ${({ theme }) => theme.breakpoints.down("lg")} {
    padding: 0;
    height: 100%;
    gap: 0;
  }
`;

const MainWrapper = styled("div")`
  display: flex;
  position: relative;
  width: 100%;
  height: 100%;
  flex-direction: column;
  overflow: hidden;
  z-index: 10;
`;

const defaultSettings = {
  themeMode: "dark" as const,
  themeDirection: "ltr" as const,
  themeColorPresets: "default",
  themeStretch: false,
  themeLayout: "vertical" as const,
  open: true,
  helpCenter: false,
};

export default function AppLayout({ children }: AppLayoutProps) {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { getTokens } = await import("@/lib/graphql/utils");
      const { access_token } = await getTokens();
      if (!access_token) {
        router.push("/login");
      }
    };
    checkAuth();
  }, [router]);

  return (
    <SettingsProvider defaultSettings={defaultSettings}>
      <Wrapper>
        <Sidebar />
        <MainWrapper>{children}</MainWrapper>
      </Wrapper>
    </SettingsProvider>
  );
}
