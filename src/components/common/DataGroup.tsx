import { Box, Stack, Tooltip, Typography } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { t } from "i18next";

interface DataGroupProps {
  title: string;
  data: any;
  result?: "ok" | "ko" | string;
  resultLabel?: string;
  firmwareToUpdate?: boolean;
}

export default function DataGroup({
  title,
  data,
  result,
  resultLabel,
  firmwareToUpdate,
}: DataGroupProps) {
  return (
    <Stack direction="column" spacing={-0.5} minWidth={0}>
      <Typography className="label">{title}</Typography>
      <Stack direction="row" alignItems="center" spacing={0.5}>
        {result && (
          <Box
            width={14}
            height={14}
            borderRadius={100}
            bgcolor={
              result === "ok"
                ? (theme) => theme.palette.success.main
                : result === "ko"
                  ? (theme) => theme.palette.error.main
                  : result
            }
            flex="none"
          />
        )}
        {resultLabel && <Typography>{t(resultLabel)}</Typography>}
        <Stack
          justifyContent="space-between"
          direction="row"
          spacing={0.5}
          alignItems="center"
        >
          <Typography className="value" sx={{ wordBreak: "break-word" }}>
            {typeof data === "string" ? t(data) : data}
          </Typography>
          {firmwareToUpdate && (
            <Tooltip
              title={t("upg-avl")}
              sx={{ cursor: "pointer", height: 20 }}
            >
              <InfoIcon />
            </Tooltip>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}
