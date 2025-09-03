'use client';
import { alpha, Button, darken, styled } from '@mui/material';
import React from 'react';

const ButtonWrapper = styled(Button)`
  background-color: ${({ theme }) => theme.palette.background.paper};
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 6px 8px;
  color: ${({ theme }) => theme.palette.text.primary};
  cursor: pointer;
  outline: none;
  cursor: pointer;
  height: 34px;
  font-weight: 400;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    min-width: auto;
    .MuiButton-icon {
      margin: 0;
    }
    .text {
      display: none;
    }
  }

  .clear {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    width: 20px;
    height: 20px;
    margin-left: 5px;

    &:hover {
      background-color: ${({ theme }) =>
        alpha(theme.palette.primary.main, 0.15)};
    }
  }

  &:hover,
  &.active {
    background-color: ${({ theme }) => alpha(theme.palette.primary.main, 0.1)};
    border-color: ${({ theme }) => alpha(theme.palette.primary.main, 0.1)};
    color: ${({ theme }) => {
      const darkMode = theme.palette.mode === 'dark';
      return darkMode
        ? theme.palette.primary.light
        : darken(theme.palette.primary.main, 0.5);
    }};
  }

  &.active {
    &:hover {
      background-color: ${({ theme }) =>
        alpha(theme.palette.primary.main, 0.2)};
      border-color: ${({ theme }) => alpha(theme.palette.primary.main, 0.2)};
      color: ${({ theme }) => {
        const darkMode = theme.palette.mode === 'dark';
        return darkMode
          ? theme.palette.primary.light
          : darken(theme.palette.primary.main, 0.8);
      }};
    }
  }
  &.open {
    background-color: ${({ theme }) => alpha(theme.palette.primary.main, 0.2)};
    border-color: ${({ theme }) => alpha(theme.palette.primary.main, 0.2)};
    color: ${({ theme }) => {
      const darkMode = theme.palette.mode === 'dark';
      return darkMode
        ? theme.palette.primary.light
        : darken(theme.palette.primary.main, 0.8);
    }};
  }
`;

const TableButton: React.ForwardRefRenderFunction<
  HTMLButtonElement,
  { children?: React.ReactNode; [key: string]: any }
> = ({ children, ...rest }, ref) => {
  return (
    <ButtonWrapper ref={ref} {...rest}>
      {children}
    </ButtonWrapper>
  );
};

export default React.forwardRef(TableButton);
