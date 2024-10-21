import axios from "axios";
import { ClientContext } from "@/hook/client";
import { useAuth } from "@/components/AuthProvider";

const SKIP_AUTH_URLS = ["login"];
const REQUESTS_TIMEOUT = import.meta.env.VITE_DEFAULT_TIMEOUT || 5 * 1000; // 5 seconds
axios.defaults.timeout = REQUESTS_TIMEOUT;

export default function ClientWrapper(props: any) {
  const { children } = props;
  const { token: AuthToken } = useAuth();

  const client = axios.create({
    baseURL:
      import.meta.env.VITE_API_BASE_URL + import.meta.env.VITE_API_BASE_PATH,
  });

  client.interceptors.request.use(async (config: any) => {
    if (!SKIP_AUTH_URLS.includes(config.url)) {
      if (AuthToken) {
        config.headers.Authorization = `Bearer ${AuthToken}`;
      }
    }
    return config;
  });

  return (
    <ClientContext.Provider
      value={{
        client,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
}
