"use client";

import { ChevronLeftIcon } from "@/components/icons/ChevronLeftIcon";
import Link from "@/components/Link";
import { IconButton, styled } from "@mui/material";

const Wrapper = styled("div")`
  height: 60px;
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.palette.background.paper};
  border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
  padding: 0 16px;
  .head-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
  .go-back {
    border: 1px solid ${({ theme }) => theme.palette.divider};
  }
  .left {
    display: flex;
    align-items: center;
    gap: 25px;
    h4 {
      margin: 0;
      color: ${({ theme }) => theme.palette.text.secondary};
      font-weight: 600;
      font-size: 14px;
    }
  }
  .right {
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;

export default function Header({
  title,
  backHref,
}: {
  title?: string;
  backHref?: string;
}) {
  return (
    <Wrapper>
      <div className="head-content">
        <div className="left">
          {backHref && (
            <IconButton className="go-back" component={Link} href={backHref}>
              <ChevronLeftIcon />
            </IconButton>
          )}
          {title && <h4>{title}</h4>}
        </div>
      </div>
    </Wrapper>
  );
}
