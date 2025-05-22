"use client";

import "./globals.css";
import { ReactNode } from "react";
import { ApolloProvider } from "@apollo/client";
import { client } from "@/lib/apollo-client";
import { Container } from "@mui/material";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Container maxWidth="lg">
          <ApolloProvider client={client}>{children}</ApolloProvider>
        </Container>
      </body>
    </html>
  );
}
