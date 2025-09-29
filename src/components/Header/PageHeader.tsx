"use client";

import { styled, useMediaQuery, useTheme } from "@mui/material";
import { memo } from "react";

const HeaderWrapper = styled("div")`
  position: sticky;
  top: 0;
  right: 0;
  z-index: 110;
  width: 100%;
  height: 64px;
  min-height: 64px;
  border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
  background: ${({ theme }) => theme.palette.background.paper};
  display: flex;
  align-items: center;
  padding: 0 16px;
  justify-content: space-between;
  ${({ theme }) => theme.breakpoints.down("lg")} {
    position: relative;
  }

  h1 {
    font-size: 16px;
    font-weight: 500;
    margin: 0;
  }

  .left {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
    white-space: nowrap;
    line-height: 1.2;

    p {
      font-size: 12px;
      color: ${({ theme }) => theme.palette.text.secondary};
      margin: 0;
      ${({ theme }) => theme.breakpoints.down("sm")} {
        font-size: 12px;
      }
    }
  }

  .middle-content {
    flex: 1;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;

    ${({ theme }) => theme.breakpoints.down("lg")} {
      display: none;
    }
  }
`;

interface HeaderProps {
  title?: string;
  description?: string;
  tab?: React.ReactNode;
}

const PageHeader = ({
  title = "",
  tab = null,
  description = "",
}: HeaderProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  return (
    <HeaderWrapper>
      <div className="left">
        <div style={{ display: "flex", flexDirection: "column" }}>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </div>
      {tab && !isMobile && <div className="middle-content">{tab}</div>}
    </HeaderWrapper>
  );
};

export default memo(PageHeader);
