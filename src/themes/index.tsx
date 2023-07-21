import { ReactNode, useMemo } from "react";
import { CssBaseline, StyledEngineProvider } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Palette from "@/themes/palette";
import Typography from "@/themes/typography";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";

export default function ThemeCustomization({
  children,
}: {
  children: ReactNode;
}) {
  const mode = useSelector((state: RootState) => state.customization.theme);
  const theme = useMemo(() => Palette(mode), [mode]);
  const overrideTypography = useMemo(() => Typography('"DM Sans", Arial'), []);

  const themeOptions = useMemo(
    () => ({
      palette: theme.palette,
      typography: overrideTypography,
    }),
    [theme, overrideTypography]
  );

  const themes = createTheme(themeOptions);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
