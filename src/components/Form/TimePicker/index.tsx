"use client";

import { TimePickerIcon } from "@/components/icons/TimePickerIcon";
import { styled } from "@mui/material";
import { TimePicker as MuiTimePicker } from "@mui/x-date-pickers-pro";
import { Dayjs } from "dayjs";
import { useField } from "formik";
import React from "react";

const Wrapper = styled("div")`
  position: relative;
  width: 100%;

  .MuiFormHelperText-root {
    line-height: 21px;
    position: absolute;
    bottom: -39px;
    font-size: 12px;
    color: ${({ theme }) => theme.palette.error.main} !important;
  }
  input:-webkit-autofill {
    border-bottom-left-radius: inherit !important;
    border-bottom-right-radius: inherit !important;
  }
`;

export function TimePicker({ disabled, style, ...props }: any) {
  const [field, meta] = useField(props);

  return (
    <Wrapper style={style}>
      <MuiTimePicker
        {...field}
        {...props}
        disabled={disabled}
        format="HH:mm"
        slots={{
          openPickerIcon: TimePickerIcon,
        }}
        slotProps={{
          textField: {
            variant: props.variant || "filled",
            fullWidth: true,
            size: props.size || "large",
            error: meta.touched && Boolean(meta.error),
            helperText: meta.touched && meta.error ? meta.error : undefined,
          },
        }}
        onChange={(value: Dayjs | null) => {
          field.onChange({
            target: { name: field.name, value: value },
          });
        }}
      />
    </Wrapper>
  );
}
