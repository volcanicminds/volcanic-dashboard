import { useState } from "react";
import Button from "@/components/common/Button";
import SimpleCard from "@/components/common/SimpleCard";
import { t } from "i18next";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { DataField } from "@/types";
import useToast from "@/hook/useToast";

export default function ResetPstnModulesToFactoryDefaults({
  title,
  customizableEndpoint,
  dataFields: fields = [],
  forceReload,
}: {
  title: string;
  customizableEndpoint: (path: string, args?: any) => Promise<any>;
  dataFields: DataField[];
  forceReload: () => void;
}) {
  const [openedConfirmDialog, setOpenedConfirmDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addNotification } = useToast();

  function openConfirmDialog() {
    setOpenedConfirmDialog(true);
  }

  function handleCloseDialog() {
    setOpenedConfirmDialog(false);
  }

  async function resetGSMAdvancedOptions() {
    try {
      setIsLoading(true);
      const modemId = fields.find((f) => f.alias === "modemId")?.data || "";
      if (modemId != null) {
        const responses = await Promise.all([
          customizableEndpoint("edit", {
            type: "modem",
            name: "pstn_test_interval",
            value: "60",
            DT_RowId: modemId,
          }),
          customizableEndpoint("edit", {
            type: "modem",
            name: "pstn_test_retries",
            value: "5",
            DT_RowId: modemId,
          }),
          customizableEndpoint("edit", {
            type: "modem",
            name: "pstn_test_mode",
            value: "0",
            DT_RowId: modemId,
          }),
          customizableEndpoint("edit", {
            type: "modem",
            name: "pstn_dtmf_pause_period",
            value: "100",
            DT_RowId: modemId,
          }),
          customizableEndpoint("edit", {
            type: "modem",
            name: "pstn_dtmf_tone_period",
            value: "100",
            DT_RowId: modemId,
          }),
          customizableEndpoint("edit", {
            type: "modem",
            name: "pstn_dtmfcid_pause_period",
            value: "55",
            DT_RowId: modemId,
          }),
          customizableEndpoint("edit", {
            type: "modem",
            name: "pstn_dtmfcid_tone_period",
            value: "55",
            DT_RowId: modemId,
          }),
          customizableEndpoint("edit", {
            type: "modem",
            name: "pstn_dtmfcid_delay",
            value: "250",
            DT_RowId: modemId,
          }),
          customizableEndpoint("edit", {
            type: "modem",
            name: "pstn_line_timeout",
            value: "5",
            DT_RowId: modemId,
          }),
          customizableEndpoint("edit", {
            type: "modem",
            name: "pstn_ring_timeout",
            value: "5",
            DT_RowId: modemId,
          }),
        ]);

        const hasErrors = responses.some((r) => r.result === "error");
        if (hasErrors) {
          addNotification(t("error"), { variant: "error" });
        } else {
          addNotification(t("reset-factory-default-success"), {
            variant: "success",
          });
        }
      } else {
        addNotification(t("error-badConfiguration"), { variant: "warning" });
      }
    } catch (e: any) {
      addNotification(e.message, { variant: "error" });
    } finally {
      setIsLoading(false);
      setOpenedConfirmDialog(false);
      forceReload();
    }
  }

  return (
    <>
      <SimpleCard title={t(title)} fullWidth>
        <Button
          disabled={isLoading}
          variant="contained"
          color="primary"
          onClick={openConfirmDialog}
        >
          {t("cm-rstadvopt1")}
        </Button>
      </SimpleCard>
      <Dialog onClose={handleCloseDialog} open={openedConfirmDialog}>
        <DialogTitle
          sx={{
            fontSize: "1.2rem",
          }}
        >
          {t("confirm")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{t("cm-confirm-rstadvopt1")}</DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "space-between",
          }}
        >
          <Button
            variant="outlined"
            color="warning"
            onClick={handleCloseDialog}
          >
            {t("cancel")}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={resetGSMAdvancedOptions}
            isLoading={isLoading}
            disabled={isLoading}
            autoFocus
          >
            {t("ok")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
