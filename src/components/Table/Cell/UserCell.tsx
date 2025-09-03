"use client";

import { Avatar, styled } from "@mui/material";
import { getUri } from "../utils";

const Wrapper = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 3px 8px 3px 3px;
  cursor: pointer;
  border: 1px solid ${({ theme }) => theme.palette.divider};
  overflow: hidden;
  border-radius: 6px;

  .right {
    font-weight: 500;
    font-size: 12px;
  }
`;

export function UserCell({
  data,
  onClick = () => {},
  disabled,
  hideAvatar = false,
  style,
}: {
  data: any;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  disabled?: boolean;
  hideAvatar?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <>
      {!data ? (
        <span style={{ padding: "0px 8px" }}>{"-"}</span>
      ) : (
        <Wrapper
          onClick={!disabled ? onClick : undefined}
          style={{ cursor: disabled ? "not-allowed" : "pointer", ...style }}
        >
          {!hideAvatar && (
            <div className="left">
              <Avatar
                src={getUri(data?.avatar as string)}
                style={{
                  width: 22,
                  borderRadius: "50%",
                  height: 22,
                  color: "#fff",
                  fontSize: 14,
                  textTransform: "uppercase",
                }}
              >
                {data?.name ? data.name[0] : "?"}
              </Avatar>
            </div>
          )}
          <span className="right">{data?.name}</span>
        </Wrapper>
      )}
    </>
  );
}
