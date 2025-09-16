"use client";

import {
  Button,
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  styled,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const HeroSection = styled(Box)`
  padding: 150px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
    opacity: 0.3;
  }
  @media (max-width: 990px) {
    display: flex;
    flex-direction: column;
    padding: 0px;
    padding-top: 40px !important;
    padding-bottom: 40px !important;
  }
`;

const FeatureCard = styled(Card)`
  height: 100%;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 24px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  &:hover {
    transform: translateY(-12px) scale(1.02);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);

    &::before {
      transform: scaleX(1);
    }
  }
`;

const StyledButton = styled(Button)`
  border-radius: 12px;
  padding: 12px 32px;
  font-weight: 600;
  text-transform: none;
  font-size: 16px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const FloatingElement = styled(Box)`
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  animation: float 6s ease-in-out infinite;

  @keyframes float {
    0%,
    100% {
      transform: translateY(0px) rotate(0deg);
    }
    50% {
      transform: translateY(-20px) rotate(180deg);
    }
  }
`;

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { getTokens } = await import("@/lib/graphql/utils");
      const { access_token } = await getTokens();
      if (access_token) {
        router.push("/dashboard");
      }
    };
    checkAuth();
  }, [router]);

  const features = [
    {
      title: "Property Management",
      description:
        "Efficiently manage your real estate portfolio with our comprehensive dashboard. Track properties, tenants, and maintenance all in one place.",
      icon: "🏠",
      color: "#667eea",
    },
    {
      title: "Analytics & Reports",
      description:
        "Get detailed insights and analytics to make informed decisions. Visualize your portfolio performance with interactive charts and reports.",
      icon: "📊",
      color: "#764ba2",
    },
    {
      title: "Team Collaboration",
      description:
        "Work seamlessly with your team using our collaboration tools. Share documents, assign tasks, and communicate effectively.",
      icon: "👥",
      color: "#f093fb",
    },
  ];

  return (
    <Box>
      <HeroSection>
        <FloatingElement
          sx={{
            width: 100,
            height: 100,
            top: "10%",
            left: "10%",
            animationDelay: "0s",
          }}
        />
        <FloatingElement
          sx={{
            width: 60,
            height: 60,
            top: "20%",
            right: "15%",
            animationDelay: "2s",
          }}
        />
        <FloatingElement
          sx={{
            width: 80,
            height: 80,
            bottom: "20%",
            left: "20%",
            animationDelay: "4s",
          }}
        />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: "2.5rem", md: "3.5rem", lg: "4rem" },
                    fontWeight: 800,
                    color: "white",
                    mb: 3,
                    lineHeight: 1.2,
                    textShadow: "0 4px 20px rgba(0,0,0,0.3)",
                  }}
                >
                  Real Estate
                  <br />
                  <span style={{ color: "#FFD700" }}>Dashboard</span>
                </Typography>

                <Typography
                  variant="h5"
                  sx={{
                    color: "rgba(255,255,255,0.9)",
                    mb: 4,
                    fontWeight: 400,
                    lineHeight: 1.6,
                  }}
                >
                  Streamline your property management with our powerful,
                  intuitive dashboard designed for real estate professionals.
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    flexWrap: "wrap",
                    justifyContent: { xs: "center", md: "flex-start" },
                  }}
                >
                  <Link href="/login" style={{ textDecoration: "none" }}>
                    <StyledButton
                      variant="contained"
                      size="large"
                      sx={{
                        backgroundColor: "#FFD700",
                        color: "#333",
                        "&:hover": {
                          backgroundColor: "#FFC107",
                        },
                      }}
                    >
                      Get Started
                    </StyledButton>
                  </Link>

                  <Link href="/register" style={{ textDecoration: "none" }}>
                    <StyledButton
                      variant="outlined"
                      size="large"
                      sx={{
                        borderColor: "white",
                        color: "white",
                        "&:hover": {
                          borderColor: "#FFD700",
                          backgroundColor: "rgba(255, 215, 0, 0.1)",
                        },
                      }}
                    >
                      Create Account
                    </StyledButton>
                  </Link>
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ position: "relative", textAlign: "center" }}>
                <Box
                  sx={{
                    position: "relative",
                    borderRadius: "24px",
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    padding: "60px 40px",
                    boxShadow: "0 25px 50px rgba(0,0,0,0.2)",
                    transform:
                      "perspective(1000px) rotateY(-5deg) rotateX(5deg)",
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform:
                        "perspective(1000px) rotateY(0deg) rotateX(0deg)",
                    },
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      color: "white",
                      fontWeight: 700,
                      mb: 2,
                      fontSize: { xs: "2rem", md: "2.5rem" },
                    }}
                  >
                    🏢
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      color: "white",
                      fontWeight: 600,
                      mb: 2,
                    }}
                  >
                    Professional Dashboard
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "rgba(255,255,255,0.8)",
                      fontWeight: 400,
                      lineHeight: 1.6,
                    }}
                  >
                    Modern interface designed for real estate professionals
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </HeroSection>

      <Box sx={{ py: 8, backgroundColor: "#f8f9fa" }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              textAlign: "center",
              mb: 2,
              fontWeight: 700,
              color: "#333",
            }}
          >
            Why Choose Our Platform?
          </Typography>

          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
              mb: 6,
              color: "#666",
              maxWidth: "600px",
              mx: "auto",
            }}
          >
            Built specifically for real estate professionals who need powerful
            tools to manage their business efficiently.
          </Typography>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={index}>
                <FeatureCard>
                  <CardContent
                    sx={{ p: 3, textAlign: "center", height: "100%" }}
                  >
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: "50%",
                        background: `linear-gradient(135deg, ${feature.color}20 0%, ${feature.color}10 100%)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 16px",
                        border: `2px solid ${feature.color}30`,
                      }}
                    >
                      <Typography
                        variant="h2"
                        sx={{
                          fontSize: "1.8rem",
                          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                        }}
                      >
                        {feature.icon}
                      </Typography>
                    </Box>

                    <Typography
                      variant="h6"
                      sx={{
                        mb: 2,
                        fontWeight: 700,
                        color: "#2d3748",
                        fontSize: "1.25rem",
                      }}
                    >
                      {feature.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: "#718096",
                        lineHeight: 1.6,
                        fontSize: "0.9rem",
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </FeatureCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: 8, backgroundColor: "#333", color: "white" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h3"
              sx={{
                mb: 3,
                fontWeight: 700,
              }}
            >
              Ready to Transform Your Real Estate Business?
            </Typography>

            <Typography
              variant="h6"
              sx={{
                mb: 4,
                color: "rgba(255,255,255,0.8)",
                maxWidth: "600px",
                mx: "auto",
              }}
            >
              Join thousands of real estate professionals who trust our platform
              to manage their properties and grow their business.
            </Typography>

            <Link href="/register" style={{ textDecoration: "none" }}>
              <StyledButton
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: "#FFD700",
                  color: "#333",
                  "&:hover": {
                    backgroundColor: "#FFC107",
                  },
                }}
              >
                Start Your Free Trial
              </StyledButton>
            </Link>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
