import { BaseQueryFn, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "@/app/store";
import { logout, setCredentials } from "@/app/store/authSlice";
import { User, RefreshTokenResponse } from "@/app/services/auth";

interface ApiErrorData {
  code: string;
  message: string;
  statusCode: number;
}

export const baseQueryNoAuth = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
});

export const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    // By default, if we have a token in the store, let's use that for authenticated requests
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn = async (
  args,
  api,
  extraOptions
) => {
  const { getState, dispatch } = api;
  let result = await baseQuery(args, api, extraOptions);
  if (
    result?.error?.status === 500 &&
    (result?.error?.data as ApiErrorData)?.code === "FAST_JWT_EXPIRED"
  ) {
    try {
      const token = (getState() as RootState).auth.token;
      const refreshToken = (getState() as RootState).auth.refreshToken;
      // send refresh token to get new access token
      const refreshResult = await baseQueryNoAuth(
        {
          url: "/auth/refresh-token",
          method: "POST",
          body: {
            token,
            refreshToken,
          },
        },
        api,
        extraOptions
      );

      if (refreshResult?.data) {
        const user = (getState() as RootState).auth.user as User;
        // store the new token
        const refreshData = refreshResult.data as RefreshTokenResponse;
        dispatch(setCredentials({ ...user, ...refreshData }));
        // retry the original query with new access token
        result = await baseQuery(args, api, extraOptions);
      } else {
        throw refreshResult?.error;
      }
    } catch (e) {
      console.warn(e);
      dispatch(logout());
    }
  }

  return result;
};
