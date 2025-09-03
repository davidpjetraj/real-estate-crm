"use client";

import { ChevronRightIcon } from "@/components/icons/ChevronRightIcon";
import { IconButton, styled, Tooltip } from "@mui/material";

const Wrapper = styled("div")`
  padding: 0px 8px;
  width: 100%;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  height: 100%;
  .left {
    padding-right: 8px;
  }
  .right {
    button {
      border-radius: ${({ theme }) => theme.shape.borderRadius}px;
      padding: 4px;
      opacity: 0;
      transition: 0.1s ease-in-out;
    }
  }
  &:hover {
    .right {
      button {
        opacity: 1;
      }
    }
  }
`;

export function NameCell({
  children,
  onClick,
  ...rest
}: {
  children: React.ReactNode;
  onClick?: (e: any) => void;
  [key: string]: any;
}) {
  return (
    <Wrapper
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e); // Use optional chaining to avoid calling undefined
      }}
      {...rest}
    >
      <div className="left">{children}</div>
      <div className="right">
        <Tooltip title="Details" arrow placement="top">
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onClick?.(e);
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        </Tooltip>
      </div>
    </Wrapper>
  );
}
