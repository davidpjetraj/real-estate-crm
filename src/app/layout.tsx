"use client";

import "./globals.css";
import { ReactNode } from "react";
import ApolloWrapper from "@/lib/graphql/ApolloWrapper";
import { CssBaseline } from "@mui/material";
import { CustomThemeProvider } from "@/components/ThemeSwitcher";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CustomThemeProvider>
          <CssBaseline />
          <ApolloWrapper>{children}</ApolloWrapper>
        </CustomThemeProvider>
      </body>
    </html>
  );
}
