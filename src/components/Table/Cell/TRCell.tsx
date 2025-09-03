"use client";
import { styled } from "@mui/material";
const Wrapper = styled("div")`
  position: relative;
  padding: 0px 8px;
  overflow: hidden;
  width: calc(100% - 16px);
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export function TRCell({
  children,
  ...rest
}: {
  children: React.ReactNode;
  [key: string]: any;
}) {
  return <Wrapper {...rest}>{children}</Wrapper>;
}
