import { useContext } from "react";
import { ApiContext } from "@/hook/api";

const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error(
      "The use of useApi must be used within a ApiContext.Provider"
    );
  }
  return context;
};

export default useApi;
