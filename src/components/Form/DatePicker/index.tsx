"use client";

import styled from "@emotion/styled";
import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers-pro";
import dayjs, { Dayjs } from "dayjs";
import { useField } from "formik";
import React from "react";

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  .MuiFormHelperText-root {
    line-height: 21px;
    position: absolute;
    bottom: -39px;
    font-size: 12px;
  }
  .MuiIconButton-root {
    margin-right: -5px !important;
  }
`;

const DatePickerIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width={20}
    height={20}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M15 1.66666V3.33333M5 1.66666V3.33333"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.99633 10.8333H10.0038M9.99633 14.1667H10.0038M13.3259 10.8333H13.3334M6.66675 10.8333H6.67422M6.66675 14.1667H6.67422"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.91675 6.66666H17.0834"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.08325 10.2027C2.08325 6.57162 2.08325 4.75607 3.12669 3.62803C4.17012 2.5 5.84949 2.5 9.20825 2.5H10.7916C14.1503 2.5 15.8298 2.5 16.8732 3.62803C17.9166 4.75607 17.9166 6.57162 17.9166 10.2027V10.6307C17.9166 14.2617 17.9166 16.0773 16.8732 17.2053C15.8298 18.3333 14.1503 18.3333 10.7916 18.3333H9.20825C5.84949 18.3333 4.17012 18.3333 3.12669 17.2053C2.08325 16.0773 2.08325 14.2617 2.08325 10.6307V10.2027Z"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.5 6.66666H17.5"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function DatePicker({ disabled, style, ...props }: any) {
  const [field, meta, helpers] = useField(props);
  const { setValue } = helpers;

  const parsedValue: Dayjs | null =
    field.value && typeof field.value === "string"
      ? dayjs(field.value)
      : field.value || null;

  return (
    <Wrapper style={style}>
      <MuiDatePicker
        {...props}
        value={parsedValue}
        disabled={disabled}
        format="DD/MM/YYYY"
        slots={{
          openPickerIcon: DatePickerIcon,
        }}
        slotProps={{
          textField: {
            variant: props.variant || "outlined",
            fullWidth: true,
            size: props.size || "large",
            error: meta.touched && Boolean(meta.error),
            helperText: meta.touched && meta.error ? meta.error : undefined,
            onBlur: field.onBlur,
          },
        }}
        onChange={(newValue: Dayjs | null) => {
          setValue(newValue);
        }}
      />
    </Wrapper>
  );
}
