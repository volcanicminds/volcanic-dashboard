import { ReactNode, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectToast } from "@/app/store/toastSlice";
import { enqueueSnackbar } from "notistack";

export default function ToastWrapper({ children }: { children: ReactNode }) {
  const toast = useSelector(selectToast);

  useEffect(() => {
    if (toast && toast.show) {
      enqueueSnackbar(toast.message, {
        variant: toast.severity,
        preventDuplicate: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast]);

  return <>{children}</>;
}
