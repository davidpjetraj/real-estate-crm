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
  keyframes,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Keyframe animations
const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  33% { transform: translateY(-15px) rotate(5deg); }
  66% { transform: translateY(-10px) rotate(-3deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
`;

const slideInLeft = keyframes`
  from { opacity: 0; transform: translateX(-60px); }
  to { opacity: 1; transform: translateX(0); }
`;

const slideInRight = keyframes`
  from { opacity: 0; transform: translateX(60px); }
  to { opacity: 1; transform: translateX(0); }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const HeroSection = styled(Box)`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  padding: 80px 0;

  @media (max-width: 990px) {
    padding: 60px 20px;
    min-height: auto;
  }
`;

const GlowOrb = styled(Box)`
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  animation: ${pulse} 8s ease-in-out infinite;
  pointer-events: none;
`;

const GridPattern = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: linear-gradient(
      rgba(255, 255, 255, 0.03) 1px,
      transparent 1px
    ),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 60px 60px;
  opacity: 0.5;
`;

const FloatingShape = styled(Box)`
  position: absolute;
  animation: ${float} 8s ease-in-out infinite;
  opacity: 0.6;
`;

const AccentText = styled("span")`
  background: linear-gradient(135deg, #00d4aa 0%, #00bcd4 50%, #7c4dff 100%);
  background-size: 200% 200%;
  animation: ${gradientShift} 4s ease infinite;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const GlassCard = styled(Card)`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 32px;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.05),
      transparent
    );
    transition: left 0.5s ease;
  }

  &:hover {
    transform: translateY(-16px) scale(1.02);
    border-color: rgba(0, 212, 170, 0.3);
    box-shadow: 0 30px 60px rgba(0, 212, 170, 0.15),
      0 0 40px rgba(0, 212, 170, 0.1);

    &::before {
      left: 100%;
    }
  }
`;

const FeatureIcon = styled(Box)`
  width: 80px;
  height: 80px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  position: relative;
  background: linear-gradient(
    135deg,
    rgba(0, 212, 170, 0.1) 0%,
    rgba(124, 77, 255, 0.1) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;

  .MuiCard-root:hover & {
    box-shadow: 0 0 30px rgba(0, 212, 170, 0.3);
    border-color: rgba(0, 212, 170, 0.4);
  }
`;

const PrimaryButton = styled(Button)`
  border-radius: 16px;
  padding: 16px 40px;
  font-weight: 700;
  text-transform: none;
  font-size: 17px;
  letter-spacing: 0.5px;
  background: linear-gradient(135deg, #00d4aa 0%, #00bcd4 100%);
  color: #0a0a0a;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    background-size: 200% 100%;
    animation: ${shimmer} 3s linear infinite;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 212, 170, 0.4);
  }
`;

const SecondaryButton = styled(Button)`
  border-radius: 16px;
  padding: 16px 40px;
  font-weight: 700;
  text-transform: none;
  font-size: 17px;
  letter-spacing: 0.5px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  color: white;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: #00d4aa;
    background: rgba(0, 212, 170, 0.1);
    box-shadow: 0 20px 40px rgba(0, 212, 170, 0.2);
  }
`;

const StatBox = styled(Box)`
  text-align: center;
  padding: 24px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(0, 212, 170, 0.3);
    background: rgba(0, 212, 170, 0.05);
  }
`;

const FooterCTA = styled(Box)`
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  position: relative;
  overflow: hidden;
  padding: 120px 0;

  &::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle,
      rgba(0, 212, 170, 0.1) 0%,
      transparent 50%
    );
    animation: ${pulse} 10s ease-in-out infinite;
  }
`;

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
      title: "Smart Property Hub",
      description:
        "AI-powered property management that learns your workflow. Automate listings, track performance, and predict market trends with precision.",
      icon: "⚡",
      gradient: "linear-gradient(135deg, #00d4aa 0%, #00bcd4 100%)",
    },
    {
      title: "Real-Time Analytics",
      description:
        "Live dashboards that breathe with your business. Interactive visualizations reveal insights hidden in your data, powering smarter decisions.",
      icon: "📈",
      gradient: "linear-gradient(135deg, #7c4dff 0%, #536dfe 100%)",
    },
    {
      title: "Seamless Collaboration",
      description:
        "Break down silos with integrated team workspaces. Share, assign, and communicate—all within a unified ecosystem built for speed.",
      icon: "🚀",
      gradient: "linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)",
    },
  ];

  const stats = [
    { value: "10K+", label: "Properties Managed" },
    { value: "98%", label: "Client Satisfaction" },
    { value: "24/7", label: "Support Available" },
    { value: "50+", label: "Integrations" },
  ];

  return (
    <Box sx={{ backgroundColor: "#0a0a0a", minHeight: "100vh" }}>
      {/* Hero Section */}
      <HeroSection>
        <GridPattern />

        {/* Glow Orbs */}
        <GlowOrb
          sx={{
            width: 600,
            height: 600,
            background: "radial-gradient(circle, #00d4aa 0%, transparent 70%)",
            top: "-20%",
            right: "-10%",
            animationDelay: "0s",
          }}
        />
        <GlowOrb
          sx={{
            width: 400,
            height: 400,
            background: "radial-gradient(circle, #7c4dff 0%, transparent 70%)",
            bottom: "-10%",
            left: "-5%",
            animationDelay: "4s",
          }}
        />

        {/* Floating Shapes */}
        <FloatingShape
          sx={{
            width: 120,
            height: 120,
            top: "15%",
            left: "8%",
            background:
              "linear-gradient(135deg, rgba(0,212,170,0.2) 0%, transparent 50%)",
            borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
            animationDelay: "0s",
          }}
        />
        <FloatingShape
          sx={{
            width: 80,
            height: 80,
            top: "25%",
            right: "12%",
            background:
              "linear-gradient(135deg, rgba(124,77,255,0.2) 0%, transparent 50%)",
            borderRadius: "70% 30% 30% 70% / 70% 70% 30% 30%",
            animationDelay: "2s",
          }}
        />
        <FloatingShape
          sx={{
            width: 60,
            height: 60,
            bottom: "30%",
            left: "15%",
            background:
              "linear-gradient(135deg, rgba(0,188,212,0.3) 0%, transparent 50%)",
            borderRadius: "50%",
            animationDelay: "4s",
          }}
        />

        <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
          <Grid container spacing={8} alignItems="center">
            <Grid size={{ xs: 12, lg: 6 }}>
              <Box
                sx={{
                  textAlign: { xs: "center", lg: "left" },
                  animation: mounted ? `${slideInLeft} 1s ease-out` : "none",
                }}
              >
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1,
                    px: 3,
                    py: 1,
                    mb: 4,
                    borderRadius: "100px",
                    background: "rgba(0, 212, 170, 0.1)",
                    border: "1px solid rgba(0, 212, 170, 0.3)",
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#00d4aa",
                      animation: `${pulse} 2s ease infinite`,
                    }}
                  />
                  <Typography
                    sx={{
                      color: "#00d4aa",
                      fontSize: "14px",
                      fontWeight: 600,
                      letterSpacing: "1px",
                    }}
                  >
                    NOW IN BETA • FREE ACCESS
                  </Typography>
                </Box>

                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: "3rem", md: "4rem", lg: "5rem" },
                    fontWeight: 900,
                    color: "white",
                    mb: 3,
                    lineHeight: 1.1,
                    letterSpacing: "-2px",
                  }}
                >
                  The Future of
                  <br />
                  <AccentText>Real Estate</AccentText>
                  <br />
                  Management
                </Typography>

                <Typography
                  variant="h6"
                  sx={{
                    color: "rgba(255,255,255,0.6)",
                    mb: 5,
                    fontWeight: 400,
                    lineHeight: 1.8,
                    maxWidth: "500px",
                    mx: { xs: "auto", lg: 0 },
                    fontSize: "1.1rem",
                  }}
                >
                  Elevate your property portfolio with next-gen tools.
                  Intelligent automation, stunning analytics, and seamless team
                  collaboration—all in one powerful platform.
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    flexWrap: "wrap",
                    justifyContent: { xs: "center", lg: "flex-start" },
                    mb: 6,
                  }}
                >
                  <Link href="/login" style={{ textDecoration: "none" }}>
                    <PrimaryButton variant="contained" size="large">
                      Launch Dashboard →
                    </PrimaryButton>
                  </Link>

                  <Link href="/register" style={{ textDecoration: "none" }}>
                    <SecondaryButton variant="outlined" size="large">
                      Create Account
                    </SecondaryButton>
                  </Link>
                </Box>

                {/* Stats Row */}
                <Grid container spacing={2}>
                  {stats.map((stat, index) => (
                    <Grid size={{ xs: 6, sm: 3 }} key={index}>
                      <StatBox
                        sx={{
                          animation: mounted
                            ? `${slideUp} 1s ease-out ${
                                0.2 + index * 0.1
                              }s both`
                            : "none",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "1.8rem",
                            fontWeight: 800,
                            color: "#00d4aa",
                            mb: 0.5,
                          }}
                        >
                          {stat.value}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "0.75rem",
                            color: "rgba(255,255,255,0.5)",
                            fontWeight: 500,
                            letterSpacing: "0.5px",
                          }}
                        >
                          {stat.label}
                        </Typography>
                      </StatBox>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, lg: 6 }}>
              <Box
                sx={{
                  position: "relative",
                  animation: mounted ? `${slideInRight} 1s ease-out` : "none",
                }}
              >
                {/* Dashboard Preview */}
                <Box
                  sx={{
                    position: "relative",
                    borderRadius: "32px",
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
                    backdropFilter: "blur(40px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    padding: { xs: "40px 30px", md: "60px 50px" },
                    boxShadow: "0 40px 80px rgba(0,0,0,0.4)",
                    overflow: "hidden",
                  }}
                >
                  {/* Mock Dashboard Elements */}
                  <Box sx={{ mb: 4 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 3,
                      }}
                    >
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          background: "#ff6b6b",
                        }}
                      />
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          background: "#feca57",
                        }}
                      />
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          background: "#00d4aa",
                        }}
                      />
                    </Box>

                    <Typography
                      sx={{
                        color: "rgba(255,255,255,0.4)",
                        fontSize: "12px",
                        fontWeight: 600,
                        letterSpacing: "2px",
                        mb: 2,
                      }}
                    >
                      PORTFOLIO OVERVIEW
                    </Typography>

                    <Typography
                      sx={{
                        color: "white",
                        fontSize: { xs: "2rem", md: "2.5rem" },
                        fontWeight: 800,
                        mb: 1,
                      }}
                    >
                      $2.4M
                    </Typography>
                    <Typography
                      sx={{
                        color: "#00d4aa",
                        fontSize: "14px",
                        fontWeight: 600,
                      }}
                    >
                      ↑ 12.5% this month
                    </Typography>
                  </Box>

                  {/* Mini Chart Bars */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-end",
                      gap: 1,
                      mb: 4,
                    }}
                  >
                    {[40, 65, 45, 80, 55, 95, 70].map((height, i) => (
                      <Box
                        key={i}
                        sx={{
                          flex: 1,
                          height: height,
                          borderRadius: "8px",
                          background:
                            i === 5
                              ? "linear-gradient(180deg, #00d4aa 0%, #00bcd4 100%)"
                              : "rgba(255,255,255,0.1)",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            background:
                              "linear-gradient(180deg, #00d4aa 0%, #00bcd4 100%)",
                          },
                        }}
                      />
                    ))}
                  </Box>

                  {/* Property Cards */}
                  <Grid container spacing={2}>
                    {[
                      {
                        name: "Downtown Loft",
                        price: "$450K",
                        status: "Active",
                      },
                      {
                        name: "Beach Villa",
                        price: "$1.2M",
                        status: "Pending",
                      },
                    ].map((property, i) => (
                      <Grid size={{ xs: 6 }} key={i}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: "16px",
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.05)",
                          }}
                        >
                          <Box
                            sx={{
                              width: "100%",
                              height: 60,
                              borderRadius: "12px",
                              background: `linear-gradient(135deg, ${
                                i === 0 ? "#00d4aa20" : "#7c4dff20"
                              } 0%, transparent 100%)`,
                              mb: 2,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Typography sx={{ fontSize: "1.5rem" }}>
                              {i === 0 ? "🏢" : "🏖️"}
                            </Typography>
                          </Box>
                          <Typography
                            sx={{
                              color: "white",
                              fontSize: "13px",
                              fontWeight: 600,
                              mb: 0.5,
                            }}
                          >
                            {property.name}
                          </Typography>
                          <Typography
                            sx={{
                              color: "rgba(255,255,255,0.5)",
                              fontSize: "12px",
                            }}
                          >
                            {property.price}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                {/* Floating Badge */}
                <Box
                  sx={{
                    position: "absolute",
                    top: -20,
                    right: { xs: 20, md: -20 },
                    px: 3,
                    py: 1.5,
                    borderRadius: "100px",
                    background:
                      "linear-gradient(135deg, #7c4dff 0%, #536dfe 100%)",
                    boxShadow: "0 10px 30px rgba(124,77,255,0.4)",
                    animation: `${float} 4s ease-in-out infinite`,
                  }}
                >
                  <Typography
                    sx={{
                      color: "white",
                      fontSize: "13px",
                      fontWeight: 700,
                    }}
                  >
                    ✨ AI-Powered
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </HeroSection>

      {/* Features Section */}
      <Box sx={{ py: { xs: 10, md: 16 }, backgroundColor: "#0a0a0a" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 10 }}>
            <Typography
              sx={{
                color: "#00d4aa",
                fontSize: "14px",
                fontWeight: 700,
                letterSpacing: "3px",
                mb: 2,
              }}
            >
              POWERFUL FEATURES
            </Typography>
            <Typography
              variant="h2"
              sx={{
                color: "white",
                fontWeight: 800,
                fontSize: { xs: "2rem", md: "3rem" },
                mb: 3,
                letterSpacing: "-1px",
              }}
            >
              Everything You Need to
              <br />
              <AccentText>Dominate the Market</AccentText>
            </Typography>
            <Typography
              sx={{
                color: "rgba(255,255,255,0.5)",
                maxWidth: "600px",
                mx: "auto",
                fontSize: "1.1rem",
                lineHeight: 1.8,
              }}
            >
              Built for ambitious real estate professionals who demand
              excellence. Our platform combines cutting-edge technology with
              intuitive design.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={index}>
                <GlassCard
                  sx={{
                    height: "100%",
                    animation: mounted
                      ? `${slideUp} 0.8s ease-out ${0.2 + index * 0.15}s both`
                      : "none",
                  }}
                >
                  <CardContent
                    sx={{ p: 4, textAlign: "center", height: "100%" }}
                  >
                    <FeatureIcon>
                      <Typography sx={{ fontSize: "2rem" }}>
                        {feature.icon}
                      </Typography>
                    </FeatureIcon>

                    <Typography
                      variant="h5"
                      sx={{
                        mb: 2,
                        fontWeight: 700,
                        color: "white",
                        fontSize: "1.4rem",
                      }}
                    >
                      {feature.title}
                    </Typography>

                    <Typography
                      sx={{
                        color: "rgba(255,255,255,0.5)",
                        lineHeight: 1.8,
                        fontSize: "0.95rem",
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </GlassCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <FooterCTA>
        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h2"
              sx={{
                color: "white",
                fontWeight: 800,
                fontSize: { xs: "2rem", md: "3rem" },
                mb: 3,
                letterSpacing: "-1px",
              }}
            >
              Ready to Transform
              <br />
              <AccentText>Your Business?</AccentText>
            </Typography>

            <Typography
              sx={{
                color: "rgba(255,255,255,0.6)",
                mb: 5,
                maxWidth: "500px",
                mx: "auto",
                fontSize: "1.1rem",
                lineHeight: 1.8,
              }}
            >
              Join thousands of forward-thinking real estate professionals who
              are already leveraging our platform to scale their success.
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Link href="/register" style={{ textDecoration: "none" }}>
                <PrimaryButton variant="contained" size="large">
                  Start Free Trial →
                </PrimaryButton>
              </Link>
              <Link href="/login" style={{ textDecoration: "none" }}>
                <SecondaryButton variant="outlined" size="large">
                  Sign In
                </SecondaryButton>
              </Link>
            </Box>

            <Typography
              sx={{
                color: "rgba(255,255,255,0.3)",
                mt: 4,
                fontSize: "13px",
              }}
            >
              No credit card required • Free 14-day trial • Cancel anytime
            </Typography>
          </Box>
        </Container>
      </FooterCTA>

      {/* Footer */}
      <Box
        sx={{
          py: 4,
          backgroundColor: "#050505",
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Typography
              sx={{
                color: "rgba(255,255,255,0.4)",
                fontSize: "14px",
              }}
            >
              © 2025 Real Estate Dashboard. All rights reserved.
            </Typography>
            <Box sx={{ display: "flex", gap: 3 }}>
              {["Privacy", "Terms", "Contact"].map((link) => (
                <Typography
                  key={link}
                  sx={{
                    color: "rgba(255,255,255,0.4)",
                    fontSize: "14px",
                    cursor: "pointer",
                    transition: "color 0.2s ease",
                    "&:hover": {
                      color: "#00d4aa",
                    },
                  }}
                >
                  {link}
                </Typography>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
