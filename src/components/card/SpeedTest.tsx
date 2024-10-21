import { t } from "i18next";
import SimpleCard from "@/components/common/SimpleCard";
import { Grid } from "@mui/material";
import DataGroup from "@/components/common/DataGroup";
import { useState } from "react";
import Button from "../common/Button";
import { POLLING_INTERVAL } from "@/utils/constants";
import { useInterval } from "usehooks-ts";
import useToast from "@/hook/useToast";
import { STATUS_FIELD } from "../ApiWrapper";

interface SpeedTestProps {
  title: string;
  configurableEndpoint: (path: string, args?: any) => Promise<any>;
  //Created for storybook
  defaultUpload?: string;
  defaultDownload?: string;
}

export default function SpeedTest({
  title,
  configurableEndpoint,
  defaultUpload = "...",
  defaultDownload = "...",
}: SpeedTestProps) {
  const [upload, setUpload] = useState(defaultUpload);
  const [download, setDownload] = useState(defaultDownload);
  const [isLoading, setIsLoading] = useState(false);
  const { addNotification } = useToast();

  useInterval(executeSpeedTestData, isLoading ? POLLING_INTERVAL : null);

  async function executeSpeedTestData() {
    try {
      const speetTestResponse = await configurableEndpoint("speed-test");

      if (speetTestResponse?.result == "error") {
        setIsLoading(false);
        addNotification(speetTestResponse.message, { variant: "error" });
      } else if (
        speetTestResponse[STATUS_FIELD] === 200 &&
        speetTestResponse.download &&
        speetTestResponse.upload
      ) {
        setIsLoading(false);
        setUpload(speetTestResponse.upload);
        setDownload(speetTestResponse.download);
      }
    } catch (e: any) {
      setIsLoading(false);
      addNotification(e.message, { variant: "error" });
    }
  }

  async function startTest() {
    setIsLoading(true);
  }

  return (
    <SimpleCard title={t(title)} fullWidth>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <DataGroup title={t("stu-download-status-label")} data={download} />
        </Grid>
        <Grid item xs={6}>
          <DataGroup title={t("stu-upload-status-label")} data={upload} />
        </Grid>
      </Grid>
      <Button
        sx={{ mt: 2 }}
        variant="contained"
        isLoading={isLoading}
        onClick={startTest}
      >
        {t("st-speed-test")}
      </Button>
    </SimpleCard>
  );
}
