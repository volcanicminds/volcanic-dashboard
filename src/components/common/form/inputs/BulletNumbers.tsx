import { Stack, Typography } from "@mui/material";
import { t } from "i18next";
import { useMemo } from "react";
import Button from "@/components/common/Button";

interface BulletNumbersProps {
  value: string;
  label: string;
  onChange: (args: any) => void;
}

export default function BulletNumbers({
  value = "",
  label,
  onChange,
}: BulletNumbersProps) {
  const length = useMemo(() => {
    return value.length;
  }, [value]);

  const select = (i: number) => {
    const newValue = value.split("");
    newValue[i] = newValue[i] === "1" ? "0" : "1";
    onChange(newValue.join(""));
  };

  return (
    <Stack spacing={1} direction="column">
      <Typography variant="caption">{label}</Typography>
      <Stack direction="row" flexWrap="wrap" justifyContent="center">
        {value.split("").map((v, i) => (
          <Stack
            key={`bulletNumbers-chip-${i}-${Math.random()}`}
            bgcolor={(theme) =>
              v === "1" ? theme.palette.primary.main : "rgb(205 205 205 / 50%)"
            }
            color={(theme) =>
              v === "1"
                ? theme.palette.common.white
                : theme.palette.common.black
            }
            onClick={() => select(i)}
            width={35}
            height={35}
            overflow="hidden"
            borderRadius="50%"
            alignItems="center"
            justifyContent="center"
            flex="none"
            mr={1}
            mb={1}
            sx={{ cursor: "pointer" }}
            fontWeight={v === "1" ? 700 : "unset"}
          >
            {i + 1}
          </Stack>
        ))}
      </Stack>
      <Stack spacing={1} direction="row" justifyContent="center">
        <Button
          variant="contained"
          color="secondary"
          onClick={() => onChange("0".repeat(length))}
        >
          {t("none-btn")}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onChange("1".repeat(length))}
        >
          {t("all")}
        </Button>
      </Stack>
    </Stack>
  );
}
