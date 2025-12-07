"use client";

import { AuthGuard } from "@/components/guard";
import Sidebar from "@/components/Sidebar";
import { SettingsProvider } from "@/components/settings";
import { styled } from "@mui/material";

type Props = {
  children: React.ReactNode;
};

const Wrapper = styled("div")`
  display: flex;
  height: 100dvh;
  width: 100%;
`;

const MainWrapper = styled("div")`
  display: flex;
  position: relative;
  flex: 1;
  height: 100%;
  flex-direction: column;
  overflow: hidden;
  z-index: 10;
`;

export default function DashboardLayout({ children }: Props) {
  return (
    <AuthGuard>
      <SettingsProvider
        defaultSettings={{
          themeMode: "dark",
          themeDirection: "ltr",
          themeColorPresets: "default",
          themeStretch: false,
          themeLayout: "vertical",
          open: true,
          helpCenter: false,
        }}
      >
        <Wrapper>
          <Sidebar />
          <MainWrapper>{children}</MainWrapper>
        </Wrapper>
      </SettingsProvider>
    </AuthGuard>
  );
}
