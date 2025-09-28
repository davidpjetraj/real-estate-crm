"use client";
import useParams, { ParamsType } from "@/hooks/useParams";
import { Backdrop } from "@mui/material";
import { styled } from "@mui/material/styles";
import classNames from "classnames";
import React from "react";

const Wrapper = styled("div")`
  position: fixed;
  z-index: 1300;
  overflow: hidden;
  display: flex;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%) scale(0.9);
  width: calc(100% - 12px);
  max-width: 1920px;
  height: calc(100% - 12px);
  opacity: 0;
  visibility: hidden;
  transition: 0.3s ease-in-out !important;
  background-color: ${({ theme }) => theme.palette.background.default};
  border: none;
  border-radius: ${({ theme }) => theme.shape.borderRadius}px;
  flex-direction: column;
  box-shadow: ${({ theme }) => theme.shadows[4]};
  @media (max-width: 1240px) {
    width: 100%;
    height: 100dvh;
    max-height: 100dvh;
    border-radius: 0;
  }

  &.open {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(-50%) scale(1);
  }

  & > div.left {
    position: relative;
    max-width: 30%;
    display: flex;
    flex-direction: column;
    background-color: ${({ theme }) => theme.palette.background.default};
    border-radius: 16px;
    overflow: hidden;
    width: 100%;
    height: 100%;
  }

  & > div.right {
    padding: 12px;
    position: relative;
    max-width: 70%;
    width: 100%;
    background-color: ${({ theme }) => theme.palette.background.default};
    border-radius: 16px;
    overflow-y: scroll;
  }
`;

const HeaderWrapper = styled("div")`
  height: 70px;
  min-height: 70px;
  border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;

  .left {
    font-size: 20px;
    font-weight: 700;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 65%;
    @media (max-width: 1240px) {
      width: calc(100% - 90px);

      .MuiTabs-scroller {
        padding: 0;
      }
    }
    @media (max-width: 425px) {
      font-size: 16px;
      width: 30%;
    }
  }

  .right {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    min-width: 100px;
    > .MuiIconButton-root {
      border: 1px solid ${({ theme }) => theme.palette.divider};
      border-radius: ${({ theme }) => theme.shape.borderRadius}px;
      width: 40px;
      height: 40px;
    }
  }
`;

function Header({
  children,
  title,
}: {
  children: React.ReactNode;
  title: React.ReactNode;
}) {
  return (
    <HeaderWrapper>
      <div className="left">{title}</div>
      <div className="right">{children}</div>
    </HeaderWrapper>
  );
}

const FooterWrapper = styled("div")`
  height: 70px;
  min-height: 70px;
  border-top: 1px solid ${({ theme }) => theme.palette.divider};
  width: 100%;
  display: flex;
  align-items: center;
  padding: 10px 16px;
  @media (max-width: 1240px) {
    height: 100px;
  }

  .footer {
    display: flex;
    width: 100%;
  }
`;

function Footer({ children }: { children: React.ReactNode }) {
  return (
    <FooterWrapper>
      <div className="footer">{children}</div>
    </FooterWrapper>
  );
}

const SidebarDetailsContentWrapper = styled("div")`
  padding: 16px;
  overflow: auto;
  position: relative;
  height: 100%;
  background-color: ${({ theme }) => theme.palette.background.paper};
`;

function SidebarDetailsContent({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <SidebarDetailsContentWrapper style={style}>
      {children}
    </SidebarDetailsContentWrapper>
  );
}

export default function SidebarDetails({
  children,
  type,
  maxWith = 800,
  fullScreen = false,
}: {
  children: React.ReactNode;
  type: ParamsType;
  maxWith?: number;
  fullScreen?: boolean;
}) {
  const { clearParams, open, delayedOpen } = useParams({
    type: type,
  });

  return (
    <>
      <Backdrop
        style={{
          zIndex: 1300,
        }}
        open={open}
        onClick={clearParams}
      />
      <Wrapper
        style={{
          maxWidth: fullScreen ? "100%" : Math.min(maxWith, 1920),
          width: fullScreen ? "100%" : undefined,
          height: fullScreen ? "100%" : undefined,
          top: fullScreen ? 0 : undefined,
          left: fullScreen ? 0 : undefined,
          transform: fullScreen ? "none" : undefined,
          borderRadius: fullScreen ? 0 : undefined,
        }}
        className={classNames({
          open: open,
        })}
      >
        {delayedOpen ? children : null}
      </Wrapper>
    </>
  );
}

SidebarDetails.Header = Header;
SidebarDetails.Content = SidebarDetailsContent;
SidebarDetails.Footer = Footer;
