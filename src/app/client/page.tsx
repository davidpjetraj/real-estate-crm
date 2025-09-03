"use client";

import { Container, Typography } from "@mui/material";
import AppLayout from "@/components/Layout/AppLayout";

export default function ClientPage() {
  return (
    <AppLayout>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ mb: 2 }}>
          Client
        </Typography>
        <Typography color="text.secondary">Coming soon…</Typography>
      </Container>
    </AppLayout>
  );
}
