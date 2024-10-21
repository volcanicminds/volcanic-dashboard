import { TimePicker as MUITimePicker } from "@mui/x-date-pickers/TimePicker";
import { HTMLInputTypeAttribute, ReactNode } from "react";

interface TimePickerProps {
  color?: "primary" | "secondary" | "error" | "info" | "success" | "warning";
  size?: "medium" | "small";
  disabled?: boolean;
  defaultValue?: any;
  error?: boolean;
  fullWidth?: boolean;
  id?: string;
  inputProps?: {
    "aria-label"?: string;
    form?: string;
    max?: number | string;
    maxLength?: number;
    min?: number | string;
    minLength?: number;
    pattern?: string;
    readOnly?: boolean;
    step?: number | string;
    sx?:
      | Array<(args: any) => any | object | boolean>
      | ((args: any) => any)
      | object;
  };
  InputProps?: any;
  label?: string;
  maxRows?: number | string;
  minRows?: number | string;
  multiline?: boolean;
  name?: string;
  onChange?: (args: any) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number | string;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  type?: HTMLInputTypeAttribute;
  value?: any;
  variant?: "filled" | "outlined" | "standard";
}

export default function TimePicker(props: TimePickerProps) {
  return (
    <MUITimePicker
      {...props}
      slotProps={{ textField: { variant: "standard" } }}
    />
  );
}
