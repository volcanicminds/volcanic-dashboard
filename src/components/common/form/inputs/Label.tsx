import { TextField, Typography } from "@mui/material";

interface LabelProps {
  value: string;
  label: string;
}

export default function Label({ value, label }: LabelProps) {
  return value ? (
    <TextField variant="standard" disabled label={label} defaultValue={value} />
  ) : (
    <Typography variant="body1" color="textSecondary">
      {label}
    </Typography>
  );
}
