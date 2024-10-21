import { t } from "i18next";
import SimpleCard from "@/components/common/SimpleCard";
import { Alert, Typography } from "@mui/material";
import { useState } from "react";
import Button from "../common/Button";
import { POLLING_INTERVAL } from "@/utils/constants";
import { useInterval } from "usehooks-ts";
import useToast from "@/hook/useToast";

const SERIAL_NUM = import.meta.env.VITE_SERIAL_NUMBER || "10551296";

interface BatteryTestProps {
  title: string;
  customizableEndpoint: (path: string, args?: any) => Promise<any>;
}

export default function BatteryTest({
  title,
  customizableEndpoint,
}: BatteryTestProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [shouldPoll, setShouldPoll] = useState(false);
  const [result, setResult] = useState<string>();
  const { addNotification } = useToast();

  useInterval(executeBatteryTestData, shouldPoll ? POLLING_INTERVAL : null);

  function handleError(message: string) {
    setIsLoading(false);
    setShouldPoll(false);
    addNotification(message, { variant: "error" });
  }

  async function executeBatteryTestData() {
    try {
      const batteryTestResponse = await customizableEndpoint("battery-test", {
        op: "poll",
        id: SERIAL_NUM,
      });

      if (batteryTestResponse?.result === "error") {
        const specificError = batteryTestResponse?.data?.result;
        handleError(specificError || batteryTestResponse.message);
      } else {
        if (
          batteryTestResponse?.result !== "1" &&
          batteryTestResponse?.result !== "OK"
        ) {
          if (batteryTestResponse?.result === "0") {
            setResult(t("battery-ok"));
          } else {
            setResult(t("battery-ko"));
          }
          setShouldPoll(false);
          setIsLoading(false);
        }
      }
    } catch (e: any) {
      const specificError = e?.data?.result;
      handleError(specificError || e.message);
    }
  }

  async function startTest() {
    setIsLoading(true);
    setResult(undefined);

    const batteryTestResponse = await customizableEndpoint("battery-test", {
      op: "start",
      id: SERIAL_NUM,
    });
    if (batteryTestResponse?.result === "error") {
      const specificError = batteryTestResponse?.data?.result;
      handleError(specificError || batteryTestResponse.message);
    } else {
      setShouldPoll(true);
    }
  }

  return (
    <SimpleCard title={t(title)} fullWidth>
      <Typography variant="body2" sx={{ mb: 2 }}>
        {t("battery-test-info")}
      </Typography>
      <Button
        variant="contained"
        isLoading={isLoading}
        onClick={startTest}
        sx={{ mb: 1 }}
      >
        {t("battery-test")}
      </Button>
      {result === t("battery-ok") && <Alert severity="success">{result}</Alert>}
      {result === t("battery-ko") && <Alert severity="error">{result}</Alert>}
    </SimpleCard>
  );
}
