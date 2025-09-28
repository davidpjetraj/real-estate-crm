"use client";

import "./globals.css";
import { ReactNode } from "react";
import ApolloWrapper from "@/lib/graphql/ApolloWrapper";
import { CssBaseline } from "@mui/material";
import { CustomThemeProvider } from "@/components/ThemeSwitcher";
import { ConfigProvider } from "@/components/ConfigProvider";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NuqsAdapter>
          <CustomThemeProvider>
            <CssBaseline />
            <ApolloWrapper>
              <ConfigProvider>{children}</ConfigProvider>
            </ApolloWrapper>
          </CustomThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
