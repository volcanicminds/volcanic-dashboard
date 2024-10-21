import { ComponentFooter } from "@/types";
import { Box, Stack, Typography } from "@mui/material";
import { t } from "i18next";

function Footer({ footer }: { footer: ComponentFooter }) {
  return (
    <Stack direction="column" spacing={2} py={2}>
      {footer.image && (
        <Box
          component="img"
          src={footer.image.path}
          width={footer.image.width}
        />
      )}
      {footer.legenda && (
        <Stack direction="row" rowGap={2} flexWrap="wrap">
          {(footer.legenda || []).map((legenda, index) => (
            <Stack
              key={`${legenda.label}-${index}`}
              direction="row"
              spacing={1}
              mr={2}
            >
              <Box
                width="20px"
                height="20px"
                bgcolor={legenda.color}
                flex="none"
              />
              <Typography variant="body2">{t(legenda.label)}</Typography>
              <Typography variant="body2">
                {legenda.withNote ? <sup>*</sup> : ""}
              </Typography>
            </Stack>
          ))}
        </Stack>
      )}
      {(footer.notes || []).map((note, index) => (
        <Typography key={`note-${index}`} variant="body2">
          {t(note)}
        </Typography>
      ))}
    </Stack>
  );
}

export default Footer;
