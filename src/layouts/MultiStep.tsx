import { ReactNode, useEffect, useMemo, useState } from "react";
import { t } from "i18next";
import CssBaseline from "@mui/material/CssBaseline";
import { Box, Stack, Step, StepLabel, Stepper } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Button from "@/components/common/Button";
import SimpleCard from "@/components/common/SimpleCard";

export default function MultiStepLayout({
  children = [],
  steps,
}: {
  children: ReactNode[];
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

  const currentStep = useMemo(() => Number(step), [step]);

  const handleNext = () => {
    const newPath = location.pathname.replace(
      `${currentStep}`,
      `${currentStep + 1}`
    );
    navigate(newPath);
  };

  const handleBack = () => {
    const newPath = location.pathname.replace(
      `${currentStep}`,
      `${currentStep - 1}`
    );
    navigate(newPath);
  };

  return (
    <Box sx={{ display: "flex", position: "relative" }}>
      <CssBaseline />
      <Box sx={{ overflow: "auto", padding: 5 }}>
        <Stepper activeStep={currentStep} orientation="vertical">
          {steps.map((_step, indexSteps) => (
            <Step key={`multistep.stepper-step-${indexSteps}`}>
              <StepLabel>
                {t("multistep.stepLabel", { step: indexSteps + 1 })}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {(children as any[])[currentStep]}
        <SimpleCard width="100%">
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            {currentStep > 0 && (
              <Button variant="text" onClick={handleBack}>
                {t("multistep.back")}
              </Button>
            )}
            {currentStep < steps?.length - 1 && (
              <Button variant="contained" onClick={handleNext}>
                {t("multistep.next")}
              </Button>
            )}
          </Stack>
        </SimpleCard>
      </Box>
    </Box>
  );
}
