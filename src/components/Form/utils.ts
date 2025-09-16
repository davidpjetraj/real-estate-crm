import { yup } from ".";

export const emailValidation = yup.object({
  email: yup.string().email("Invalid email").required("This field is required"),
});

export const phoneValidation = yup.object({
  phone: yup
    .string()
    .matches(/^[0-9]+$/, "Invalid phone number")
    .required("This field is required"),
});
