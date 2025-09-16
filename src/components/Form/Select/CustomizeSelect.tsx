import styled from "@emotion/styled";
import { Box, Chip, FormHelperText, Select } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { SelectChangeEvent } from "@mui/material/Select";
import { useField } from "formik";
import * as React from "react";

interface ItemProps {
  value: string;
  label: string;
  color?: string;
}

interface CustomizeSelectProps {
  name: string;
  label?: string;
  options: ItemProps[];
  size?: "small" | "medium";
  variant?: "filled" | "outlined" | "standard";
  multiple?: boolean;
  disabled?: boolean;
  chipColor?: string;
  renderAsChips?: boolean;
  style?: React.CSSProperties;
  onChange?: (
    event: SelectChangeEvent<string | string[]>,
    helpers: {
      setValue: (val: any) => void;
      setTouched: (touched: boolean) => void;
    }
  ) => void;
}

const Wrapper = styled("div")<{ marginBottom?: string }>`
  position: relative;
  .MuiFormHelperText-root {
    line-height: 21px;
    position: absolute;
    bottom: -15px;
    white-space: nowrap;
  }
`;

export const CustomizeSelect: React.FC<CustomizeSelectProps> = ({
  name,
  label,
  options,
  size = "medium",
  variant = "filled",
  multiple = false,
  disabled = false,
  chipColor,
  renderAsChips = false,
  style,
  onChange,
}) => {
  const [field, meta, helpers] = useField<string | string[]>(name);
  const { value } = field;
  const { setValue, setTouched } = helpers;
  const error = Boolean(meta.touched && meta.error);

  const handleChange = (event: SelectChangeEvent<string | string[]>) => {
    const val = event.target.value;
    setValue(val);
    if (onChange) onChange(event, { setValue, setTouched });
  };

  return (
    <Wrapper style={style}>
      <FormControl
        fullWidth
        size={size}
        variant={variant}
        error={error}
        disabled={disabled}
      >
        {label && <InputLabel id={`${name}-label`}>{label}</InputLabel>}

        <Select
          labelId={`${name}-label`}
          id={name}
          name={name}
          multiple={multiple}
          value={value ?? (multiple ? [] : "")}
          onChange={handleChange}
          onBlur={() => setTouched(true)}
          renderValue={(selected) => {
            if (renderAsChips) {
              const selectedArray = Array.isArray(selected)
                ? selected
                : [selected];
              return (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selectedArray.map((val) => {
                    const item = options.find((o) => o.value === val);
                    return (
                      <Chip
                        key={val}
                        size="small"
                        label={item?.label}
                        sx={{
                          maxHeight: "20px",
                          fontWeight: 600,
                          color: "#fff",
                          backgroundColor: item?.color ?? chipColor,
                        }}
                      />
                    );
                  })}
                </Box>
              );
            }
            const vals = Array.isArray(selected) ? selected : [selected];
            return options
              .filter((o) => vals.includes(o.value))
              .map((o) => o.label)
              .join(", ");
          }}
          label={label}
        >
          {options.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {renderAsChips ? (
                <Chip
                  size="small"
                  label={opt.label}
                  sx={{
                    maxHeight: "20px",
                    fontWeight: 600,
                    color: "#fff",
                    backgroundColor: opt.color ?? chipColor,
                  }}
                />
              ) : (
                opt.label
              )}
            </MenuItem>
          ))}
        </Select>

        {error && <FormHelperText>{meta.error}</FormHelperText>}
      </FormControl>
    </Wrapper>
  );
};
