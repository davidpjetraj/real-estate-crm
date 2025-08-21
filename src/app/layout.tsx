"use client";

import "./globals.css";
import { ReactNode } from "react";
import { ApolloProvider } from "@apollo/client";
import { client } from "@/lib/apollo-client";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { darkTheme } from "@/lib/theme";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <ApolloProvider client={client}>{children}</ApolloProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
