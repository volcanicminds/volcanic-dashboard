import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FormattedMessage } from "react-intl";
import { useState } from "react";
import { Stack, Box, Typography, TextField, Button } from "@mui/material";
import { useForgotPasswordMutation } from "@/app/services/auth";
import type { ForgotPasswordRequest } from "@/app/services/auth";

export default function ForgotPassword() {
  const [forgotPassword, { isLoading, error }] = useForgotPasswordMutation();
  const schema = yup.object().shape({
    //TODO: internationalizations of error messages
    email: yup.string().email().required(),
  });
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });

  const onSubmit = async (record: ForgotPasswordRequest) => {
    try {
      await forgotPassword(record).unwrap();
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
      <Typography variant="h2">*Forgot Password*</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <TextField {...register("email")} />
          {errors.email && (
            <Typography color="error">{errors.email.message}</Typography>
          )}
          <Button disabled={isLoading} type="submit" variant="contained">
            <FormattedMessage
              id="form.send"
              description="The forgot password send button"
            />
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
