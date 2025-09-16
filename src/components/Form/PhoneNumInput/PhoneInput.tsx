import { TextField } from "@mui/material";
import { forwardRef } from "react";

const phoneInput = (props: any, ref: any) => {
  return <TextField variant="filled" {...props} inputRef={ref} fullWidth />;
};
export default forwardRef(phoneInput);
