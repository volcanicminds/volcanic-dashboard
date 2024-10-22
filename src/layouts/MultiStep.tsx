import { ReactNode } from "react";
import { t } from "i18next";
import CssBaseline from "@mui/material/CssBaseline";
import {
  AppBar,
  Box,
  Button,
  Drawer,
  Step,
  StepLabel,
  Stepper,
  Toolbar,
  Typography,
} from "@mui/material";
import { Clear } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";

const drawerWidth = 240;

export default function MultiStepLayout({
  children,
  title,
  path,
  steps,
}: {
  children: ReactNode;
  steps: {
    id: number;
    title: string;
  }[];
  path: string;
  title?: string;
}) {
  const navigate = useNavigate();
  const { step } = useParams();

  function manageExit() {
    navigate("/");
  }

  function goToStep(code: string) {
    navigate(`${path}/${code}`);
  }

  return (
    <Box sx={{ display: "flex", position: "relative" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h3" noWrap component="div">
            {title}
          </Typography>
          <Button
            onClick={() => manageExit()}
            variant="text"
            color="primary"
            startIcon={<Clear />}
          >
            {t("general.exit")}
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto", padding: 5 }}>
          <Stepper activeStep={Number(step)} orientation="vertical">
            {steps.map((_step, index) => (
              <Step key={`multistep.stepper-step-${index}`}>
                <StepLabel>
                  {t("multistep.stepLabel", { step: index + 1 })}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
