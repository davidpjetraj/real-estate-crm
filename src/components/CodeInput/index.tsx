"use client";
import { styled } from "@mui/material";
import { forwardRef } from "react";
import AuthCode, { AuthCodeRef } from "react-auth-code-input";

export type CodeProps = {
  onChange: (code: string) => any;
};

const Wrapper = styled("div")`
  .code-container {
    display: flex;
    justify-content: center;
    gap: 8px;
  }
  .input {
    width: 100%;
    height: 90px;
    padding: 0;
    font-size: 35px;
    text-align: center;
    text-transform: uppercase;
    color: ${({ theme }) => theme.palette.text.primary};
    background: ${({ theme }) => theme.palette.background.default};
    background-clip: padding-box;
    border: 2px solid ${({ theme }) => theme.palette.divider};
    border-radius: ${({ theme }) => theme.shape.borderRadius}px;
    ::placeholder {
      color: #d6d6d6;
    }

    ${({ theme }) => theme.breakpoints.down("sm")} {
      height: 80px;
      font-size: 30px;
    }
    ${({ theme }) => theme.breakpoints.down("xs")} {
      height: 50px;
      font-size: 20px;
    }
  }
  .input:focus {
    appearance: none;
    outline: 0;
    box-shadow: ${({ theme }) => theme.shadows[4]};
  }
`;

export const CodeInput = forwardRef<AuthCodeRef, CodeProps>(
  ({ onChange, ...props }, ref) => {
    return (
      <Wrapper>
        <AuthCode
          {...props}
          allowedCharacters="numeric"
          onChange={onChange}
          containerClassName="code-container"
          inputClassName="input"
          isPassword={false}
          length={4}
          placeholder="0"
          ref={ref}
        />
      </Wrapper>
    );

    CodeInput.displayName = "CodeInput";
  }
);
