import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import { save, get, types } from "@/utils/localStorage";

type CustomizationState = {
  theme: "light" | "dark";
  isDrawerOpen: boolean;
};

const storedTheme = get(types.THEME);

const slice = createSlice({
  name: "customization",
  initialState: {
    theme: storedTheme || "light",
    isDrawerOpen: true,
  } as CustomizationState,
  reducers: {
    changeTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
      save(types.THEME, state.theme);
    },
    openDrawer: (state, { payload }: PayloadAction<{ open: boolean }>) => {
      state.isDrawerOpen = payload.open;
    },
  },
});

export const { changeTheme, openDrawer } = slice.actions;

export default slice.reducer;

export const selectCurrentTheme = (state: RootState) =>
  state.customization.theme;

export const selectIsDrawerOpen = (state: RootState) =>
  state.customization.isDrawerOpen;
