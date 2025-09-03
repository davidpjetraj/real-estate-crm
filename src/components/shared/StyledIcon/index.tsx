import { alpha, styled } from "@mui/material";
import classNames from "classnames";
import React from "react";

const Wrapper = styled("div")`
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ theme }) => theme.palette.divider};
  border-radius: ${({ theme }) => theme.shape.borderRadius}px;
  width: max-content;
  background-color: ${({ theme }) => theme.palette.background.paper};
  color: ${({ theme }) => theme.palette.text.secondary};

  &.error {
    border-color: ${({ theme }) => alpha(theme.palette.error.main, 0.3)};
    color: ${({ theme }) => theme.palette.error.main};
    background-color: ${({ theme }) => alpha(theme.palette.error.main, 0.1)};
  }
  &.info {
    border-color: ${({ theme }) => theme.palette.primary.main};
    color: ${({ theme }) => theme.palette.primary.main};
    background-color: ${({ theme }) => alpha(theme.palette.primary.main, 0.05)};
  }
  &.success {
    border-color: ${({ theme }) => theme.palette.success.main};
    color: ${({ theme }) => theme.palette.success.main};
    background-color: ${({ theme }) => alpha(theme.palette.success.main, 0.1)};
  }
  &.blue {
    border-color: ${({ theme }) => alpha(theme.palette.secondary.main, 0.3)};
    color: ${({ theme }) => theme.palette.secondary.main};
    background-color: ${({ theme }) =>
      alpha(theme.palette.secondary.main, 0.1)};
  }
  &.warning {
    border-color: ${({ theme }) => alpha(theme.palette.warning.main, 0.39)};
    color: ${({ theme }) => theme.palette.warning.main};
    background-color: ${({ theme }) => alpha(theme.palette.warning.main, 0.06)};
  }
`;
export default function StyledIcon({
  children,
  severity = "default",
}: {
  children: React.ReactNode;
  severity?: "default" | "error" | "info" | "success" | "blue" | "warning";
}) {
  return (
    <Wrapper
      className={classNames({
        error: severity === "error",
        info: severity === "info",
        success: severity === "success",
        blue: severity === "blue",
        warning: severity === "warning",
      })}
    >
      {children}
    </Wrapper>
  );
}
