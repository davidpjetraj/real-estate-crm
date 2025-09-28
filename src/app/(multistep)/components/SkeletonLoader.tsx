import { alpha, Box, Container, Grid, Skeleton, styled } from "@mui/material";
import React from "react";

const FadedSkeleton = styled(Skeleton)`
  position: relative;
  border-radius: 4px;
  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: linear-gradient(
      to right,
      ${({ theme }) => theme.palette.divider} 20%,
      ${({ theme }) => alpha(theme.palette.divider, 0.1)} 70%,
      ${({ theme }) => alpha(theme.palette.divider, 0)} 100%
    );
  }
`;

export default function SkeletonLoader() {
  return (
    <Container style={{ maxWidth: "100%" }}>
      <Box className="page-content" sx={{ padding: "16px 0" }}>
        <Grid container spacing={2}>
          <Grid size={12}>
            <FadedSkeleton
              variant="rectangular"
              animation="wave"
              width="30%"
              height={35}
            />
          </Grid>
          <Grid size={12}>
            <Grid container spacing={2} style={{ marginTop: "30px" }}>
              <Grid size={{ xs: 12, md: 3 }}>
                <FadedSkeleton
                  sx={{
                    width: "20%",
                    height: "23px",
                    marginBottom: "16px",
                  }}
                  animation="wave"
                  variant="rectangular"
                />
                <FadedSkeleton
                  sx={{ width: "70%", height: "12px" }}
                  animation="wave"
                  variant="rounded"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 9 }}>
                <div style={{ maxWidth: 900, margin: "0 auto" }}>
                  <FadedSkeleton
                    sx={{
                      width: "20%",
                      height: "23px",
                      marginBottom: "16px",
                    }}
                    animation="wave"
                    variant="rectangular"
                  />
                  <FadedSkeleton
                    sx={{
                      width: "90%",
                      height: "12px",
                      marginBottom: "16px",
                    }}
                    animation="wave"
                    variant="rounded"
                  />
                  <FadedSkeleton
                    sx={{ width: "60%", height: "12px" }}
                    animation="wave"
                    variant="rounded"
                  />
                </div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
