import { WAITING_POLLING_TIMEOUT } from "@/utils/constants";
import { Stack, Typography, CircularProgress } from "@mui/material";
import { t } from "i18next";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Waiting() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/login");
    }, WAITING_POLLING_TIMEOUT);
  }, []);

  return (
    <Stack spacing={5}>
      <Stack spacing={-1}>
        <Typography variant="h3" fontWeight={100} sx={{ opacity: 0.68 }}>
          {t("waiting-please")}
        </Typography>
        <Typography variant="h3" fontWeight={700}>
          {t("waiting-wait")}
        </Typography>
      </Stack>
      <Stack alignItems="center" spacing={5}>
        <CircularProgress size={80} />
        <Typography>{t("waiting-content")}</Typography>
      </Stack>
    </Stack>
  );
}
