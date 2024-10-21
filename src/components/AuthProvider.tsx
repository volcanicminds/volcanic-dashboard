import { get, save, remove, TOKEN_STORAGE_KEY } from "@/utils/localStorage";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

interface AuthContextType {
  token: any;
  setToken: (user: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(() => {
    return get(TOKEN_STORAGE_KEY) || null;
  });

  const saveToken = useCallback((newToken: string | null) => {
    setToken(newToken);
    if (newToken) {
      save(TOKEN_STORAGE_KEY, newToken);
    } else {
      remove(TOKEN_STORAGE_KEY);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, setToken: saveToken }}>
      {children}
    </AuthContext.Provider>
  );
};
