import { Theme } from "@emotion/react";
import { ExpandMore } from "@mui/icons-material";
import {
  FormControl,
  InputLabel,
  Select as MUISelect,
  SxProps,
} from "@mui/material";
import { ElementType, ReactElement, ReactNode } from "react";

interface SelectProps {
  autoWidth?: boolean;
  disabled?: boolean;
  children?: ReactNode;
  required?: boolean;
  defaultOpen?: boolean;
  defaultValue?: any;
  displayEmpty?: boolean;
  fullWidth?: boolean;
  IconComponent?: ElementType<any, any>;
  id?: string;
  labelId?: string;
  input?: ReactElement<any, any>;
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
  };
  label?: ReactNode;
  MenuProps?: any;
  multiple?: boolean;
  native?: boolean;
  onChange?: (args: any) => void;
  onClose?: (args: any) => void;
  onOpen?: (args: any) => void;
  open?: boolean;
  renderValue?: (value: any) => ReactNode;
  SelectDisplayProps?: any;
  value?: any;
  variant?: "filled" | "outlined" | "standard";
  sx?: SxProps<Theme>;
}

export default function Select({
  fullWidth,
  id,
  label,
  required,
  ...props
}: SelectProps) {
  return (
    <FormControl fullWidth={fullWidth}>
      <InputLabel required={required} id={`input-label-${id}`}>
        {label}
      </InputLabel>
      <MUISelect {...props} IconComponent={() => <ExpandMore />} />
    </FormControl>
  );
}
