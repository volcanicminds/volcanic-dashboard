import { Box, Typography } from "@mui/material";
import { t } from "i18next";

export default function ErrorBoundaryMessage() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Typography variant="h3">{t("error-error-boundary")}</Typography>
    </Box>
  );
}
