"use client";
import React from "react";
import {
  alpha,
  Button,
  FormHelperText,
  Icon,
  Radio,
  styled,
} from "@mui/material";
import { useField } from "formik";
import classNames from "classnames";

interface CustomRadioProps {
  name: string;
  options: {
    value: string;
    label: string;
    description?: string;
    startIcon?: React.ReactNode;
    disabled?: boolean;
  }[];
}

const Wrapper = styled("div")`
  position: relative;
  .options {
    display: flex;
    flex-direction: row;
    gap: 10px;
    @media (max-width: 700px) {
      flex-direction: column;
    }
  }
`;

const StyledButton = styled(Button)`
  padding: 20px;
  border-radius: 12px;
  gap: 12px;
  border: 1px solid ${({ theme }) => theme.palette.divider};
  font-size: 16px;
  font-weight: 500;
  width: 100%;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  &.active,
  &:hover {
    background-color: ${({ theme }) => alpha(theme.palette.primary.main, 0.1)};
    color: ${({ theme }) =>
      theme.palette.mode === "dark"
        ? theme.palette.primary.contrastText
        : theme.palette.text.primary};
    border-color: ${({ theme }) => theme.palette.primary.main};
  }
  &.error {
    border-color: ${({ theme }) => theme.palette.error.main};
    background-color: ${({ theme }) => alpha(theme.palette.error.main, 0.05)};
    color: ${({ theme }) => theme.palette.error.main};
  }
  &.disabled {
    pointer-events: none;
    opacity: 0.5;
    background-color: ${({ theme }) => alpha(theme.palette.primary.main, 0.1)};
    color: ${({ theme }) => theme.palette.text.disabled};
    border-color: ${({ theme }) => theme.palette.divider};
  }
  .MuiButton-startIcon {
    .MuiIcon-root {
      font-size: inherit;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: ${({ theme }) => theme.palette.background.default};
      border: 1px solid ${({ theme }) => theme.palette.divider};
      border-radius: 10px;
      width: 44px;
      height: 44px;
      svg {
        color: ${({ theme }) => theme.palette.text.primary};
      }
    }
  }
  .MuiButton-endIcon {
    position: absolute;
    top: 20px;
    right: 20px;
  }
  .label {
    display: block;
    color: ${({ theme }) => theme.palette.text.primary};
    font-size: 14px;
    font-weight: 500;
    text-align: left;
    line-height: 1.2em;
  }
  .description {
    display: block;
    color: ${({ theme }) => theme.palette.text.secondary};
    font-size: 12px;
    text-align: left;
    line-height: 1.2em;
  }
`;

function CustomRadioButton({ name, options }: CustomRadioProps) {
  const [field, meta, helpers] = useField(name);

  return (
    <Wrapper>
      <div className="options">
        {options.map((option) => (
          <StyledButton
            key={option.value}
            className={classNames({
              active: field.value === option.value,
              error: meta.touched && meta.error,
              disabled: option.disabled,
            })}
            onClick={() => {
              helpers.setValue(option.value);
            }}
            startIcon={option.startIcon && <Icon>{option.startIcon}</Icon>}
            disabled={option.disabled}
            endIcon={
              <>
                <Radio
                  size="small"
                  checked={field.value === option.value ? true : false}
                  key={option?.value}
                />
              </>
            }
          >
            <div className="content">
              <span className="label">{option.label}</span>
              {option.description && (
                <span className="description">{option.description}</span>
              )}
            </div>
          </StyledButton>
        ))}
      </div>
      {meta.touched && meta.error ? (
        <FormHelperText error>{meta.error}</FormHelperText>
      ) : null}
    </Wrapper>
  );
}

export default CustomRadioButton;
