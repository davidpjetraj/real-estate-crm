"use client";

import "./globals.css";
import { ReactNode } from "react";
import { ApolloProvider } from "@apollo/client";
import { client } from "@/lib/apollo-client";
import { CssBaseline } from "@mui/material";
import { CustomThemeProvider } from "@/components/ThemeSwitcher";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CustomThemeProvider>
          <CssBaseline />
          <ApolloProvider client={client}>{children}</ApolloProvider>
        </CustomThemeProvider>
      </body>
    </html>
  );
}
