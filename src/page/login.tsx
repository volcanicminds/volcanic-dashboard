import { Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Button from "@/components/common/Button";
import { useState, useEffect } from "react";
import useApi from "@/hook/useApi";
import ACTIONS from "@/utils/actions";
import useToast from "@/hook/useToast";
import { t } from "i18next";
import { get, LAST_PAGE_STORAGE_KEY } from "@/utils/localStorage";
import { PIN_LENGTH } from "@/utils/constants";
import PinCode from "@/components/common/PinCode";
import { useAuth } from "@/components/AuthProvider";

export default function Login() {
  const navigate = useNavigate();
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setToken } = useAuth();
  const { login, logout } = useApi();
  const { addNotification } = useToast();

  function setTokenAndNavigate(token: string) {
    setToken(token);
    const lastPage = get(LAST_PAGE_STORAGE_KEY);
    navigate(lastPage || "/");
  }

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      const firstLoginResponse = await login(pin);

      setTokenAndNavigate(firstLoginResponse.result);
    } catch (e: any) {
      addNotification(e.message, { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const inputs = document.querySelectorAll<HTMLInputElement>(".pin-input");
    pin.split("").forEach((char, index) => {
      if (inputs[index]) {
        inputs[index].value = char;
      }
    });
  }, [pin]);

  const isPinValid = pin.length <= PIN_LENGTH && /^\d{4,6}$/.test(pin);

  return (
    <Stack spacing={5}>
      <Stack spacing={-1} className="welcome-title">
        <Typography variant="h3" fontWeight={100} sx={{ opacity: 0.68 }}>
          {t("login-welcome")}
        </Typography>
        <Typography variant="h3" fontWeight={700}>
          {t("login-back")}
        </Typography>
      </Stack>
      <Stack spacing={0.5}>
        <Typography>{t("login-password")}</Typography>
        <PinCode
          name="login"
          onChange={(_name, pin) => setPin(pin)}
          isLoading={isLoading}
          onSubmit={onSubmit}
        />
      </Stack>
      <Button
        variant="contained"
        onClick={onSubmit}
        disabled={!isPinValid || isLoading}
        isLoading={isLoading}
      >
        {t("login-submit")}
      </Button>
    </Stack>
  );
}
