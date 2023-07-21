import { configureStore } from "@reduxjs/toolkit";
import { auth_api } from "@/app/services/auth";
import listenerMiddleware from "@/app/services/resetToast";
import authReducer from "@/app/store/authSlice";
import customizationReducer from "@/app/store/customizationSlice";
import toastReducer from "@/app/store/toastSlice";

export const store = configureStore({
  reducer: {
    [auth_api.reducerPath]: auth_api.reducer,
    auth: authReducer,
    customization: customizationReducer,
    toast: toastReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .prepend(listenerMiddleware.middleware)
      .concat(auth_api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
