import { createListenerMiddleware } from "@reduxjs/toolkit";
import { setToast } from "@/app/store/toastSlice";
import { RESET_TOAST_INTERVAL } from "@/utils/config";

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  actionCreator: setToast,
  effect: async (action, listenerApi) => {
    listenerApi.cancelActiveListeners();
    await listenerApi.delay(RESET_TOAST_INTERVAL);
    if (action.payload.show) {
      listenerApi.dispatch(
        setToast({ message: "", severity: "info", show: false })
      );
    }
  },
});

export default listenerMiddleware;
