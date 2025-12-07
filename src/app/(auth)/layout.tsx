"use client";

import { GuestGuard } from "@/components/guard";
import { styled } from "@mui/material";

const Wrapper = styled("div")`
  position: relative;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);

  .container {
    text-align: center;
    max-width: 450px;
    margin: 0 auto;
    width: 100%;
    padding: 30px 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`;

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GuestGuard>
      <Wrapper>
        <div className="container">{children}</div>
      </Wrapper>
    </GuestGuard>
  );
}
