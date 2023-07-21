import CssBaseline from "@mui/material/CssBaseline";
import { Box, IconButton, Typography } from "@mui/material";
import Sidebar from "@/components/sidebar";
import { Menu } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { openDrawer } from "@/app/store/customizationSlice";
import { RootState } from "@/app/store";
import { MainLayoutProps } from "@/types/layout";

export default function MainLayout({ children, title }: MainLayoutProps) {
  const dispatch = useDispatch();
  const open = useSelector(
    (state: RootState) => state.customization.isDrawerOpen
  );

  const handleDrawer = () => {
    dispatch(openDrawer({ open: !open }));
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ width: "100%", display: { xs: "flex", sm: "block" } }}>
          <IconButton
            sx={{ display: { xs: "block", sm: "none" } }}
            onClick={handleDrawer}
          >
            <Menu />
          </IconButton>
          <Typography variant="h1">{title}</Typography>
        </Box>
        {children}
      </Box>
    </Box>
  );
}
