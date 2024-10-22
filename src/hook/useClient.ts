import { useContext } from "react";
import { ClientContext } from "@/hook/client";

export default function useClient() {
  return useContext(ClientContext);
}
