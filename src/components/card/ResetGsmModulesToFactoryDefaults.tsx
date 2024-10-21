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

export default function ResetGsmModulesToFactoryDefaults({
  title,
  configurableEndpoint,
  dataFields: fields = [],
  forceReload,
}: {
  title: string;
  configurableEndpoint: (path: string, args?: any) => Promise<any>;
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
      const gprsId = fields.find((f) => f.alias === "gprsId")?.data || "";
      const modemId = fields.find((f) => f.alias === "modemId")?.data || "";
      const phoneId = fields.find((f) => f.alias === "phoneId")?.data || "";

      const responses = await Promise.all([
        //GPRS
        gprsId != null &&
          configurableEndpoint("edit", {
            type: "gprs",
            name: "gprs_phone_code",
            value: "*99***1#",
            DT_RowId: gprsId,
          }),
        gprsId != null &&
          configurableEndpoint("edit", {
            type: "gprs",
            name: "gprs_user",
            value: "",
            DT_RowId: gprsId,
          }),
        gprsId != null &&
          configurableEndpoint("edit", {
            type: "gprs",
            name: "gprs_password",
            value: "",
            DT_RowId: gprsId,
          }),
        //MODEM
        modemId != null &&
          configurableEndpoint("edit", {
            type: "modem",
            name: "gsm_test_interval",
            value: "60",
            DT_RowId: modemId,
          }),
        modemId != null &&
          configurableEndpoint("edit", {
            type: "modem",
            name: "gsm_test_retries",
            value: "5",
            DT_RowId: modemId,
          }),
        //PHONE
        phoneId != null &&
          configurableEndpoint("edit", {
            type: "phone",
            name: "jamming_alarm",
            value: "0",
            DT_RowId: phoneId,
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
