'use client';
import { styled } from '@mui/material';
const Wrapper = styled('div')`
  display: flex;
  align-items: center;
  gap: 0px;
  gap: 3px;
  padding: 0px 8px;

  .action {
    cursor: pointer;
    width: 30px;
    height: 30px;
    padding: 0px;
    border: 1px solid ${({ theme }) => theme.palette.divider};
    border-radius: 8px;
    background-color: ${({ theme }) => theme.palette.background.paper};
    transition: none;

    &:hover {
      background-color: ${({ theme }) => theme.palette.action.hover};
    }

    svg {
      width: 20px;
      height: 20px;
      color: ${({ theme }) => theme.palette.text.primary};
    }
  }
`;

export function ActionsCell({ children }: { children: React.ReactNode }) {
  return <Wrapper>{children}</Wrapper>;
}
