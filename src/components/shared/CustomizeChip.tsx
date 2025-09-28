"use client";
import { Chip, styled } from "@mui/material";

const MuiChip = styled(Chip)`
  width: fit-content;
  font-weight: 500;
  height: 28px;
  color: #fff;
  border: 1px solid transparent;
  &.without-color {
    border: 1px solid ${({ theme }) => theme.palette.divider};
    background-color: ${({ theme }) => theme.palette.background.paper};
    color: ${({ theme }) => theme.palette.text.primary} !important;
  }
  .MuiChip-label {
    padding: 7px 8px;
  }
`;

export function CustomizeChip({ options, value, withoutColor, ...rest }: any) {
  const findValue = options?.find((option: any) => option?.value === value);

  if (!findValue) return "-";

  return (
    <>
      <MuiChip
        size="small"
        label={findValue?.label + (findValue?.deleted ? " (Gelöscht)" : "")}
        style={{
          backgroundColor: findValue.color,
        }}
        className={withoutColor ? "without-color" : ""}
        {...rest}
      />
    </>
  );
}
