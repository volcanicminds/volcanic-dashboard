import { ReactNode } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { Box } from "@mui/material";

export default function SimplifiedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {children}
      </Box>
    </Box>
  );
}
