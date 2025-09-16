import { EyeClosedIcon } from "@/components/icons/EyeClosed";
import { EyeOpenIcon } from "@/components/icons/EyeOpen";
import {
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useField } from "formik";
import { useState } from "react";

const Wrapper = styled("div")`
  position: relative;
  width: 100%;

  .MuiFormHelperText-root {
    line-height: 21px !important;
    position: absolute !important;
    bottom: -20px !important;
    font-size: 12px !important;
    color: ${({ theme }) => theme.palette.error.main} !important;
    margin-bottom: 0 !important;
  }
  input:-webkit-autofill {
    border-bottom-left-radius: inherit !important;
    border-bottom-right-radius: inherit !important;
  }
`;

export function Input({
  type,
  defaultValue,
  iconStart,
  loading,
  iconEnd,
  InputProps,
  size = "medium",
  variant = "filled",
  style = {},
  ...props
}: any) {
  const [field, meta] = useField({ type, ...props });

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <Wrapper style={style}>
      {type === "password" ? (
        <TextField
          {...field}
          {...props}
          size={size}
          defaultValue={defaultValue}
          fullWidth
          variant={variant}
          type={showPassword ? "text" : "password"}
          error={meta.touched && meta.error ? true : false}
          helperText={meta.touched && meta.error ? meta.error : undefined}
          InputProps={{
            ...InputProps,
            startAdornment: props.iconStart ? (
              <InputAdornment position="start">
                {props.iconStart}
              </InputAdornment>
            ) : null,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                  size={size}
                  tabIndex={-1}
                  style={{
                    marginRight: -5,
                    height: size === "small" ? 35 : 44,
                  }}
                >
                  {loading ? (
                    <CircularProgress size={20} />
                  ) : showPassword ? (
                    <EyeClosedIcon />
                  ) : (
                    <EyeOpenIcon />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      ) : (
        <TextField
          {...field}
          {...props}
          fullWidth
          size={size}
          error={meta.touched && meta.error ? true : false}
          helperText={meta.touched && meta.error ? meta.error : undefined}
          type={type}
          variant={variant}
          onChange={(e) => {
            if (type === "number") {
              const parsedNumber = +e.target.value;
              if (isNaN(parsedNumber)) {
                field.onChange({
                  target: { name: field.name, value: null },
                });
                return;
              }
              field.onChange({
                target: { name: field.name, value: parsedNumber || 0 },
              });
            } else {
              field.onChange({
                target: { name: field.name, value: e.target.value },
              });
            }
          }}
          InputProps={{
            ...InputProps,
            startAdornment: iconStart ? (
              <InputAdornment position="start">{iconStart}</InputAdornment>
            ) : null,
            endAdornment: iconEnd ? (
              <InputAdornment position="end">{iconEnd}</InputAdornment>
            ) : null,
            maxLength: 13,
            step: "1",
          }}
        />
      )}
    </Wrapper>
  );
}
