import { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectAuthToken } from "@/app/store/authSlice";

export const useAuth = () => {
  const token = useSelector(selectAuthToken);

  return useMemo(() => ({ token }), [token]);
};
