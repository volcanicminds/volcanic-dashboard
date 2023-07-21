import { ReactNode } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { Box } from "@mui/material";
import PublicAppbar from "@/components/publicappbar";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <CssBaseline />
      <PublicAppbar />
      <Box sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            minHeight: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
