import {
  FilledInput,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import { HTMLInputTypeAttribute, ReactNode, useMemo, useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

interface BasicInputProps {
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
  onBlur?: (args: any) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number | string;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  type?: HTMLInputTypeAttribute;
  value?: any;
  variant?: "filled" | "outlined" | "standard";
  helperText?: ReactNode;
}

export default function BasicInput({
  startAdornment,
  endAdornment,
  ...props
}: BasicInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const InputProps = useMemo(() => {
    return { ...(props.InputProps || {}), startAdornment, endAdornment };
  }, [startAdornment, endAdornment]);

  const InputElement =
    props.variant === "outlined"
      ? OutlinedInput
      : props.variant === "filled"
        ? FilledInput
        : Input;

  return props.type === "password" ? (
    <FormControl variant={props.variant}>
      <InputLabel htmlFor={props.id}>{props.label}</InputLabel>
      <InputElement
        {...props}
        type={showPassword ? "text" : "password"}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
      />
    </FormControl>
  ) : (
    <TextField InputProps={InputProps} {...props} />
  );
}
