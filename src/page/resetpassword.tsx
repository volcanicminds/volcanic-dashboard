import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FormattedMessage } from "react-intl";
import { useState } from "react";
import { Stack, TextField, Typography, Button, Box } from "@mui/material";
import { useResetPasswordMutation } from "@/app/services/auth";
import type { ResetPasswordRequest } from "@/app/services/auth";

interface ResetPassword {
  expiredPassword?: boolean;
}

export default function ResetPassword({ expiredPassword }: ResetPassword) {
  const [resetPassword, { isLoading, error }] = useResetPasswordMutation();
  const schema = yup.object().shape({
    //TODO: internationalizations of error messages
    code: yup.string().required(),
    newPassword1: yup.string().required(),
    newPassword2: yup.string().required(),
  });
  const [done, setDone] = useState(false);
  const [searchParams] = useSearchParams();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(schema),
    defaultValues: {
      code: searchParams.get("code") || "",
    },
  });
  const formValues = watch();

  const onSubmit = async (record: ResetPasswordRequest) => {
    try {
      await resetPassword(record).unwrap();
      reset({});
      setDone(true);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Box
      sx={{
        margin: "auto",
        marginTop: "5rem",
      }}
    >
      <Typography variant="h2">*Reset Password*</Typography>
      <Typography variant="h1">
        <FormattedMessage
          id={expiredPassword ? "auth.expired" : "auth.forgot"}
          description="Title of the reset password page"
        />
      </Typography>
      {!formValues.code && (
        <Typography color="error">
          <FormattedMessage
            id="auth.no_code_in_uri"
            description="Title of the reset password page"
          />
        </Typography>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <TextField type="hidden" {...register("code")} />
          <TextField {...register("newPassword1")} />
          {errors.newPassword1 && (
            <Typography color="error">{errors.newPassword1.message}</Typography>
          )}
          <TextField {...register("newPassword2")} />
          {errors.newPassword2 && (
            <Typography color="error">{errors.newPassword2.message}</Typography>
          )}
          <Button disabled={isLoading} type="submit" variant="contained">
            <FormattedMessage id="form.send" description="Submit form button" />
          </Button>
        </Stack>
      </form>
      <Typography
        color={done ? "success" : isLoading ? "warning" : error ? "error" : ""}
      >
        {done
          ? "DONE"
          : isLoading
          ? "loading"
          : error
          ? JSON.stringify(error)
          : "NOT done"}
      </Typography>
    </Box>
  );
}
