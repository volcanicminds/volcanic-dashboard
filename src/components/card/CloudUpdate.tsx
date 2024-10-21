import { t } from "i18next";
import SimpleCard from "@/components/common/SimpleCard";
import {
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { ReactNode, useMemo, useState } from "react";
import Button from "../common/Button";
import useToast from "@/hook/useToast";
import { DataField } from "@/types";
import dayjs from "dayjs";
import {
  LAST_PAGE_STORAGE_KEY,
  remove,
  TOKEN_STORAGE_KEY,
} from "@/utils/localStorage";
import { useNavigate } from "react-router-dom";
import { DELAY_TO_LOGOUT } from "@/utils/constants";

interface CloudUpdateProps {
  title: string;
  configurableEndpoint: (path: string, args?: any) => Promise<any>;
  dataFields: DataField[];
  forceReload: () => void;
  setToken: (user: any) => void;
}

export default function CloudUpdate({
  title,
  configurableEndpoint,
  dataFields: fields = [],
  forceReload,
  setToken,
}: CloudUpdateProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogContent, setDialogContent] = useState<ReactNode>();
  const { addNotification } = useToast();
  const navigate = useNavigate();

  const isWorkingOnline = useMemo(
    () => fields.find((f) => f.alias === "online")?.data === true,
    [fields]
  );

  async function executeCloudCheck() {
    try {
      setIsLoading(true);
      const time = fields.find((f) => f.alias === "time") || { data: "" };

      // Remove Timezone
      const aTmp = (time.data as string).split(" ");
      const eTime = aTmp[0] + " " + aTmp[1];
      const timenow = dayjs(eTime).format("YYYY-MM-DD hh:mm");
      const currentdate = new Date();
      const timecheck = dayjs(currentdate).format("YYYY-MM-DD hh:mm");
      let isUpgradable = false;

      if (timenow !== timecheck) {
        addNotification(t("not-time-ok"), { variant: "error" });
        return;
      }

      const response = await configurableEndpoint("get-pkg-updates");

      if (response?.result == "error") {
        setIsLoading(false);
        addNotification(response.message, { variant: "error" });
      } else if (response?.result !== "OK") {
        setIsLoading(false);
        addNotification(t("cu-update-error"), { variant: "error" });
      } else if (response?.packages == null) {
        setIsLoading(false);
        addNotification(t("cu-noupdate-msg"), { variant: "info" });
      } else {
        let dialogInfo: ReactNode = "";

        for (let i = 0; i < Object.keys(response.packages).length; i++) {
          let key = Object.keys(response.packages)[i];
          const value = response.packages[key];

          if (key === "secumgr") {
            isUpgradable = true;

            dialogInfo = (
              <>
                <Typography
                  sx={{
                    fontWeight: "bold",
                  }}
                >
                  {t("cu-newaupdate-msg")}
                </Typography>
                <Typography>
                  {t("secumgr-ipk")} <strong>{value}</strong>
                </Typography>
                <Typography>{t("cu-ok-update-msg")}</Typography>
              </>
            );
          }
        }
        if (isUpgradable === false) {
          addNotification(t("cu-noupdate-msg"), { variant: "info" });
        }

        if (isUpgradable) {
          setDialogContent(dialogInfo);
          setOpenDialog(true);
        }
        setIsLoading(false);
      }
    } catch (e: any) {
      setIsLoading(false);
      addNotification(e.message, { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  }

  const handleCloseDialog = () => {
    forceReload();
    setOpenDialog(false);
  };

  const handleSoftwareUpgrade = async () => {
    try {
      setIsLoading(true);
      const response = await configurableEndpoint("upgrade-packages");

      if (response?.result == "error") {
        setIsLoading(false);
        addNotification(response.message, { variant: "error" });
        return;
      } else {
        setTimeout(async () => {
          setIsLoading(false);
          remove(TOKEN_STORAGE_KEY);
          remove(LAST_PAGE_STORAGE_KEY);
          setToken(null);
          navigate("/waiting");
        }, DELAY_TO_LOGOUT);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SimpleCard title={t(title)} fullWidth>
        <Typography variant="body1">{t("cu-fw-sw-upd-cloud")}</Typography>
        <Button
          sx={{ mt: 2 }}
          disabled={isLoading || !isWorkingOnline}
          variant="contained"
          isLoading={isLoading}
          onClick={executeCloudCheck}
        >
          {t("cu-fw-sw-upd-cloud-btn")}
        </Button>
      </SimpleCard>
      <Dialog onClose={handleCloseDialog} open={openDialog}>
        <DialogTitle
          sx={{
            fontSize: "1.2rem",
          }}
        >
          {t("confirm")}
        </DialogTitle>
        <DialogContent>
          {dialogContent}
          <Alert sx={{ mt: 1 }} severity="warning">
            {t("cu-upgrade-warning")}
          </Alert>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "space-between",
          }}
        >
          <Button
            disabled={isLoading}
            variant="outlined"
            onClick={handleCloseDialog}
          >
            {t("cancel")}
          </Button>
          <Button
            disabled={isLoading}
            variant="contained"
            onClick={handleSoftwareUpgrade}
          >
            {t("ok")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
