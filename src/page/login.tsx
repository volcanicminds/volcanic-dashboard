import { useForm } from "react-hook-form";
import { Box, TextField, Button, Stack, Typography } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "@/app/store/authSlice";
import { useLoginMutation } from "@/app/services/auth";
import type { LoginRequest } from "@/app/services/auth";
import { types, save, get } from "@/utils/localStorage";

export default function Login() {
  const [login, { isLoading, isError, error }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const schema = yup.object().shape({
    //TODO: insert internationalized errors
    email: yup.string().email().required(),
    password: yup.string().required(),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(schema),
    defaultValues: {
      email: get(types.LOGIN_EMAIL),
    },
  });

  const onSubmit = async (record: LoginRequest) => {
    try {
      save(types.LOGIN_EMAIL, record.email);
      const user = await login(record).unwrap();
      dispatch(setCredentials(user));
      reset({});
      navigate("/");
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
      <Typography variant="h2">*Login*</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <TextField {...register("email")} />
          {errors.email && (
            <Typography color="error">{errors.email.message}</Typography>
          )}
          <br />
          <TextField {...register("password")} />
          {errors.password && (
            <Typography color="error">{errors.password.message}</Typography>
          )}
          <Button variant="contained" disabled={isLoading} type="submit">
            Login
          </Button>
          {isError ? (
            <Typography color="error">{JSON.stringify(error)}</Typography>
          ) : (
            ""
          )}
        </Stack>
      </form>
    </Box>
  );
}
