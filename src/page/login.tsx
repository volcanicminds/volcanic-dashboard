import { Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Button from "@/components/common/Button";
import { useState } from "react";
import useApi from "@/hook/useApi";
import useToast from "@/hook/useToast";
import { t } from "i18next";
import { get, LAST_PAGE_STORAGE_KEY } from "@/utils/localStorage";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "@/components/AuthProvider";
import Loader from "@/components/Loader";
import BasicInput from "@/components/common/form/inputs/BasicInput";
import useI18nEvents from "@/hook/use18nextEvents";

interface IFormInputs {
  email: string;
  password: string;
}

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { setToken } = useAuth();
  const { login } = useApi();
  const { addNotification } = useToast();
  const isI18nInitialized = useI18nEvents();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
  });

  function setTokenAndNavigate(token: string) {
    setToken(token);
    const lastPage = get(LAST_PAGE_STORAGE_KEY);
    navigate(lastPage || "/");
  }

  const onSubmit = async (record: IFormInputs) => {
    setIsLoading(true);
    try {
      const firstLoginResponse = await login(record.email, record.password);

      setTokenAndNavigate(firstLoginResponse.token);
    } catch (e: any) {
      addNotification(e.message, { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (name: "email" | "password", value: any) => {
    setValue(name, value, { shouldDirty: true });
  };

  //email: eve.holt@reqres.in
  //password: cityslicka

  return (
    <>
      {!isI18nInitialized && <Loader />}
      {isI18nInitialized && (
        <Stack spacing={5} component="form" onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={-1} className="welcome-title">
            <Typography variant="h3" fontWeight={100} sx={{ opacity: 0.68 }}>
              {t("login-welcome")}
            </Typography>
          </Stack>
          <Stack spacing={2}>
            <BasicInput
              label={t("login-email")}
              variant="standard"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              onChange={(event) => handleChange("email", event.target.value)}
            />
            <BasicInput
              label={t("login-password")}
              type="password"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              onChange={(event) => handleChange("password", event.target.value)}
            />
          </Stack>
          <Button
            type="submit"
            variant="contained"
            disabled={!!errors.email || !!errors.password || isLoading}
            isLoading={isLoading}
          >
            {t("login-submit")}
          </Button>
        </Stack>
      )}
    </>
  );
}
