"use client";

import { Container, Typography } from "@mui/material";

export default function PropertyPage() {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ mb: 2 }}>
        Property
      </Typography>
      <Typography color="text.secondary">Coming soon…</Typography>
    </Container>
  );
}
