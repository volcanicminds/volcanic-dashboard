import { Stack, Link, Typography } from "@mui/material";
import { t } from "i18next";

export default function NoMatch() {
  return (
    <Stack spacing={3}>
      <Stack spacing={-1}>
        <Typography variant="h3" fontWeight={100}>
          {t("404-title")}
        </Typography>
        <Typography component={Link} href="/" variant="h3" fontWeight={700}>
          {t("404-back")}
        </Typography>
      </Stack>
      <Stack spacing={0}>
        <Typography>{t("404-content")}</Typography>
      </Stack>
    </Stack>
  );
}
