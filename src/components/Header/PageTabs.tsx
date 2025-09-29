import { alpha, darken, styled } from "@mui/material";
import React from "react";

const TabsWrapper = styled("div")`
  width: max-content;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  border: 1px solid ${({ theme }) => theme.palette.divider};
  padding: 4px;
  border-radius: 10px;

  .MuiButton-root {
    font-weight: 500;
    color: ${({ theme }) => theme.palette.text.secondary};
    padding: 3px 8px;
    font-size: 14px;
    height: auto;
    line-height: 20px;
    &:hover,
    &.active {
      color: ${({ theme }) => darken(theme.palette.primary.main, 0.2)};
      border-radius: 8px;
      background-color: ${({ theme }) =>
        alpha(theme.palette.primary.main, 0.1)};
    }
  }
`;

export default function PageTabs({ children }: { children: React.ReactNode }) {
  return <TabsWrapper>{children}</TabsWrapper>;
}
