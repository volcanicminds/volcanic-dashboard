import { OptionsObject, useSnackbar } from "notistack";

const useToast = () => {
  const { enqueueSnackbar } = useSnackbar();

  const addNotification = (message: string, options?: OptionsObject) =>
    enqueueSnackbar(message, options);

  return {
    addNotification,
  };
};

export default useToast;
