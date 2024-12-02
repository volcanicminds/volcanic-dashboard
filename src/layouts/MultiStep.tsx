import { ReactNode, useEffect } from "react";
import { t } from "i18next";
import CssBaseline from "@mui/material/CssBaseline";
import { Box, Drawer, Step, StepLabel, Stepper } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const drawerWidth = 240;

export default function MultiStepLayout({
  children,
  steps,
}: {
  children: ReactNode;
  steps: {
    id: number;
    title: string;
  }[];
}) {
  const { step } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    if (step?.includes(":")) {
      const newPath = currentPath.replace(step, "0");
      navigate(newPath);
    } else if (!step) {
      navigate(`${currentPath}/0`);
    }
  }, [navigate, step, location?.pathname]);

  return (
    <Box sx={{ display: "flex", position: "relative" }}>
      <CssBaseline />
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
        {children}
      </Box>
    </Box>
  );
}
