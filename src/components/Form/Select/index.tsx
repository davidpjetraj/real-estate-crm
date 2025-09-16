import styled from "@emotion/styled";
import { Box, Chip, FormHelperText, Typography } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import MaterialSelect, { SelectChangeEvent } from "@mui/material/Select";
import { useField } from "formik";

interface ItemProps {
  value: string;
  label: string;
  description?: string; // Add description property
  color?: string;
}

interface Props {
  label?: string;
  name: string;
  options?: ItemProps[];
  size?: "small" | "medium" | undefined;
  multiple?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
  variant?: "filled" | "standard" | "outlined" | undefined;
  onChange?: any;
  renderAsChips?: boolean; // Add prop to control rendering as chips
}

const Wrapper = styled.div`
  position: relative;
  .MuiFormHelperText-root {
    line-height: 21px;
    margin-top: 0;
    margin-bottom: 0;
    padding: 0;
    height: 0;
    white-space: nowrap;
    font-size: 12px;
  }
`;

export function Select({
  label,
  options = [],
  size,
  disabled,
  variant = "filled",
  onChange,
  renderAsChips = false, // Default is false to render plain label unless specified
  multiple = false, // Support multiple selection
  ...props
}: Props) {
  const [field, meta, helpers] = useField(props);

  const handleChange = (event: SelectChangeEvent<any>) => {
    field.onChange(event);
    if (onChange) {
      onChange(event, helpers); // Call the passed onChange function
    }
  };

  return (
    <Wrapper style={props.style} className="select-wrapper">
      <FormControl
        size={size}
        fullWidth
        variant={variant}
        error={meta.touched && meta.error ? true : false}
        disabled={disabled}
      >
        <InputLabel id={props.name}>{label}</InputLabel>
        <MaterialSelect
          labelId={props.name}
          id={props.name}
          label={label}
          size={size}
          variant={variant}
          multiple={multiple}
          {...field}
          value={field.value || (multiple ? [] : "")}
          onChange={handleChange}
          renderValue={(selected) => {
            if (renderAsChips && Array.isArray(selected)) {
              return (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => {
                    const item = options.find((opt) => opt.value === value);
                    return (
                      <Chip
                        key={value}
                        size="small"
                        label={item?.label}
                        style={{
                          maxHeight: "20px",
                          backgroundColor: item?.color,
                          fontWeight: 600,
                          color: "white",
                        }}
                      />
                    );
                  })}
                </Box>
              );
            } else if (!Array.isArray(selected) && renderAsChips) {
              const selectedItem = options.find(
                (opt) => opt.value === selected
              );
              return (
                <Chip
                  size="small"
                  key={selected}
                  style={{
                    maxHeight: "20px",
                    backgroundColor: selectedItem?.color,
                    fontWeight: 600,
                    color: "white",
                  }}
                  label={selectedItem?.label}
                />
              );
            }
            return options
              .filter((opt) =>
                Array.isArray(selected)
                  ? selected.includes(opt.value)
                  : opt.value === selected
              )
              .map((opt) => opt.label)
              .join(", ");
          }}
          {...props}
        >
          {options.map((item: ItemProps) => (
            <MenuItem key={item.value} value={item.value}>
              <Box>
                <Typography variant="body1">{item.label}</Typography>
                {item.description && (
                  <Typography variant="body2" color="textSecondary">
                    {item.description}
                  </Typography>
                )}
              </Box>
            </MenuItem>
          ))}
        </MaterialSelect>
        <FormHelperText>
          {meta.touched && meta.error ? meta.error : " "}
        </FormHelperText>
      </FormControl>
    </Wrapper>
  );
}
