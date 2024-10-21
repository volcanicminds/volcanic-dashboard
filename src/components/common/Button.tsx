import {
  Button as MUIButton,
  IconButton,
  CircularProgress,
  SxProps,
  Theme,
} from "@mui/material";
import { ReactNode } from "react";

interface ButtonProps {
  id?: string;
  size?: "small" | "medium" | "large";
  label?: string;
  icon?: ReactNode;
  onClick?: (event?: any) => void;
  variant?: "text" | "contained" | "outlined";
  disabled?: boolean;
  isLoading?: boolean;
  color?:
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning";
  //To add more cases we have to define a palette
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  isIconButton?: boolean;
  children?: ReactNode;
  sx?: SxProps<Theme>;
  loaderSize?: string;
  autoFocus?: boolean;
  type?: "button" | "submit" | "reset";
}

const Button = ({
  icon,
  isIconButton,
  isLoading,
  disabled,
  children,
  loaderSize = "25px",
  startIcon,
  type = "button",
  ...props
}: ButtonProps) => {
  return isIconButton ? (
    <IconButton type={type} disabled={disabled || isLoading} {...props}>
      {isLoading ? <CircularProgress color="success" /> : icon}
    </IconButton>
  ) : (
    <MUIButton
      type={type}
      disabled={disabled || isLoading}
      startIcon={isLoading ? undefined : startIcon}
      {...props}
    >
      {isLoading ? (
        <CircularProgress color="success" size={loaderSize} />
      ) : (
        children
      )}
    </MUIButton>
  );
};

export default Button;
