import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/app/services/auth";
import type { RootState } from "@/app/store";
import { save, remove, get, types } from "@/utils/localStorage";

type AuthState = {
  user: User | null;
  token: string | null;
  tokenExpiration: number | null;
  refreshToken: string | null;
  refreshTokenExpiration: number | null;
};

const storedUser = get(types.USER);
const storedToken = get(types.AUTHENTICATION);
const storedTokenExp = get(types.AUTHENTICATION_EXP);
const storedRefreshToken = get(types.REFRESH_TOKEN);
const storedRefreshTokenExp = get(types.REFRESH_TOKEN_EXP);

const slice = createSlice({
  name: "auth",
  initialState: {
    user: storedUser || null,
    token: "storedToken" || null,
    tokenExpiration: storedTokenExp || null,
    refreshToken: storedRefreshToken || null,
    refreshTokenExpiration: storedRefreshTokenExp || null,
  } as AuthState,
  reducers: {
    setCredentials: (
      state,
      {
        payload,
      }: PayloadAction<{ email: string; token: string; refreshToken: string }>
    ) => {
      state.user = payload;
      state.token = payload.token;

      const tokenPayload = JSON.parse(window.atob(payload.token.split(".")[1]));
      state.tokenExpiration = tokenPayload.exp;

      state.refreshToken = payload.refreshToken;

      const refreshTokenPayload = JSON.parse(
        window.atob(state.refreshToken.split(".")[1])
      );
      state.refreshTokenExpiration = refreshTokenPayload.exp;

      save(types.USER, payload);
      save(types.AUTHENTICATION, payload.token);
      save(types.AUTHENTICATION_EXP, tokenPayload.exp);
      save(types.REFRESH_TOKEN, payload.refreshToken);
      save(types.REFRESH_TOKEN_EXP, refreshTokenPayload.exp);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      remove(types.USER);
      remove(types.AUTHENTICATION);
      remove(types.AUTHENTICATION_EXP);
      remove(types.REFRESH_TOKEN);
      remove(types.REFRESH_TOKEN_EXP);
    },
  },
});

export const { setCredentials, logout } = slice.actions;

export default slice.reducer;

export const selectAuthToken = (state: RootState) => state.auth.token;
