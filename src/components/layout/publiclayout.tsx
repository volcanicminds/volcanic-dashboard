import { ReactNode, useMemo } from "react";
import { Box, Stack } from "@mui/material";
import SimpleCard from "@/components/common/SimpleCard";
import { images } from "@/configuration";
import useI18nEvents from "@/hook/use18nextEvents";
import Loader from "../Loader";

const theme = import.meta.env.VITE_DEFAULT_THEME;

export default function PublicLayout({ children }: { children: ReactNode }) {
  const currentThemeImages = useMemo(() => images, [theme, images]);
  const isI18nInitialized = useI18nEvents();

  return (
    <>
      {!isI18nInitialized && <Loader />}
      {isI18nInitialized && (
        <Stack
          direction={{ sx: "column", sm: "row" }}
          spacing={0}
          minHeight="100vh"
          className="login"
        >
          <Box className="left-side" />
          <Box
            zIndex={1}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            position="relative"
            px={{ xs: 5, sm: 0 }}
            className="right-side"
            gap={5}
          >
            <SimpleCard
              width={{ xs: "100%", sm: "392px" }}
              sx={{
                backgroundColor: (theme: any) =>
                  theme.palette.loginModalBg?.main,
                color: (theme: any) => theme.palette.loginText?.main,
                position: "relative",
                zIndex: 1,
              }}
              children={children}
              className="login-card"
            />
            <Stack className="logo-container" alignItems="center" py={5}>
              <Box
                component="img"
                src={
                  (
                    currentThemeImages[
                      `./themes/${theme}/images/logo-public.png`
                    ] as any
                  )?.default
                }
                sx={{ objectFit: "contain" }}
                className="logo"
                alt="Logo"
              />
            </Stack>
          </Box>
        </Stack>
      )}
    </>
  );
}
