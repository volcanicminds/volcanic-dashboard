import { Theme } from "@emotion/react";
import {
  Box,
  FormControlLabel,
  Switch as MUISwitch,
  Stack,
  SxProps,
  Typography,
} from "@mui/material";
import { ChangeEvent } from "react";
import CopyAllIcon from "@mui/icons-material/CopyAll";
import Button from "../../Button";

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
  clipBoardTexts?: string[];
  subLabelCopyFn?: (text: string) => void;
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
  clipBoardTexts,
  subLabelCopyFn,
}: SwitchProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.checked;
    onChange(value);
  };

  return (
    <Box>
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
            {sublabels?.map((sublabel, index) => {
              const hasCopyToClipboard =
                clipBoardTexts &&
                subLabelCopyFn &&
                clipBoardTexts[index] != null;

              return hasCopyToClipboard ? (
                <Stack
                  direction="row"
                  key={`switch-${index}-${Math.random()}`}
                  alignItems="center"
                >
                  <Typography sx={{ wordBreak: "break-all" }}>
                    {sublabel}
                  </Typography>
                  <Button
                    isIconButton
                    icon={<CopyAllIcon />}
                    onClick={() => subLabelCopyFn(clipBoardTexts[index])}
                  />
                </Stack>
              ) : (
                <Typography key={`switch-${index}-${Math.random()}`}>
                  {sublabel}
                </Typography>
              );
            })}
          </Stack>
        }
      />
    </Box>
  );
}
