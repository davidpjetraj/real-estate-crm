import { TextField, TextFieldProps } from "@mui/material";
import { FormikProps } from "formik";

type FormikInputProps<T> = {
  formik: FormikProps<T>;
  field: keyof T; // Assumes T's keys are strings (or coercible to strings)
  label: string;
} & Omit<
  TextFieldProps,
  "name" | "value" | "onChange" | "onBlur" | "error" | "helperText"
>;

export const FormikInput = <T,>({
  formik,
  field,
  label,
  ...props
}: FormikInputProps<T>) => {
  // Type guard for ensuring `formik.values[field]` is renderable
  const value = formik.values[field];
  const error = formik.errors[field];
  const touched = formik.touched[field];

  return (
    <TextField
      {...props}
      fullWidth
      id={field as string} // Casting to string since Material-UI's `id` expects `string`
      name={field as string}
      label={label}
      variant="filled"
      value={value ?? ""} // Ensure a fallback empty string for `undefined`/`null`
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      error={Boolean(touched && error)}
      helperText={touched && typeof error === "string" ? error : undefined} // Only render string errors
    />
  );
};
