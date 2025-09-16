// import { InputAdornment, styled } from "@mui/material";
// import { useField } from "formik";
// import { useState } from "react";

// import MUIPhoneInput from "./PhoneInput";

// const Wrapper = styled("div")`
//   position: relative;
//   width: 100%;

//   .MuiFormHelperText-root {
//     line-height: 21px;
//     position: absolute;
//     bottom: -39px;
//     font-size: 12px;
//     color: ${({ theme }) => theme.palette.error.main} !important;
//   }
//   input:-webkit-autofill {
//     border-bottom-left-radius: inherit !important;
//     border-bottom-right-radius: inherit !important;
//   }
// `;

// export function PhoneNumberPickerWithFormik({ style, ...props }: any) {
//   const [field, meta, helpers] = useField(props);

//   const findCountry = (phoneNumber: Value) => {
//     if (!phoneNumber) {
//       return undefined;
//     }
//     const parsedNumber = parsePhoneNumber(phoneNumber);
//     const countryCode = parsedNumber?.country;

//     return countryCode;
//   };

//   const [country, setCountry] = useState<Country | undefined>(
//     findCountry(field.value) || undefined
//   );

//   const { setValue, setTouched, setError } = helpers;

//   const handlePhoneNumberChange = (phoneNumber: Value) => {
//     setTouched(true, true); // Mark field as touched and trigger validation
//     setValue(phoneNumber || "");

//     if (!phoneNumber) {
//       setError("Phone number is required"); // Set error for empty value
//       return;
//     }

//     const parsedNumber = parsePhoneNumber(phoneNumber);
//     const countryCode = parsedNumber?.country;

//     if (countryCode) {
//       setCountry(countryCode);
//     }

//     if (!parsedNumber || !isValidPhoneNumber(phoneNumber, countryCode)) {
//       setError("Invalid phone number");
//     } else {
//       setError(undefined);
//     }
//   };

//   const handleBlur = () => {
//     setTouched(true, true); // Mark field as touched
//     if (!field.value) {
//       setError("Phone number is required"); // Set error for empty value
//     }
//   };

//   const FlagComponent: any = country ? flags[country] : null;

//   return (
//     <Wrapper>
//       <PhoneInput
//         {...props}
//         style={style}
//         value={field.value}
//         error={meta.touched && meta.error ? "error" : undefined}
//         helperText={meta.touched && meta.error ? meta.error : undefined}
//         inputComponent={MUIPhoneInput}
//         onChange={handlePhoneNumberChange}
//         onBlur={handleBlur} // Handle blur event
//         InputProps={{
//           startAdornment: country ? (
//             <InputAdornment position="start">
//               <FlagComponent style={{ width: 24, height: 24 }} />
//             </InputAdornment>
//           ) : null,
//         }}
//       />
//     </Wrapper>
//   );
// }
