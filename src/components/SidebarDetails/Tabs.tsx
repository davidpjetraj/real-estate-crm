import { alpha, Button, styled } from "@mui/material";
import React from "react";

const TabsWrapper = styled("div")`
  display: flex;
  align-items: center;
  height: 60px;
  border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
  div {
    padding: 0 16px;
    display: flex;
    align-items: center;
    gap: 8px;

    .MuiButton-root {
      border: 1px solid ${({ theme }) => theme.palette.divider};
      padding: 6px 12px;
      font-size: 14px;
      font-weight: 600;
      border-radius: ${({ theme }) => theme.shape.borderRadius}px;
      box-shadow: none !important;
      height: inherit;

      &.active {
        border-color: ${({ theme }) => alpha(theme.palette.primary.main, 0.4)};
        background: ${({ theme }) => alpha(theme.palette.primary.main, 0.1)};
        color: ${({ theme }) => theme.palette.primary.main};
      }
    }
  }
`;

function TabButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Button
      variant="outlined"
      size="small"
      className={active ? "active" : ""}
      startIcon={icon}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

function Tabs({ children }: { children: React.ReactNode }) {
  return (
    <TabsWrapper>
      <div>{children}</div>
    </TabsWrapper>
  );
}

export { Tabs, TabButton };
