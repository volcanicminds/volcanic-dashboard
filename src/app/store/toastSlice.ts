import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";

type Severity = "error" | "success" | "info" | "warning";

const slice = createSlice({
  name: "toast",
  initialState: { message: "", severity: "info" as Severity, show: false },
  reducers: {
    setToast: (
      state,
      {
        payload,
      }: PayloadAction<{ message: string; severity: Severity; show: boolean }>
    ) => {
      state.message = payload.message;
      state.severity = payload.severity;
      state.show = payload.show;
    },
  },
});

export const { setToast } = slice.actions;

export default slice.reducer;

export const selectToast = (state: RootState) => state.toast;
