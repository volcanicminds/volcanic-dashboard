import { Theme } from "@emotion/react";
import {
  FormControlLabel,
  Switch as MUISwitch,
  Stack,
  SxProps,
  Typography,
} from "@mui/material";
import { ChangeEvent } from "react";

interface SwitchProps {
  color?: "primary" | "secondary" | "error" | "info" | "success" | "warning";
  id: string;
  label: string;
  value: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  defaultValue?: boolean;
  sx?: SxProps<Theme>;
  sublabels?: string[];
}

export default function Switch({
  color,
  id,
  disabled,
  label,
  value,
  onChange,
  required,
  defaultValue,
  sx,
  sublabels,
}: SwitchProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.checked;
    onChange(value);
  };

  return (
    <FormControlLabel
      disabled={disabled}
      sx={sx}
      control={
        <MUISwitch
          id={id}
          required={required}
          checked={defaultValue || value}
          onChange={handleChange}
          inputProps={{ "aria-label": "controlled" }}
          color={color}
        />
      }
      label={
        <Stack>
          {label}
          {sublabels?.map((sublabel, index) => (
            <Typography key={index}>{sublabel}</Typography>
          ))}
        </Stack>
      }
    />
  );
}
