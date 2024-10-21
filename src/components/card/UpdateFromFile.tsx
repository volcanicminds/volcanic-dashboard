import { t } from "i18next";
import SimpleCard from "@/components/common/SimpleCard";
import Button from "@/components/common/Button";
import { Box, Dialog, DialogContent, Stack, Typography } from "@mui/material";
import { useState } from "react";
import useToast from "@/hook/useToast";
import {
  DELAY_FIRMWARE_LOGIN,
  DELAY_TO_LOGOUT_UPDATE,
  FIRMWARE_POLLING_INTERVAL,
  MAX_UP_FILE_SIZE_SW,
} from "@/utils/constants";
import {
  get,
  LAST_PAGE_STORAGE_KEY,
  remove,
  TOKEN_STORAGE_KEY,
} from "@/utils/localStorage";
import useApi from "@/hook/useApi";
import { useNavigate } from "react-router-dom";
import { STATUS_FIELD } from "../ApiWrapper";
import { useInterval } from "usehooks-ts";
import LinearProgressWithLabel from "../common/LinearProgressWithLabel";
import FileInput from "@/components/common/form/inputs/FileInput";

const FIRMWARE_ID = "10551296";

export default function UpdateFromFile({
  title,
  customizableEndpoint,
  customizableEndpointPost,
  setToken,
}: {
  title: string;
  customizableEndpoint: (url: string, args?: any) => Promise<any>;
  customizableEndpointPost: (
    url: string,
    data?: any,
    config?: any
  ) => Promise<any>;
  setToken: (user: any) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [fileFirmware, setFileFirmware] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<
    "firmware" | "software" | undefined
  >();
  const [progress, setProgress] = useState(0);
  const { addNotification } = useToast();
  const navigate = useNavigate();
  const { logout } = useApi();
  const [shouldPoll, setShouldPoll] = useState(false);
  useInterval(
    pollUpgradeFirmware,
    shouldPoll ? FIRMWARE_POLLING_INTERVAL : null
  );

  async function pollUpgradeFirmware() {
    try {
      if (fileFirmware) {
        const response = await customizableEndpoint("firmware-upgrade-poll", {
          op: "poll",
          dtrow: FIRMWARE_ID,
          filename: fileFirmware.name,
        });
        if (response.result === "error") {
          addNotification(t("error-firmwareUpdate"), { variant: "error" });
          setIsLoading(undefined);
          setShouldPoll(false);
          return;
        } else if (response[STATUS_FIELD] === 200) {
          setShouldPoll(false);
          setProgress(100);
          setTimeout(function () {
            addNotification(t("import-success"), { variant: "success" });
            timeoutRedirect("/login", false);
          }, DELAY_FIRMWARE_LOGIN);
        } else if (response[STATUS_FIELD] === 203) {
          setProgress(Number(response.result || 0));
        }
      } else {
        setIsLoading(undefined);
        setShouldPoll(false);
        addNotification(t("error-noFileFirmwareUpdate"), {
          variant: "warning",
        });
      }
    } catch (e: any) {
      setIsLoading(undefined);
      setShouldPoll(false);
      addNotification(e.message, { variant: "error" });
    }
  }

  async function upgradeFirmware() {
    setIsLoading("firmware");

    if (fileFirmware) {
      if (fileFirmware.size >= MAX_UP_FILE_SIZE_SW) {
        addNotification(
          `${t("import-exceeds-size") + " " + MAX_UP_FILE_SIZE_SW}`,
          { variant: "warning" }
        );
        setIsLoading(undefined);
        return;
      }

      try {
        const response = await customizableEndpointPost(
          `firmware-upgrade?op=start&dtrow=${FIRMWARE_ID}&filename=${fileFirmware.name}`,
          fileFirmware,
          {
            headers: {
              "Cache-Control": "no-cache",
            },
          }
        );

        if (response[STATUS_FIELD] === 200) {
          setShouldPoll(true);
        } else {
          addNotification(t("import-error"), { variant: "error" });
          setIsLoading(undefined);
        }
      } catch (e: any) {
        addNotification(e.message, { variant: "error" });
        setIsLoading(undefined);
      }
    }
  }

  function handleSelectFileFirmware(file: File | null) {
    setFileFirmware(file);
  }

  function handleSelectFile(file: File | null) {
    setFile(file);
  }

  async function timeoutRedirect(path: string, shouldLogout = true) {
    const AuthToken = get(TOKEN_STORAGE_KEY);
    if (shouldLogout) {
      try {
        await logout({ auth: AuthToken });
      } catch (e) {
        console.warn(e);
      }
    }

    setFile(null);
    setFileFirmware(null);
    setIsLoading(undefined);
    setProgress(0);
    remove(TOKEN_STORAGE_KEY);
    remove(LAST_PAGE_STORAGE_KEY);
    setToken(null);
    navigate(path);
  }

  async function executeUpdateFromFile() {
    const re = /^application_(.*)\.(bin)$/;

    if (file !== null) {
      setIsLoading("software");

      const fileok = re.exec(file.name);
      if (!fileok) {
        addNotification(t("import-incorrect-extension"), {
          variant: "warning",
        });
        setIsLoading(undefined);
        return;
      }

      if (file.size >= MAX_UP_FILE_SIZE_SW) {
        addNotification(
          `${t("import-exceeds-size") + " " + MAX_UP_FILE_SIZE_SW}`,
          { variant: "warning" }
        );
        setIsLoading(undefined);
        return;
      }
      try {
        const response = await customizableEndpointPost(
          `software-upgrade?op=start&filename=${file.name}`,
          file,
          {
            headers: {
              "Cache-Control": "no-cache",
            },
          }
        );

        if (response.result === "error") {
          addNotification(t("import-error"), { variant: "error" });

          setTimeout(async () => {
            timeoutRedirect("/login");
          }, DELAY_TO_LOGOUT_UPDATE);
          return;
        }

        setTimeout(async () => {
          timeoutRedirect("/waiting", false);
        }, DELAY_TO_LOGOUT_UPDATE);
      } catch (e: any) {
        addNotification(e.message, { variant: "error" });
        setIsLoading(undefined);
      }
    }
  }

  return (
    <>
      <SimpleCard title={t(title)} fullWidth>
        <Box>
          <Typography variant="body1" sx={{ py: 1 }}>
            {t("cu-fw-upg-label")}
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            alignItems={{ sm: "center" }}
          >
            <Box maxWidth={{ sm: 300 }}>
              <FileInput
                file={fileFirmware}
                inputProps={{ accept: ".bin" }}
                placeholder={t("firmwareUpgrade-placeholder")}
                onChange={handleSelectFileFirmware}
              />
            </Box>
            <Button
              disabled={!fileFirmware || !!isLoading}
              isLoading={isLoading === "firmware"}
              sx={{ mt: 2 }}
              variant="contained"
              onClick={upgradeFirmware}
            >
              {t("cu-fw-upgrade-btn")}
            </Button>
          </Stack>
        </Box>

        <Dialog onClose={() => null} open={isLoading === "firmware"}>
          <DialogContent>
            <Typography>{t("upgrade-cb-row")}</Typography>
            <LinearProgressWithLabel value={progress} />
          </DialogContent>
        </Dialog>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" sx={{ py: 1 }}>
            {t("cu-sw-upg-label")}
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            alignItems={{ sm: "center" }}
          >
            <Box maxWidth={{ sm: 300 }}>
              <FileInput
                file={file}
                inputProps={{ accept: ".bin" }}
                placeholder={t("softwareUpgrade-placeholder")}
                onChange={handleSelectFile}
              />
            </Box>
            <Button
              disabled={!file || !!isLoading}
              isLoading={isLoading === "software"}
              sx={{ mt: 2 }}
              variant="contained"
              onClick={executeUpdateFromFile}
            >
              {t("cu-sw-upgrade")}
            </Button>
          </Stack>
        </Box>
      </SimpleCard>
    </>
  );
}
