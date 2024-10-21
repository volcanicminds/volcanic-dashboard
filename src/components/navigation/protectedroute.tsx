import { Navigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";

const Protected = ({ children }: { children: any }) => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};
export default Protected;
