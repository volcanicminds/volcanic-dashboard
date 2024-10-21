import { useContext } from "react";
import { ClientContext } from "./client";

export default function useClient() {
  return useContext(ClientContext);
}
