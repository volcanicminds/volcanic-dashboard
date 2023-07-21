import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryNoAuth } from "@/app/services/common";

export interface User {
  email: string;
  token: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
}

export interface UserResponse {
  email: string;
  token: string;
  refreshToken: string;
}

export type ForgotPasswordResponse = undefined;
export type ResetPasswordResponse = undefined;

export interface LoginRequest {
  email: string;
  password: string;
}
export interface RefreshTokenRequest {
  token: string;
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}
export interface ResetPasswordRequest {
  code: string;
  newPassword1: string;
  newPassword2: string;
}

export const auth_api = createApi({
  reducerPath: "auth_api",
  baseQuery: baseQueryNoAuth,
  endpoints: (builder) => ({
    login: builder.mutation<UserResponse, LoginRequest>({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    forgotPassword: builder.mutation<
      ForgotPasswordResponse,
      ForgotPasswordRequest
    >({
      query: (data) => ({
        url: "auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation<
      ResetPasswordResponse,
      ResetPasswordRequest
    >({
      query: (data) => ({
        url: "auth/reset-password",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = auth_api;
